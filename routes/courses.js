const express = require('express')
const router = express.Router()
const pool = require('../src/database');
// const Course = require('./../models/Courses')
// const User = require('./../models/User')

const userExtractor = require('./../middleware/userExtractor')

router.get('/cursos/:iduser', userExtractor, async (req, res, next) => {
  
  // const {courses: coursesId} = await User.findById(req.userId)
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

router.get('/courses/:id', userExtractor, async (req, res, next) => {
  
  // const course = await Course.findById(courseId)
  //Aqui va el query para obtener un curso especifico por su id
  const { id } = req.params;
  try{
    const course = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_id = ?', [id]);
    res.status(200).json({
      data: course[0],
    });
  }catch(err){
    next(err)
  }
  
})

router.post('/courses', userExtractor, async (req,  res, next) => {
  
  //Aqui va el query para guardar un curso

  try {
    const { usuario_id ,categoria_id,codigo,imagen, curso_nombre, description, conoci_previo, privacidad } = req.body

    const newCourse = {
      usuario_id,
      categoria_id,
      codigo,
      imagen,
      curso_nombre,
      description,
      conoci_previo,
      privacidad
    }
    
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.cursos SET ? ', newCourse);
    const savedCourse = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_nombre = ?', [curso_nombre]);
    

    res.status(201).json(savedCourse)//Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

module.exports = router
