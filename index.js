const express = require('express')
const app = express()

const cors = require('cors')

const books = require('./routes/books.js')

app.use(cors())

app.use(books)

app.listen(3001, () => {
  console.log(`La api esta en http://localhost/3001`)
})

