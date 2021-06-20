const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// let multer = require('multer');
// let upload = multer();


router.get('/login', async (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})


router.post('/login', async (req, res) => {
  
  console.log(req.body)
  const {username, password} = req.body
  
  
  //Aqui va el query de obtener un usuario
  const user = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_nombre = ?', [username]);
  console.log(user)
  passwordHash=user[0].usuario_contrasenia

  console.log(passwordHash)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, passwordHash)

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
