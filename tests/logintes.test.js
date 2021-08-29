//importamos la libreria supertesr
const supertest = require('supertest')
//importamos la app
const { app } = require('../index')
//App + supertest
const api = supertest(app)
//Definicion del pool sql
const pool = require('../src/database');
//Nos trae el metodo para hacer querys a la BD

//Declaramos el test
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

//Declaramos el test
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
//Declaramos el test
test('Create sugerences', async () => {
  const newSuggestion = {
    categoria_id: 15,
    sugerencia_nombre_curso: 'Prueba'
  }
  const response = await api
    .post('/suggestions')
    .send(newSuggestion)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const idSuggestionCreated = response.body.sugerencia_id

  await pool.query('DELETE FROM sugerencias WHERE sugerencia_id = ?', [idSuggestionCreated])
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500));
});