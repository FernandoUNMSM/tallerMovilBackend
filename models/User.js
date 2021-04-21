const mongoose = require('mongoose')
const { Schema, model } = mongoose

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
