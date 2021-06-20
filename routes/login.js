const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




router.get('/login', async (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})

router.post('/login', async (req, res) => {
  
  
  const {username, password} = req.body

  
  //Aqui va el query de obtener un usuario
  const user = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_nombre = ?', [username]);

  
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.usuario_contrasenia)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(
    userForToken,
    process.env.JWTSW,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  res.status(200).send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = router
