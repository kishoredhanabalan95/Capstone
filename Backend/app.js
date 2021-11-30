import connectDB from './config/db.js'
import socketRoutes from './routes/socketRoutes'
import socketMessageRoutes from './routes/socketMessageRoutes'
import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from "cors"

var queue = [];    // list of sockets waiting for peers
var rooms = {};    // map socket.id => room
var names = {};    // map socket.id => name
var allUsers = {}; // map socket.id => socket

connectDB()

const app = express();
app.use(cors({
    origin: 'http://localhost'
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost',
    }
});

var findPeerForLoneSocket = function(socket) {
    // this is place for possibly some extensive logic
    // which can involve preventing two people pairing multiple times
    if (queue && queue.length) {
        // somebody is in queue, pair them!
        var peer = queue.pop();
        var room = socket.id + '#' + peer.id;
        // join them both
        peer.join(room);
        socket.join(room);
        // register rooms to their names
        rooms[peer.id] = room;
        rooms[socket.id] = room;
        // exchange names between the two of them and start the chat
        peer.emit('chat start', {'name': names[socket.id], 'room':room});
        socket.emit('chat start', {'name': names[peer.id], 'room':room});
    } else {
        // queue is empty, add our lone socket
        queue.push(socket);
    }
}

io.on('connection', function (socket) {
    console.log('User '+socket.id + ' connected');
    socket.on('login', function (data) {
        names[socket.id] = data.username;
        allUsers[socket.id] = socket;

        // now check if sb is in queue
        findPeerForLoneSocket(socket);
    });
    socket.on('message', function (data) {
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('message', data);
    });
    socket.on('leave room', function () {
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('chat end');
        var peerID = room.split('#');
        peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
        // add both current and peer to the queue
        findPeerForLoneSocket(allUsers[peerID]);
        findPeerForLoneSocket(socket);
    });
    socket.on('disconnect', function () {
        console.log(rooms);
        var room = rooms[socket.id];
        console.log(rooms, socket.id);
        socket.broadcast.to(room).emit('chat end');
        var peerID = room.split('#');
        peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
        // current socket left, add the other one to the queue
        findPeerForLoneSocket(allUsers[peerID]);
    });
});

io.listen(8000);

app.use('/api/user', socketRoutes)
app.use('/api/message', socketMessageRoutes)

app.listen(
    8080,
    console.log(
        `Server running in 8080`
    )
)
