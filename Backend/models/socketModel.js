import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('users', userSchema)

export default User
