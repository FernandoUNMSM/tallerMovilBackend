const mongoose = require('mongoose')

const {server} = require('../index')
const User = require('../models/User')

const {
  api,
  getUsers
} = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({
    name: 'amelia',
    username: 'gura',
    passwordHash: 'gawr'
  })
  await user.save()
})

describe.only('POST users', () => {
  test('create a user', async () => {
    const newUser = {
      name: 'watson',
      username: 'kotori',
      password: 'gawr'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await User.find({})
    expect(users.length).toBe(2)
  })

  test('creation fails with proper statuscode and message id username is already taken', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      name: 'amelia',
      username: 'gura',
      password: 'gawr'
    }

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

beforeAll((done) => {
  const connectionString = process.env.DB_URI_TEST

  const connectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
  }

  mongoose.connect(connectionString, connectionOptions, () => done())
})

afterAll((done) => {
  // mongoose.connection.close(() => done())
  server.close()
})
