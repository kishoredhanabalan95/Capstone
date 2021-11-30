import React, { Component } from 'react';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            inputValue: '',
            connected: false,
            name: window.sessionStorage.getItem('name'),
            userid: window.sessionStorage.getItem('userid'),
            room: '',
            showChatWindow: true,
            messages: []
        };
        this.sendSocketIO = this.sendSocketIO.bind(this);
        this.socket = null;
    }

    componentDidMount() {
        this.socket =  openSocket('http://localhost:8000');

        this.socket.on('connect', function (data) { // we are connected, should send our name
            this.setState({
                connected: true
            });
            if (!!this.state.userid) {
                this.socket.emit('login', {'username' : this.state.name});
                // this.startChat();
            }
        }.bind(this));

        this.socket.on('chat start', function(data) {
            this.setState({
                room: data.room
            });
            // this.show_chat_window(); // some method which will show chat window
        }.bind(this));

        this.socket.on('message', function(data) {
            this.setState({
                messages: [ ...this.state.messages, { message: data.text, user: data.user, time: new Date() } ]
            });
            console.log(this.state.messages);
        }.bind(this));

        this.socket.on('chat end', function(data) {
            this.setState({
                showChatWindow: false
            });
            this.socket.leave(this.state.room); // it's possible to leave from both server and client, hoever it is better to be done by the client in this case
            this.setState({
                room: ''
            });
        }.bind(this));

        this.socket.on('disconnect', function(data) { // handle server/connection falling
            console.log('Connection fell or your browser is closing.');
        });
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    sendSocketIO() {
        if (this.state.connected) this.socket.emit('message', {'text': this.state.inputValue, 'user': this.state.name});
        this.setState({
            messages: [ ...this.state.messages, { message: this.state.inputValue, user: 'me', time: new Date() } ]
        });
        this.setState({
            inputValue: ''
        });
    }

    leaveChat() { // call this when user want to end current chat
        if (this.state.connected) {
            this.socket.emit('leave room');
            this.socket.leave(this.state.room);
            this.setState({
                room: ''
            });
        }
    };

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }

    pad(num) {
        return ("0" + num).slice(-2);
    }

    getTimeFromDate(timestamp) {
        const date = new Date(timestamp * 1000);
        let hours = date.getHours(),
            minutes = date.getMinutes();
        return this.pad(hours) + ":" + this.pad(minutes);
    }

    render() {
        if (!this.state.userid) {
            let currLoc = window.location.href;
            currLoc = currLoc.substring(0, currLoc.length - 5);
            window.location.href = currLoc;
        }

        return (
            <div className="container h-100">
                {/* <div className="row h-100 justify-content-center align-items-center">
                    <form className="col-12">
                        <div className="form-group text-center">
                            <button onClick={this.connectSocket}>Start Chat</button>
                        </div>
                    </form>   
                </div> */}
                {!!this.state.room && <div className="chatBox">
                    <ul id="messages">
                    {this.state.messages.map(function(message, i){
                        if (message.user === 'me') {
                            return (<li className="myMessage" key={i}>
                                    <div>{ message.message }</div>
                                    <small className="messageTime">{ this.getTimeFromDate(new Date(message.time)) }</small>
                                </li>);
                        } else {
                            return (<li className="userMessage" key={i}>
                                <b>{ message.user }</b>
                                <div>{ message.message }</div>
                                <small className="messageTime">{ this.getTimeFromDate(new Date(message.time)) }</small>
                            </li>);
                        }
                    }.bind(this))}
                    </ul>
                    <div id="form">
                        <input value={this.state.inputValue} id="input" autoComplete="off" onChange={evt => this.updateInputValue(evt)} />
                        <button onClick={this.sendSocketIO}>Send</button>
                    </div>
                </div>}
            </div>
        );
    }
}

export default Home;
