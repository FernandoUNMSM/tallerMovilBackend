const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const pool = require('../src/database');

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

test('Registro', async () => {
  const user = {
    usuario_nombre: 'Usuario Prueba',
    usuario_apellidos: 'Prueba Apellido',
    password: '123',
    correo: 'prueba@test.com',
    url: ''
  }

  const response = await api
    .post('/register')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const passwordCreated = response.body.usuario_id

  await pool.query('DELETE FROM usuarios WHERE usuario_id = ?', [passwordCreated])

})


afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500));
});