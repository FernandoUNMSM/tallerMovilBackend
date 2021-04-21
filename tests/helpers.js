const supertest = require('supertest')
const {app} = require('../index')
const api = supertest(app)
const User = require('../models/User')

const books = [
  {
    name: 'Juramentada',
    author: ['Brandon Sanderson'],
    saga: 'El Archivo De las tormentas',
    number: 1
  },
  {
    name: 'Palabras Radiantes',
    author: ['Brandon Sanderson'],
    saga: 'El Archivo De las tormentas',
    number: 2
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/books')
  return {
    names: response.body.books.map(book => book.name),
    response: response.body.books
  }
}

const getUsers = async () => {
  const users = await User.find({})
  const usersEnd = users.map(user => user.toJSON())
  return usersEnd
}

module.exports = {
  api,
  books,
  getAllContentFromNotes,
  getUsers
}
