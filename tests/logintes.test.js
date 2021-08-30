//importamos la libreria supertesr
const supertest = require('supertest')
//importamos la app
const { app } = require('../index')
//App + supertest
const api = supertest(app)
//Definicion del pool sql
const pool = require('../src/database');
//Nos trae el metodo para hacer querys a la BD

//TEst de la ruta base
test('base', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
//TEst de la ruta base
test('baselogin', async () => {
  await api
    .get('/login')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

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
test('Login erroneo', async () => {
  const user = {
    correo: 'sebasxiommail.com',
    password: 'pepicho1234'
  }

  await api
    .post('/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)

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

  pool.query('DELETE FROM usuarios WHERE usuario_id = ?', [passwordCreated])
})

test('Registro fallido', async () => {
  const user = {
    usuario_nombre: 'Usuario Prueba',
    usuario_apellidos: 'Prueba Apellido',
    password: "",
    correo: 'prueba@test.com',
    url: ''
  }

  const response = await api
    .post('/register')
    .send(user)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const passwordCreated = response.body.usuario_id

  pool.query('DELETE FROM usuarios WHERE usuario_id = ?', [passwordCreated])
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
  // Prueba para verificar el listado de notificaciones por usuario
  test('GET /listarNotificacionesPorUsuario', async () => {
    const response = await api
      .get('/listarNotificacionesPorUsuario/1635')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('CREATE material', async () => {
    const nweMaterial = {
      nombre: 'Material Prueba'
    }
    const response = await api
      .post('/course-material/35')
      .send(nweMaterial)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const idMaterialCreated = response.body.material_id

    await pool.query('DELETE FROM material WHERE material_id = ?', [idMaterialCreated])
  })

  test('crear tarea', async () => {
    const newTask = {
      curso_id: 35,
      nombre: 'prueba'
    }
    const response = await api
      .post('/creartarea')
      .send(newTask)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const idMaterialCreated = response.body.tarea_id

    await pool.query('DELETE FROM tareas WHERE tarea_id = ?', [idMaterialCreated])
  })
  test('GET /archivos', async () => {
    const response = await api
      .get('/mostrarArchivo/4')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('crear entregarTarea', async () => {
    const newTask = {
      tarea_id: 5,
      usuario_id: 1635
    }
    await api
      .post('/entregarTarea')
      .send(newTask)
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
});