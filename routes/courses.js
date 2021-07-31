const express = require('express')
const router = express.Router()
const pool = require('../src/database');
// const Course = require('./../models/Courses')
// const User = require('./../models/User')

const userExtractor = require('./../middleware/userExtractor')

router.get('/cursos/:iduser', async (req, res, next) => {
  
  //Aqui va el query de buscar los cursos de un usuario
  const {iduser} = req.params;
  console.log(iduser)
  try{
    let list

    list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE usuario_id = ?', [iduser]);
    res.status(200).json({
      list
    })

  }catch(err){
    next(err);
  }

  
})

router.get('/courses/:id', async (req, res, next) => {
  
  //Aqui va el query para obtener un curso especifico por su id
  const { id } = req.params;
  console.log(id)
  try{
    const course = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_id = ?', [id]);
    res.status(200).json({
      data: course[0],
    });
  }catch(err){
    next(err)
  }
  
})

router.post('/courses', async (req,  res, next) => {
  
  //Aqui va el query para guardar un curso

  try {
    const {curso_id, usuario_id ,categoria_id, codigo, imagen, curso_nombre, descripcion, conoci_previo, privacidad_id, curso_fecha_creacion } = req.body

    let newCourse = {
      curso_id,
      usuario_id,
      categoria_id,
      codigo,
      imagen,
      curso_nombre,
      descripcion,
      conoci_previo,
      privacidad_id,
      curso_fecha_creacion
    }
    
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.cursos SET ? ', newCourse);
    const savedCourse = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_nombre = ?', [curso_nombre]);
    

    res.status(201).json({
      msg: "Curso creado"
    })//Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

router.post('/coursesUsers', async (req,  res, next) => {
  // Aqui va el query para guardar un curso

  try {
    const {curso_id, correo} = req.body

    await pool.query('CALL crear_usuario_curso (?, ?) ', [curso_id, correo], function (err, result) {
      if (err) {
          console.log('err:', err)
      } else {
          console.log('results:', result)
      }
  })

    const savedCourseUser = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario')

    res.status(201).json(savedCourseUser) // Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

router.get('/course-user/:idcurso', async (req, res, next) => {
  
  //Aqui va el query para obtener la lista de usuarios de un curso
  const { idcurso } = req.params;

  try{

    
    let listUser = await pool.query('SELECT usuarios.usuario_id, usuario_nombre,usuario_apellidos, correo, url FROM heroku_b3e0382f6ba83ba.usuarios INNER JOIN heroku_b3e0382f6ba83ba.curso_usuario ON usuarios.usuario_id = curso_usuario.usuario_id WHERE curso_id = ? ', [idcurso]);
        

    res.status(200).json({
      message: "Lista del curso: " + idcurso,
      data: listUser
    });
  }catch(err){
    console.log(err)
    next(err)
  }
  
})
router.get('/coursespublic', async (req, res, next) => {
  try{
    let cursos = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE privacidad_id = 1');
    res.status(200).json({
      cursos
    })
  }catch(err){
    next(err);
  }
})


router.post('/solicitarCursoPrivado', async (req,  res, next) => {
  // Aqui el query para solicitar acceso a un curso privado
  try {
    const {curso_id, usuario_id, situacion_id} = req.body

    let solicitudPrivate = {
      curso_id, 
      usuario_id, 
      situacion_id
    }

    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.curso_usuario SET ? ', solicitudPrivate);
    
    const savedSocitudPrivate = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ?', curso_id)

    res.status(201).json(savedSocitudPrivate) // Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})


//Mostrar todos los alumnos que tengan solicitud. 
router.get('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params;
  //console.log(idcurso)
  const situacion_id = "3";
  try{
    let alumnosPendientes
    alumnosPendientes = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ? AND situacion_id = ?', [idcurso, situacion_id]);
    res.status(200).json(alumnosPendientes)
  }catch(err){
    next(err)
  }
})


router.put('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params;
  //console.log(idcurso)

  const {usuario_id, situacion_id} = req.body
  //situacion_id = "1": acceptado;
  //situacion_id = "2": rechazado;
  try{
    await pool.query('UPDATE heroku_b3e0382f6ba83ba.curso_usuario SET situacion_id = ? WHERE curso_id = ? AND usuario_id = ?', [situacion_id, idcurso, usuario_id]) ;
    const aceptarsolictudPrivate = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ? AND usuario_id = ?', [idcurso, usuario_id])

    res.status(200).json(aceptarsolictudPrivate)
  }catch(err){
    next(err)
  }
})

module.exports = router
