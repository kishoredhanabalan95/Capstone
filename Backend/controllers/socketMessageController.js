import asyncHandler from 'express-async-handler'
import Message from '../models/socketMessageModel'

const getMessages = asyncHandler(async (req, res) => {

  Message.find({ chatid: ('' + req.query.chatid).toLowerCase() }, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.status(201).json({ messages: result })
    }
  });
})

const addMessage = asyncHandler(async (req, res) => {

  if (!!req.body.chatid && !!req.body.message && !!req.body.userid) {
    const message = new Message(req.body);
    message.save(function (error, message) {
      if (error) res.json(error);
      res.status(201).json("Message added to socket db.");
    });
  } else {
    res.status(400).json({ message: 'Failed to add Message' });
  }
})

export {
  addMessage,
  getMessages,
}
