require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())


const users = require('./routes/users')
const login = require('./routes/login')
const course = require('./routes/courses')
const suggestions = require('./routes/suggestions')
const categories = require('./routes/categories')


const notFound = require('./middleware/notFound')
const errors = require('./middleware/errors')

app.use(login)
app.use(users)
app.use(course)
app.use(suggestions)
app.use(categories)

app.get('/', (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})

// Control del 404
app.use(notFound)
// Control de errores
app.use(errors)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`La api esta en http://localhost:${PORT}`);
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

module.exports = { app, server }