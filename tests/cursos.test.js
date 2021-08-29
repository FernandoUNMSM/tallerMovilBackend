//importamos la libreria supertesr
const supertest = require('supertest')
//importamos la app
const { app } = require('../index')
//App + supertest
const api = supertest(app)
//Definicion del pool sql
const pool = require('../src/database');
//Nos trae el metodo para hacer querys a la BD

//Declaracion de un describe de tests
describe('tests de Cursos', () => {
  //Declaracion del test
  test('Get course by ID', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .get('/courses/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.data.curso_id).toBe(35)
  })
  //Declaracion del test
  test('Get all courses', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursespublic')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get max courses', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursespublicmax')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get courses by user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/coursesofuser/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get courses by user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/course-user/135')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('CREATE one course', async () => {
    const newCourse = {
      usuario_id: 35
    }
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .post('/courses')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const idCourseCreated = response.body.curso_id

    await pool.query('DELETE FROM cursos WHERE curso_id = ?', [idCourseCreated])
  })
  //Declaracion del test
  test('GET /listarCursosAgregadosPorProfesor', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .get('/listarCursosAgregadosPorProfesor/1645')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET /listarCursosConSolicicitudAcceso', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api.
      get('/listarCursosConSolicicitudAcceso/8205')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

//Declaracion de un describe de tests
describe('Suggestions test', () => {
  //Declaracion del test
  test('Get all suggestions', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/suggestions')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get one suggestions', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/suggestions/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get votes for user', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarVotosUsuario/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get all votes sugerences', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarSugerenciasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('Get all max votes sugerences', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarSugerenciasMasVotos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

})

//Declaracion de un describe de tests
describe('USERS tests', () => {
  //Declaracion del test
  test('Get all users', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  //Declaracion del test
  test('Get one user', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .get('/users/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  //Declaracion del test
  test('Edit one user', async () => {
    const editUser = {
      usuario_nombre: 'pruebatest',
      usuario_apellidos: 'pruebatest',
      url: 'pruebatesturl',
      correo: 'prueba@prueba.com'
    }
    //Hacemos la llamada a la ruta de la api
    const response = await api
      .post('/useredit/215')
      .send(editUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
});

//Declaracion de un describe de tests
describe('Tasks tests', () => {
  //Declaracion del test
  test('Get tareas curso', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listarTareasCurso/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('List taks curso', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/list-task/4935')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

});

//Declaracion de un describe de tests
describe('Test de Curso -Usuario', () => {
  //Declaracion del test
  test('POST /coursesUsers', async () => {
    let nuevo = {
      curso_id: 435,
      correo: 'dfvaler@gmail.com'
    }
    //Hacemos la llamada a la ruta de la api
    const response = await api.
      post('/coursesUsers')
      .send(nuevo)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
})

//Declaracion de un describe de tests
describe('Test de Notificaciones', () => {
  //Declaracion del test
  test('POST /notificacion', async () => {
    let nuevaNotificacion = {
      tarea_asignada_id: 5,
      notificacion: 'Tarea 3'
    }
    //Hacemos la llamada a la ruta de la api
    const response = await api.
      post('/notificacion')
      .send(nuevaNotificacion)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET /listarNotificacionesPorUsuario', async () => {
    //Hacemos la llamada a la ruta de la api
    const response = await api.
      get('/listarNotificacionesPorUsuario/1635')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
})

//Declaracion de un describe de tests
describe('Material test', () => {
  //Declaracion del test
  test('List Material by course', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/listMaterials/35')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

//Declaracion de un describe de tests
describe('Categories test', () => {
  //Declaracion del test
  test('GET all categories', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET one categories', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories/15')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Declaracion del test
  test('GET one categories fail', async () => {
    //Hacemos la llamada a la ruta de la api
    await api
      .get('/categories/12')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
})