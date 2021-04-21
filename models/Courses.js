const mongoose = require('mongoose')
const {Schema, model} = mongoose

const courseSchema = new Schema({
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Course = model('Course', courseSchema)

module.exports = Course
