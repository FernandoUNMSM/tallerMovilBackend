//Middlewares
const express = require('express')
const router = express.Router()


const pool = require('../src/database');

//Metodo GET para listar las sugerencias
router.get('/suggestions', async (req, res, next) => {
  try{
    //Se accede a la BD para listar todos los campos de las sugerencias
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias');
    res.status(200).json({
      //Se devuelve la lista de sugerencias al Forntend
      list
    })

  }catch(err){
    //Se maneja el error en caso de haberlo
    next(err);
  }
})

//Metodo POST para guardar las sugerencias
router.post('/suggestions', async (req,  res, next) => {
  
    try {
      //Parámetros necesarios para guardar las sugerencias
      const { categoria_id,sugerencia_nombre_curso, sugerencia_puntuacion_curso,numero_votos, sugerencia_estado, descripcion } = req.body
      //Se crea a la variable newSugesstion con los parámetros recogidos
      const newSugesstion = {
        categoria_id,
        sugerencia_nombre_curso,
        sugerencia_puntuacion_curso,
        numero_votos,
        sugerencia_estado,
        descripcion
      }
      
      //Se accede a la BD y se inserta o guarda newSuggestion en la BD
      await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.sugerencias SET ? ', newSugesstion);
      //Se selecciona la sugerencia previamente guardada a través del parámetro sugerencia_nombre_curso
      // const savedSugesstion = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias WHERE curso_nombre = ?', [sugerencia_nombre_curso]);
      
      
      //Aca se debe de enviar la sugerenia creada
      //Se envia las sugerencia guardada al Frontend
      res.status(201).json({
        msg: "sugerencia guardada"
      })
    } catch (e) {
      //Se maneja el error en caso de haberlo
      next(e)
    }
  })


//Se exporta el modulo para poder ser usado
module.exports = router
