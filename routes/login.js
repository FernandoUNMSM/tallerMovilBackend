const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')

router.get('/login', async (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})


router.post('/login', async (req, res) => {
  const {correo, password} = req.body
  
  const user = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE correo = ?', [correo]);
  passwordHash = user[0] ? user[0].usuario_contrasenia : false

  const passwordCorrect = user[0] === undefined
    ? false
    : await bcrypt.compare(password, passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid user or password'
    })
  }

  res.status(200).json({
    user: user[0]
  })
})

module.exports = router
