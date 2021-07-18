const express = require('express')
const router = express.Router()
const pool = require('../src/database');


router.get('/suggestions', async (req, res, next) => {
  
  //Aqui va el query para ver todas las sugerencias
  try{
    let list

    list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias');
    res.status(200).json({
      list
    })

  }catch(err){
    next(err);
  }
})

router.post('/suggestions', async (req,  res, next) => {
  
    //Aqui va el query para guardar una sugerencia
  
    try {

      const { categoria_id,sugerencia_nombre_curso, sugerencia_puntuacion_curso,numero_votos, sugerencia_estado } = req.body
  
      const newSugesstion = {
        categoria_id,
        sugerencia_nombre_curso,
        sugerencia_puntuacion_curso,
        numero_votos,
        sugerencia_estado,
      }
      
      await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.sugerencias SET ? ', newSugesstion);
      const savedSugesstion = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias WHERE curso_nombre = ?', [sugerencia_nombre_curso]);
      
      
      //Aca se debe de enviar la sugerenia creada
      res.status(201).json(savedSugesstion)
    } catch (e) {
      next(e)
    }
  })



module.exports = router
