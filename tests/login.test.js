const supertest = require('supertest')
const { app } = require('../index')
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

  expect(response.body.user).toBeDefined()
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500));
});