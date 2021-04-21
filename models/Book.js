const mongoose = require('mongoose')
const {Schema, model} = mongoose

const bookSchema = new Schema({
  name: String,
  author: [String],
  saga: String,
  numberOrder: Number,
  isbn10: Number,
  isbn13: Number,
  releaseDate: Date,
  numberPages: Number,
  editorial: String,
  language: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Book = model('Book', bookSchema)

module.exports = Book
