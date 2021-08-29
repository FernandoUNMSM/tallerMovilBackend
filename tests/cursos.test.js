const supertest = require('supertest')
const request = require('supertest')
const { app } = require('../index')
const api = supertest(app)

// Suit de pruebas para cursos
describe('tests de Cursos', () => {
  // Prueba para obtener cursos
  test('Get course by ID', async () => {
    const response = await api
      .get('/courses/5')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.data.curso_id).toBe(5)
  })
  // Prueba para verificar la lista de cursos agregados
  test('GET /listarCursosAgregadosPorProfesor', async() => {
    const response = await request(app).get('/listarCursosAgregadosPorProfesor/1645')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
  // Prueba para verificar la lista de cursos con solicitud de acceso
  test('GET /listarCursosConSolicicitudAcceso', async() => {
    const response = await request(app).get('/listarCursosConSolicicitudAcceso/8205')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
  // Prueba para verificar la lista de cursos con solicitud de acceso para el alumno
  test('GET /listarCursosConSolicicitudAccesoParaAlumnos', async() => {
    const response = await request(app).get('/listarCursosConSolicicitudAccesoParaAlumnos/23285')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
  // Prueba para verificar la union a un curso por codigo
  test('POST /unirPorCodigo', async() => {
    let nuevo = {
      codigo: 'HLS31M87',
      usuario_id: 1735
    }
    const response = await request(app).post('/unirPorCodigo').send(nuevo)
        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body.body).not.toBeNull()
  })
})
afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500));
})

// Suit de pruebas para Curso - Usuario
describe('Test de Curso -Usuario', () => {
  // Prueba para verificar la inscripcion de un alumno a un curso
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
  // Prueba para verificar la inscripcion de un alumno a un curso
  test('POST /aceptarInvitacionDeProfesor ', async() => {
    let nuevo = {
      usuario_id: 1735,
      curso_id: 4935,
      situacion_id: 5
    }
    const response = await request(app).post('/aceptarInvitacionDeProfesor ').send(nuevo)
        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body.body).not.toBeNull()
  })
  // Prueba para verificar la aceptacion de una solicitud de acceso
  test('POST /aceptarSolicitudAcceso', async() => {
    let nuevo = {
      usuario_id: 1735,
      curso_id: 6025,
      situacion_id: 1
    }
    const response = await request(app).post('/aceptarSolicitudAcceso').send(nuevo)
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
})

// Suit de pruebas para Notificaciones
describe('Test de Notificaciones', () => {
  // Prueba para verficar la crecion de una notificacion
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
  // Prueba para verificar el listado de notificaciones por usuario
  test('GET /listarNotificacionesPorUsuario', async() => {
    const response = await request(app).get('/listarNotificacionesPorUsuario/1635')
        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body.body).not.toBeNull()
  })
})

