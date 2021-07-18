const express = require('express')
const router = express.Router()
const pool = require('../src/database');

router.get('/categories', async (req, res, next) => {
  // Ruta para listar las categorias

  try{
    // Aqui va el query para listar las categorias
    const categories = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.categoria');
    
    //Respuesta a la peticion
    res.status(200).json({
      categories
    })

  }catch(err){
    next(err);
  }
})

module.exports = router