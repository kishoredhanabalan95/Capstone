import asyncHandler from 'express-async-handler'
import Socket from '../models/socketModel'

const getUser = asyncHandler(async (req, res) => {

  Socket.findOne({ userid: ('' + req.query.userid).toLowerCase() }, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      if (!!result && !!result.userid) {
        if ('' + req.query.password == result.password) {
          res.status(201).json(result)
        } else {
          res.status(400).send({ message: 'Incorrect Password' });
        }
      } else {
        res.status(400).send({ message: 'Invalid User' });
      }
    }
  });
})

const registerUser = asyncHandler(async (req, res) => {

  Socket.findOne({ userid: ('' + req.body.userid).toLowerCase() }, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      if (!result || !result.userid) {
        if (!!req.body.userid && !!req.body.name && !!req.body.password) {
          const userid = ('' + req.body.userid).toLowerCase()
          const user = new Socket({ ...req.body, userid: userid });
          user.save(function (error, user) {
            if (error) res.json(error);
            res.status(201).json({ success: user.name + " added to socket db." });
          });
        } else {
          res.status(400).send({ message: 'Failed to add user' });
        }
      } else {
        res.status(400).send({ message: 'User already exists' });
      }
    }
  });
})

export {
  getUser,
  registerUser,
}
