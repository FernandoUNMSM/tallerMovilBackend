const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let multer = require('multer');
let upload = multer();

router.get('/login', async (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})


router.post('/login', upload.fields([]), async (req, res) => {
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

  // const userForToken = {
  //   id: user[0].usuario_id,
  //   username: user.username
  // }

  // const token = jwt.sign(
  //   userForToken,
  //   process.env.JWTSW,
  //   {
  //     expiresIn: 60 * 60 * 24 * 7
  //   }
  // )

  res.status(200).json({
    user: user[0]
  })
})

module.exports = router
