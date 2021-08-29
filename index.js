require('dotenv').config()

const express = require('express')

let corsOptions = {
  origin: '*' // Compliant
};

let helmet = require("helmet");
let app = express(); // Compliant
app.use(helmet.hidePoweredBy());

const cors = require('cors')

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true, limit: "8mb"}));
app.use(express.json())


const users = require('./routes/users')
const login = require('./routes/login')
const course = require('./routes/courses')
const suggestions = require('./routes/suggestions')
const categories = require('./routes/categories')
const tasks = require('./routes/tasks')

const notFound = require('./middleware/notFound')
const errors = require('./middleware/errors')

app.use(login)
app.use(users)
app.use(course)
app.use(suggestions)
app.use(categories)
app.use(tasks)

app.get('/', (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})

// Control del 404
app.use(notFound)
// Control de errores
app.use(errors)

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`La api esta en http://localhost:${PORT}`);
  })

}


module.exports = { app }