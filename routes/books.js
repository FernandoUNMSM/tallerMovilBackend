/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()

const Book = require('../models/Book')
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const userExtractor = require('./../middleware/userExtractor')

router.get('/books', async (req, res) => {
  const books = await Book.find({}).populate('user', {
    books: 0,
    _v: 0
  })
  res.status(200).json({
    books: books.map(book => {
      const {_id, __v, ...restOfBook} = book._doc
      return {...restOfBook, id: _id}
    })
  })
})

router.get('/books/:id', (req, res, next) => {
  const {id} = req.params
  Book.findById(id)
    .then(book => {
      if (book) {
        res.status(200).json(book)
      } else {
        const e = new Error()
        e.name = 'CastError'
        next(e)
      }
    }).catch(next)
})

router.post('/books', userExtractor, async (req, res, next) => {
  const {name, author, saga, number} = req.body

  const user = await User.findById(req.userId)

  if (!name) {
    return res.status(400).json({
      error: 'name is required'
    })
  }

  const newBook = new Book({
    name,
    author,
    saga,
    number,
    user: user._id
  })

  try {
    const savedBook = await newBook.save()

    user.books = user.books.concat(savedBook._id)
    await user.save()

    res.status(201).json(savedBook)
  } catch (e) {
    next(e)
  }
})

router.put('/books/:id', (req, res, next) => {
  const { id } = req.params
  const {name, author, saga, number} = req.body
  const book = {
    name,
    author,
    saga,
    number
  }
  Book.findByIdAndUpdate(id, book, {new: true})
    .then(book => res.status(200).json(book))
    .catch(next)
})

router.delete('/books/:id', async (req, res, next) => {
  const { id } = req.params
  // Book.findByIdAndRemove(id)
  //   .then(book => res.status(204).json(book))
  //   .catch(next)

  try {
    const book = await Book.findByIdAndRemove(id)
    if (book) {
      res.status(204).json(book)
    } else {
      const e = new Error()
      e.name = 'CastError'
      next(e)
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router
