import express from 'express'
const socketMessageRoutes = express.Router()
import {
  addMessage,
  getMessages
} from '../controllers/socketMessageController'

socketMessageRoutes.get('', getMessages);
socketMessageRoutes.post('/', addMessage);

export default socketMessageRoutes