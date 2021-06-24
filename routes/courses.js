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

router.get('/course-user/:idcurso', async (req, res, next) => {
  
  //Aqui va el query para obtener la lista de usuarios de un curso
  const { idcurso } = req.params;

  try{
    let courseUser = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.curso_usuario WHERE curso_id = ?', [idcurso]);

    res.status(200).json({
      message: "lista de usarios de un curso: "+[idcurso],
      data: courseUser
    });
  }catch(err){
    next(err)
  }
  
})


module.exports = router
