const express = require('express')
const app = express()

const cors = require('cors')

const books = require('./routes/books.js')

app.use(cors())

app.use(books)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`La api esta en http://localhost/3001`)
})

