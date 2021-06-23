const express = require('express')
const router = express.Router()
const pool = require('../src/database');

const userExtractor = require('./../middleware/userExtractor')
let multer = require('multer');
let upload = multer();
router.get('/courses', async (req, res, next) => {
  try{
    let list

    list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE');
    res.status(200).json({
      list
    })

  }catch(err){
    next(err);
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

router.get('/cursos/:iduser', async (req, res, next) => {
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

router.post('/courses', upload.fields([]),  async (req,  res, next) => {
  const { usuario_id, categoria_id, codigo,imagen, curso_nombre, descripcion, conoci_previo, privacidad_id } = req.body
  console.log(req.body)
  const newCourse = {
    usuario_id,
    categoria_id,
    codigo,
    imagen,
    curso_nombre,
    descripcion,
    conoci_previo,
    privacidad_id
  }

  try {
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.cursos SET ? ', newCourse);
    const savedCourse = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.cursos WHERE curso_nombre = ?', [curso_nombre]);
    console.log(savedCourse)

    res.status(201).json(savedCourse)//Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

module.exports = router
