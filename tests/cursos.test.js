const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const pool = require('../src/database');

describe('tests de Cursos', () => {
  test('Get course by ID', async () => {
    const response = await api
      .get('/courses/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.data.curso_id).toBe(35)
  })
  test('Get all courses', async () => {
    await api
      .get('/coursespublic')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get max courses', async () => {
    await api
      .get('/coursespublicmax')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get courses by user', async () => {
    await api
      .get('/coursesofuser/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get courses by user', async () => {
    await api
      .get('/course-user/135')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('CREATE one course', async () => {
    const newCourse = {
      usuario_id: 35
    }
    const response = await api
      .post('/courses')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const idCourseCreated = response.body.curso_id

    await pool.query('DELETE FROM cursos WHERE curso_id = ?', [idCourseCreated])
  })
  test('GET /listarCursosAgregadosPorProfesor', async () => {
    const response = await api
      .get('/listarCursosAgregadosPorProfesor/1645')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('GET /listarCursosConSolicicitudAcceso', async () => {
    const response = await api.
      get('/listarCursosConSolicicitudAcceso/8205')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Suggestions test', () => {
  test('Get all suggestions', async () => {
    await api
      .get('/suggestions')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get one suggestions', async () => {
    await api
      .get('/suggestions/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get votes for user', async () => {
    await api
      .get('/listarVotosUsuario/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get all votes sugerences', async () => {
    await api
      .get('/listarSugerenciasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Get all max votes sugerences', async () => {
    await api
      .get('/listarSugerenciasMasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('USERS tests', () => {
  test('Get all users', async () => {
    const response = await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('Get one user', async () => {
    const response = await api
      .get('/users/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('Edit one user', async () => {
    const editUser = {
      usuario_nombre: 'pruebatest',
      usuario_apellidos: 'pruebatest',
      url: 'pruebatesturl',
      correo: 'prueba@prueba.com'
    }
    const response = await api
      .post('/useredit/215')
      .send(editUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
});

describe('Tasks tests', () => {
  test('Get tareas curso', async () => {
    await api
      .get('/listarTareasCurso/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('List taks curso', async () => {
    await api
      .get('/list-task/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

});

describe('Test de Curso -Usuario', () => {
  test('POST /coursesUsers', async () => {
    let nuevo = {
      curso_id: 435,
      correo: 'dfvaler@gmail.com'
    }
    const response = await api.
      post('/coursesUsers')
      .send(nuevo)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Test de Notificaciones', () => {
  test('POST /notificacion', async () => {
    let nuevaNotificacion = {
      tarea_asignada_id: 5,
      notificacion: 'Tarea 3'
    }
    const response = await api.
      post('/notificacion')
      .send(nuevaNotificacion)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('GET /listarNotificacionesPorUsuario', async () => {
    const response = await api.
      get('/listarNotificacionesPorUsuario/1635')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Material test', ()=> {
  test('List Material by course', async () => {
    await api
      .get('/listMaterials/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Categories test', ()=> {
  test('GET all categories', async () => {
    await api
      .get('/categories')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('GET one categories', async () => {
    await api
      .get('/categories/15')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('GET one categories fail', async () => {
    await api
      .get('/categories/12')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
})