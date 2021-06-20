/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')

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
  
  const {usuario_nombre,usuario_apellidos, password, correo,url} = req.body

  console.log(req.body)
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)


  const usuario_contrasenia = passwordHash

  let newUser = {
    usuario_nombre,
    usuario_apellidos,
    usuario_contrasenia,
    correo,
    url
  }
  
  console.log(newUser)
  
  try {
    //Aqui va el query de guardar un usuario
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.usuarios  set ? ', newUser);
    const usuario = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_nombre = ?', [newUser.usuario_nombre]);
    res.status(201).json(usuario[0])
  } catch (e) {
    // next(e)
    res.status(400).json(e)
  }
})

module.exports = router
