import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chatid: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

const Message = mongoose.model('messages', messageSchema)

export default Message
