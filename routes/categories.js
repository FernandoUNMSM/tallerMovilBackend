//Framework de nodejs
const express = require('express')
//Definicion del router
const router = express.Router()
//Definicion del pool sql
const pool = require('../src/database');
//Nos trae el metodo para hacer querys a la BD

//Definicion de la ruta
router.get('/categories', async (req, res, next) => {
  // Ruta para listar las categorias
  //Empesamos con el try
  try {
    // Aqui va el query para listar las categorias
    const categories = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.categoria');

    //Respuesta a la peticion
    res.status(200).json({
      categories
    })
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
})

router.get('/categories/:cat_id', async (req, res, next) => {
  // Ruta para listar las categorias

  const { cat_id } = req.params
  //Empesamos con el try
  try {
    // Aqui va el query para listar las categorias
    const categories = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.categoria WHERE categoria_id = ?', [cat_id]);

    //Respuesta a la peticion
    res.status(200).json({
      categories
    })

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
})
//exportacion del router
module.exports = router