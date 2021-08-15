const supertest = require('supertest')
const { app } = require('../index')
// const srv = app.listen()
const api = supertest(app)

test('Login', async () => {
  const user = {
    correo: 'sebasxiom@gmail.com',
    password: 'pepicho123'
  }

  const response = await api
    .post('/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log(response.body.data)
})

// afterAll(async (done) => {
//   // pool.end()
//   await server.close(done)
// })