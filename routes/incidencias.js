// Framework de nodejs
const express = require('express')
// Definicion del router
const router = express.Router()

// conexion a la BD
const pool = require('../src/database')

router.post('/incidencias', async (req, res, next) => {
  const { titulo, lugar, categoria, descripcion, foto, id_usuario: id_usuarios } = req.body
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
    const a = await pool.query('INSERT INTO incidencias set ? ', newIncidencia)
    res.status(200).json({
      a
    })

    // Manejo de errror
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
})
router.get('/incidencias/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const incidencias = await pool.query('SELECT * FROM incidencias WHERE id_usuarios = ?', [id])
    res.status(200).json({
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
