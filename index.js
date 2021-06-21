require('dotenv').config()
// require('./mongo') //Aca estaba la conexcion con mongo

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())

const users = require('./routes/users')
const login = require('./routes/login')
const course = require('./routes/courses')


const notFound = require('./middleware/notFound')
const errors = require('./middleware/errors')

app.use(login)
app.use(users)
app.use(course)

app.get('/', (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})

app.use(notFound)// Control del 404
app.use(errors)// Control de errores

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`La api esta en http://localhost:${PORT}`);
})

module.exports = { app, server }