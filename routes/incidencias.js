// Framework de nodejs
const express = require('express')
// Definicion del router
const router = express.Router()

// conexion a la BD
const pool = require('../src/database')

router.post('/incidencia', async (req, res, next) => {
  // Parámetro id del usuario para listarlo
  const { titulo, lugar, categoria, descripcion, foto, id_usuario: id_usuarios } = req.body
  // Empesamos con el try

  const newIncidencia = {
    titulo,
    lugar,
    categoria,
    descripcion,
    foto,
    id_usuarios
  }
  console.log(newIncidencia)
  try {
    // Se accede a la BD y se seleciona  al usuarios a través de su id única
    // Los datos del usuario se guarda en la variable user
    const a = await pool.query('INSERT INTO incidencias set ? ', newIncidencia)
    // const incidencia = await pool.query('SELECT * FROM incidencias WHERE name = ?', [newUser.name])
    // Respuesta a la peticion
    console.log(a)
    res.status(200).json({
      // Se devuelve el usuario al Frontend
      a
    })

    // Manejo de errror
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
})
router.get('/incidencia/:id', async (req, res, next) => {
  // Parámetro id del usuario para listarlo
  const { id } = req.params
  // Empesamos con el try

  try {
    // Se accede a la BD y se seleciona  al usuarios a través de su id única
    // Los datos del usuario se guarda en la variable user
    const incidencias = await pool.query('SELECT * FROM incidencias WHERE id_usuarios = ?', [id])
    // const incidencia = await pool.query('SELECT * FROM incidencias WHERE name = ?', [newUser.name])
    // Respuesta a la peticion
    res.status(200).json({
      // Se devuelve el usuario al Frontend
      incidencias
    })

    // Manejo de errror
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
})
module.exports = router
