const mongoose = require('mongoose')

const {DB_URI, DB_URI_TEST, NODE_ENV} = process.env

const connectionString = NODE_ENV === 'test'
  ? DB_URI_TEST
  : DB_URI

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('db connected')
  }).catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  mongoose.disconnect()
})
