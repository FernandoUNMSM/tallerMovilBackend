const supertest = require('supertest')
const { app } = require('../index')
// const srv = app.listen()
const api = supertest(app)

describe('tests de Cursos', () => {
  test('Get course by ID', async () => {
    const response = await api
      .get('/courses/5')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.data.curso_id).toBe(5)
  })
})

// afterAll(async (done) => {
//   // pool.end()
//   await server.close(done)
// })