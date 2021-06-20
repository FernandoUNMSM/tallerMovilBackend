/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')

// const User = require('../models/User')

router.get('/users', async (req, res) => {

  //Aqui va el query de obtener todos los usuarios
  
  try{
    let list

    list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios');
    res.status(200).json({
      list
    })

  }catch(err){
    next(err);
  }
})

router.post('/register', async (req, res, next) => {
  
  const {nombre, password, correo} = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const usuario_nombre= nombre
  const usuario_contrasenia= passwordHash

  let newUser = {
    usuario_nombre,
    usuario_contrasenia,
    correo
  }

  try {
    //Aqui va el query de guardar un usuario
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.usuarios SET ? ', newUser);
    savedUser = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_nombre = ?', [newUser.usuario_nombre]);
    res.status(201).json(savedUser)
  } catch (e) {
    // next(e)
    res.status(400).json(e)
  }
})

module.exports = router
