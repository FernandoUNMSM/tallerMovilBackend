const supertest = require('supertest')
const request = require('supertest')
const { app } = require('../index')
const api = supertest(app)

describe('tests de Cursos', () => {
  test('Get course by ID', async () => {
    const response = await api
      .get('/courses/5')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.data.curso_id).toBe(5)
  })
  test('GET /listarCursosAgregadosPorProfesor', async() => {
    const response = await request(app).get('/listarCursosAgregadosPorProfesor/1645')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
  test('GET /listarCursosConSolicicitudAcceso', async() => {
    const response = await request(app).get('/listarCursosConSolicicitudAcceso/8205')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
})
afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500));
})

describe('Test de Curso -Usuario', () => {
  test('POST /coursesUsers', async() => {
    let nuevo = {
      curso_id: 435,
      correo: 'dfvaler@gmail.com'
    }
    const response = await request(app).post('/coursesUsers').send(nuevo)
        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body.body).not.toBeNull()
  })
})

describe('Test de Notificaciones', () => {
  test('POST /notificacion', async() => {
    let nuevaNotificacion = {
      tarea_asignada_id: 5,
      notificacion: 'Tarea 3'
    }
    const response = await request(app).post('/notificacion').send(nuevaNotificacion)
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
  test('GET /listarNotificacionesPorUsuario', async() => {
    const response = await request(app).get('/listarNotificacionesPorUsuario/1635')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
})

