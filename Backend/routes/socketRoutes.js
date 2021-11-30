import express from 'express'
const socketRoutes = express.Router()
import {
  getUser,
  registerUser
} from '../controllers/socketController'

socketRoutes.get('', getUser);
socketRoutes.post('/', registerUser);

export default socketRoutes
