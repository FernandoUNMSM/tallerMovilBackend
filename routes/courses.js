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

module.exports = router
