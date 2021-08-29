const express = require('express')
const router = express.Router()
const pool = require('../src/database')
var CodeGenerator = require('node-code-generator')

var generator = new CodeGenerator()
var pattern = '***#**##'

router.get('/cursos/:iduser', async (req, res, next) => {
  // Esta es la ruta para obtener los cursos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params

  try {
    let list

    // Aqui va el query de buscar los cursos de un usuario
    list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE usuario_id = ?', [iduser])
    // Respuesta a la peticion
    res.status(200).json({
      list
    })
  } catch (err) {
    next(err)
  }
})

router.get('/courses/:id', async (req, res, next) => {
  // Esta es la ruta para obtener la informacion de un curso

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { id } = req.params

  try {
    // Aqui va el query para obtener un curso especifico por su id
    const course = await pool.query('SELECT * FROM cursos WHERE curso_id = ?', [id])

    const alumnos = await pool.query('SELECT COUNT(*) FROM curso_usuario WHERE curso_id = ? situacion_id = 1', [id])
    // Respuesta a la peticion
    res.status(200).json({
      data: course[0],
      alumnos: Object.values(alumnos[0])[0]
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.post('/courses', async (req, res, next) => {
  // Esta es la ruta para crear un curso

  try {
    // Obtenemos los datos del cuerpo de la peticion
    const { curso_id, usuario_id, categoria_id, codigo, imagen, curso_nombre, descripcion, conoci_previo, privacidad_id, curso_fecha_creacion } = req.body

    var code = generator.generateCodes(pattern, 1, {});

    let newCourse = {
      curso_id,
      usuario_id,
      categoria_id,
      codigo: code,
      imagen,
      curso_nombre,
      descripcion,
      conoci_previo,
      privacidad_id,
      curso_fecha_creacion
    }

    // Aqui va el query para guardar un curso
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.cursos SET ? ', newCourse)
    //const savedCourse = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_nombre = ?', [curso_nombre])

    // Respuesta a la peticion
    res.status(201).json({
      msg: 'Curso creado'
    })// Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

/**
 * @param {Number} curso_id
 * @param {String} correo
 * @param {Boolean} error
 * @param {String} mensaje
 */
// Metodo post para agregar un alumno a un curso.
// Se especifica el id del curso al que se va agregar al usuario.
// Se especifica el correo del usuario que va unirse al curso.
router.post('/coursesUsers', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { curso_id, correo } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const a = await pool.query('CALL heroku_b3e0382f6ba83ba.crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // Prueba de la salida en consola
    console.log(a[0][0]['@mensaje'])
    // Se muestra la respuesta exitosa a la consulta y los mensajes de salida del procedimiento almacenado
    res.status(201).json({
      error: a[0][0]['@error'],
      msg: a[0][0]['@mensaje']
    })
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

router.post('/deletecoursesUsers', async (req, res, next) => {
  // Ruta para eliminar un usuario a un curso
  try {
    const { curso_id, usuario_id } = req.body
    await pool.query(`DELETE FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ${curso_id} AND usuario_id = ${usuario_id}`)
    // await pool.query('CALL heroku_b3e0382f6ba83ba.crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // const a = await pool.query('CALL heroku_b3e0382f6ba83ba.crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // console.log(a[0][0]['@mensaje'])
    res.status(201).json({
      msg: 'Usuario eliminado del curso'
    })
  } catch (e) {
    next(e)
  }
})

/**
 * @param {Number} tarea_asignada_id
 * @param {String} notificacion
 */
// Metodo post para mostrar notificacion de tarea asignaada a un usuario
// Se especifica el id de la tarea asignada al usuario.
// Se especifica el mensaje de notificacion
router.post('/notificacion', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que uaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { tarea_asignada_id, notificacion } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.notificacion_curso (?, ?) ', [tarea_asignada_id, notificacion])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const savedCourseUser = await pool.query('select * from  heroku_b3e0382f6ba83ba.tarea_asignada where tarea_asignada_id = ? ', tarea_asignada_id)
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(savedCourseUser)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
// Metodo post para aceptar la solicitud de acceso de un alumno
// Se especifica el id del usuario quien manda la solucitud
// Se especifica el id del curso al que se solicita acceso
// Se especifica el id de la situacion con la que se acepta el curso
router.post('/aceptarSolicitudAcceso', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id, curso_id, situacion_id } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.aceptarSolicitudAcceso (?, ?, ?) ', [usuario_id, curso_id, situacion_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const solicitud = await pool.query('CALL heroku_b3e0382f6ba83ba.aceptarSolicitudAcceso (?, ?, ?) ', [usuario_id, curso_id, situacion_id])
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(solicitud)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {String} codigo
 * @param {Number} usuario_id
 */
// Metodo post para unirse a un curso mediante un codigo
// Se especifica el codigo del curso a acceder
// Se especifica el id del usuario que se unira al curso
router.post('/unirPorCodigo', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { codigo, usuario_id } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.unirseCursoPorCodigo (?, ?, @error, @mensaje)', [codigo, usuario_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const a = await pool.query('CALL heroku_b3e0382f6ba83ba.unirseCursoPorCodigo (?, ?, @error, @mensaje)', [codigo, usuario_id])
    // Prueba de la salida en consola
    console.log(a[0][0]['@mensaje'])
    // Se muestra la respuesta exitosa a la consulta y los mensajes de salida del procedimiento almacenado
    res.status(201).json({
      error: a[0][0]['@error'],
      msg: a[0][0]['@mensaje']
    })
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos agregados por un profesor
// Se especifica el id del usuario profesor quien agrego alumnos a su curso
router.get('/listarCursosAgregadosPorProfesor', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosAgregadosPorProfesor (?) ', [usuario_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursos = await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosAgregadosPorProfesor (?)  ', usuario_id)
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursos)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos con solicitud de acceso que tiene un profesor
// Se especifica el id del usuario profesor quien creo los cursos con solcicitud de acceso
router.get('/listarCursosConSolicicitudAcceso/:usuario_id', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un oarametro.
    const { usuario_id } = req.params
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosConSolicicitudAcceso (?) ', [usuario_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursos = await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosConSolicicitudAcceso (?)  ', usuario_id)
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursos)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos con solicitud de acceso que tiene un alumno
// Se especifica el id del usuario alumno quien tiene cursos con solicitud de acceso
router.get('/listarCursosConSolicicitudAccesoParaAlumnos/:usuario_id', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un oarametro.
    const { usuario_id } = req.params
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosConSolicicitudAccesoParaAlumnos (?) ', [usuario_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursos = await pool.query('CALL heroku_b3e0382f6ba83ba.listarCursosConSolicicitudAccesoParaAlumnos (?)  ', usuario_id)
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursos)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar las notificaciones de un usuario
// Se especifica el id del usuario del cual queremos listar sus notificaciones
router.get('/listarNotificacionesPorUsuario', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.listarNotificacionesPorUsuario (?) ', [usuario_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursos = await pool.query('CALL heroku_b3e0382f6ba83ba.listarNotificacionesPorUsuario (?)  ', usuario_id)
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursos)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
// Metodo post para aceptar la invitacion para acceder a un curso
// Se especifica el id del usuario a quien se le manda la invitacion
// Se especifica el id del curso al que invita al usuario
// Se especifica el id de la situacion con la que se acepta el curso
router.post('/aceptarInvitacionDeProfesor', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id, curso_id, situacion_id } = req.body
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL heroku_b3e0382f6ba83ba.aceptar_invitacion_profesor (?, ?, ?) ', [usuario_id, curso_id, situacion_id])
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const cursoAceptado = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario where curso_id = ? and usuario_id = ?', [usuario_id, curso_id])
    // Se muestra la respuesta exitosa a la consulta
    res.status(201).json(cursoAceptado)
  } catch (e) {
    // Se muestra el error que genero la consulta
    next(e)
  }
})

/**
 * @param {Number} iduser
 */
// Metodo get obtener las notificaciones de un usuario
// Se especifica el id del usuario del cual se quiere listar sus notificaciones
router.get('/notificacionPorUsuario/:iduser', async (req, res, next) => {
  const { iduser } = req.params
  try {
    // Aqui va el query para obtener la lista de cursos de un usuario

    let listNotificacion = await pool.query(`select mensaje_notificacion from heroku_b3e0382f6ba83ba.tarea_asignada where usuario_id = ?;`, [iduser])

    // Respuesta a la peticion
    res.status(200).json({
      message: 'Notificacion para el usuario: ' + iduser,
      data: listNotificacion
    })
  } catch (err) {
    next(err)
  }
})

router.get('/course-user/:idcurso', async (req, res, next) => {
  // Ruta para obtener la lista de usuarios de un curso
  
  //Obtenemos el id del curso de los parametros de la ruta de la peticion
  const { idcurso } = req.params;
  console.log(idcurso)
  try{
    
    //Aqui va el query para obtener la lista de usuarios de un curso
    let listUser = await pool.query('CALL listarUsuariosPorCurso(?);', [idcurso]);
    //Respuesta a la peticion
    res.status(200).json({
      message: 'Lista del curso: ' + idcurso,
      data: listUser
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.get('/coursesofuser/:iduser', async (req, res, next) => {
  // Ruta para obtener la lista de cursos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params

  try {
    // Aqui va el query para obtener la lista de cursos de un usuario

    let listUser = await pool.query(`
    SELECT c.*
    FROM heroku_b3e0382f6ba83ba.curso_usuario AS cu 
    INNER JOIN heroku_b3e0382f6ba83ba.cursos AS c 
    ON cu.curso_id = c.curso_id 
    WHERE cu.usuario_id = ?
    `, [iduser])

    // Respuesta a la peticion
    res.status(200).json({
      message: 'Lista de cursos del usuario: ' + iduser,
      data: listUser
    })
  } catch (err) {
    next(err)
  }
})

router.get('/coursespublic', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos
  try {
    // Query para obtener la lista de cursos publicos
    let cursos = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE privacidad_id IN (1, 5)')
    let cantCursos = await pool.query('SELECT count(curso_id) FROM heroku_b3e0382f6ba83ba.cursos WHERE privacidad_id IN (1, 5)')
    console.log(cantCursos)
    // Respuesta a la peticion
    res.status(200).json({
      cursos,
      cantidad: cantCursos
    })
  } catch (err) {
    next(err)
  }
})

router.get('/coursespublicmax', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos
  try {
    // Query para obtener la lista de cursos publicos
    let cursos = await pool.query('SELECT c.* FROM cursos as c JOIN curso_usuario as cu ON c.curso_id = cu.curso_id WHERE c.privacidad_id IN (1,5) GROUP BY c.curso_id ORDER BY COUNT(*) DESC LIMIT 4;')
    console.log(cursos)
    // Respuesta a la peticion
    res.status(200).json({
      cursos,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/coursespublic/:iduser', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params
  try {
    // Query para obtener la lista de cursos publicos de un usuario
    let cursos = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE privacidad_id = 1 AND usuario_id = ?', [iduser])
    // Respuesta a la peticion
    res.status(200).json({
      cursos
    })
  } catch (err) {
    next(err)
  }
})

router.post('/coursesEdit/:idcurso', async (req, res, next) => {
  // Ruta para actualizar los datos de un curso

  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params
    // Obtenemos los datos del cuerpo de la peticion

    const { codigo, imagen, curso_nombre, descripcion, conoci_previo, privacidad_id, categoria_id } = req.body

    const newCourse = {
      codigo,
      imagen,
      curso_nombre,
      descripcion,
      conoci_previo,
      privacidad_id,
      categoria_id
    }
    // Aqui va el query para editar un curso
    await pool.query('UPDATE heroku_b3e0382f6ba83ba.cursos set ? WHERE curso_id = ?', [newCourse, idcurso])
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_id = ?', [idcurso])

    // Respuesta a la peticion
    res.status(201).json(list)
  } catch (e) {
    next(e)
  }
})

router.post('/course-material/:idcurso', async (req, res, next) => {
  // Ruta para crear un nuevo material de un curso

  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params

    // Obtenemos los datos del cuerpo de la peticion

    const { nombre, descripcion, fecha_creacion } = req.body

    let curso_id = idcurso

    const newMaterial = {
      nombre,
      descripcion,
      fecha_creacion,
      curso_id

    }
    // Aqui va el query para guardar un nuevo material de un curso
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.material SET ? ', newMaterial)
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.material WHERE curso_id = ?', [idcurso])

    // Respuesta a la peticion
    res.status(201).json(list)
  } catch (e) {
    next(e)
  }
})

router.get('/list-task/:idcurso', async (req, res, next) => {
  // Ruta para listar las tareas de un curso

  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params

    // Aqui va el query para listar las tareas de un curso
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.tareas WHERE curso_id = ?', [idcurso])

    // Respuesta a la peticion
    res.status(201).json(list)
  } catch (e) {
    next(e)
  }
})

router.post('/solicitarCursoPrivado', async (req, res, next) => {
  // Aqui el query para solicitar acceso a un curso privado
  //Metodo para que el alumno pueda solicitad un notificacion al profesor que quiere unirse a su curso privado

  //En caso que sea todo correcto
  try {

    //Se solicita el id_curso y id_usuario a traves de body.
    const { curso_id, usuario_id } = req.body

    //Se crea y se le asigna la situacion_id "3"
    let situacion_id = '3'

    //Se guarda en una variable, los datos de curso_id, usuario_id, situacion_id
    let solicitudPrivate = {
      curso_id,
      usuario_id,
      situacion_id
    }

    //Se solicita a un query que inserte en la tabla curso_usuario los datos.
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.curso_usuario SET ? ', solicitudPrivate)

    //Se guarda en una variable constante los datos que fueron solictados en el query
    const savedSocitudPrivate = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ?', curso_id)

    //Se manda en forma de json al fronted los datos encontrados en la tabla 
    res.status(201).json(savedSocitudPrivate) 
  
  } //En caso que haya un error
    catch (e) {
    next(e)
  }
})

router.get('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  //Metodo que le muestra al profesor una lista de alumnos que han mandado solicitud
  
  //Se solicita el id_curso a traves de enlace.
  const { idcurso } = req.params

  // console.log(idcurso)
  //Si coloca como que la situacion_id siempre va ser 3
  const situacion_id = '3'

  //En caso que sea todo correcto
  try {
    //Se declara una variable
    let alumnosPendientes
    //Se guarda en la varibale una lista de alumnos que tengan la situacion_id de 3
    alumnosPendientes = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ? AND situacion_id = ?', [idcurso, situacion_id])
    //Manda al fronted en forma de json la varible
    res.status(200).json(alumnosPendientes)
  } //En caso que haya un error
  catch (err) {
    next(err)
  }
})

router.put('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  //Metodo para que el profesor pueda aceptar y mandar las solicitud de los cursos  Privado
  const { idcurso } = req.params
  // console.log(idcurso)

  const { usuario_id, situacion_id } = req.body
  // situacion_id = "1": acceptado;
  // situacion_id = "2": rechazado;
  
  //En caso se encuentra los datos ingresados perfectamente
  try {
    //Actualizar el la situacion de los alumnos en la tabla curso_usario, dependiendo del curso y usuario.
    await pool.query('UPDATE heroku_b3e0382f6ba83ba.curso_usuario SET situacion_id = ? WHERE curso_id = ? AND usuario_id = ?', [situacion_id, idcurso, usuario_id])
    //Se guarda en una variable los datos de la tabla curso_usuario depeniendo el curso_id y usuario_id. 
    const aceptarsolictudPrivate = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ? AND usuario_id = ?', [idcurso, usuario_id])
    //Se manda la variable sobre como se encuentra actualizada
    res.status(200).json(aceptarsolictudPrivate)
  } 
  catch (err) { //En caso que haya un error
    next(err)
  }
})


router.post('/join-public-course/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params

  const { iduser } = req.body
  
  try {
    const curso = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_id = ?', [idcurso])
    const privacidad_publico = '1'
    const situacion = '1'
    const newUser = {
      curso_id : idcurso,
      usuario_id : iduser,
      situacion_id : situacion
    }

    var existe = ""
    
    if (curso[0].privacidad_id == privacidad_publico){
      const curso_usuario = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE usuario_id = ?', [iduser])
      for (i=0 ; i<curso_usuario.length ;i++){
        if(curso_usuario[i].curso_id == idcurso && curso_usuario[i].usuario_id == iduser){
          existe = "existe"
          break;
        }
      }

      if (existe != "existe" ){
        await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.curso_usuario SET ? ', newUser)
        res.status(200).json("usuario unido al curso Publico")
      }else{
        res.status(200).json("usuario ya existe")
      }
    }
  } catch (err) {
    next(err)
  }
})

router.get('/list-task-submissions/:idtarea', async (req, res, next) => {
  const { idtarea } = req.params
  try {
    const listaTareas = await pool.query('SELECT ta.tarea_id, ta.usuario_id, ta.url, ta.fecha_entrega, u.usuario_nombre, u.usuario_apellidos FROM heroku_b3e0382f6ba83ba.tarea_asignada ta  INNER JOIN heroku_b3e0382f6ba83ba.usuarios u ON ta.usuario_id = u.usuario_id   WHERE ta.tarea_id = ?',[idtarea])
    res.status(200).json(listaTareas)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
