const mongoose = require('mongoose')

const {server} = require('../index')
const Book = require('../models/Book')

const {
  api,
  books,
  getAllContentFromNotes
} = require('./helpers')

beforeEach(async () => {
  await Book.deleteMany({})

  for (const book of books) {
    console.log(book)
    const bookObject = new Book(book)
    await bookObject.save()
  }
})

describe('GET Book', () => {
  test('books are returned as json', async () => {
    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('books are returned books', async () => {
    const response = await api.get('/books')
    expect(response.body.books).toHaveLength(books.length)
  })

  test('the name of first book is Juramentada', async () => {
    const response = await api.get('/books')
    expect(response.body.books[0].name).toBe('Juramentada')
  })

  test('contain name Juramentada', async () => {
    const response = await api.get('/books')
    const names = response.body.books.map(book => book.name)
    expect(names).toContain('Juramentada')
  })
})

describe('POST books', () => {
  test('send a valid book to api', async () => {
    const newBook = {
      name: 'El camino de los reyes',
      author: ['Brandon Sanderson'],
      saga: 'El archivo de las tormetas',
      number: 4,
      userId: '6074690321e7764f80388b3e'
    }

    await api
      .post('/books')
      .send(newBook)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const {response, names} = await getAllContentFromNotes()

    expect(names).toContain(newBook.name)
    expect(response).toHaveLength(books.length + 1)
  })

  test('send a invalid book to api', async () => {
    const newBook = {
      author: ['Brandon Sanderson'],
      saga: 'El archivo de las tormetas'
    }

    await api
      .post('/books')
      .send(newBook)
      .expect(400)

    const {response} = await getAllContentFromNotes()
    expect(response).toHaveLength(books.length)
  })
})

describe('Test DELETE books', () => {
  test('a book can be deleted', async () => {
    const {response: firstResponse} = await getAllContentFromNotes()
    // const {body: books} = response
    const bookToDelete = firstResponse[0]

    await api
      .delete(`/books/${bookToDelete.id}`)
      .expect(204)

    const {names, response: secondResponse} = await getAllContentFromNotes()

    expect(secondResponse.length).toBe(books.length - 1)
    expect(names).not.toContain(bookToDelete.name)
  })

  test('a book cant be deleted because id is undefined', async () => {
    const response = await api
      .delete(`/books/${undefined}`)
      .expect(400)

    expect(response.body.error).toBe('id used is malformed')
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

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
