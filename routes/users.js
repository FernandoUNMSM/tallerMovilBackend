/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const pool = require('../src/database');
const bcrypt = require('bcrypt')

router.get('/users', async (req, res) => {
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
router.get('/users/:id', async (req, res) => {
  const {id } = req.params
  try{
    let user

    user = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_id = ?', [id]);
    res.status(200).json({
      user
    })

  }catch(err){
    next(err);
  }
})

router.post('/useredit/:id', async (req, res) => {
  try{
    const { id } = req.params
    const { usuario_nombre, usuario_apellidos, correo } = req.body;
  
    const newUser = {
      usuario_nombre,
      usuario_apellidos,
      correo,
    }
    
    await pool.query('UPDATE heroku_b3e0382f6ba83ba.usuarios set ? WHERE usuario_id = ?', [newUser, id]);
    const user1 = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_id = ?', [id]);
   
    res.status(200).json({
      user1
    })
  }catch(err){
    next(err);
  }
})



router.post('/register', async (req, res, next) => {
  
  const {usuario_nombre, usuario_apellidos, password, correo,url} = req.body
  if(!password) {
    return res.status(400).json({
      error: 'data invalid'
    })
  }
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
  
  try {
    //Aqui va el query de guardar un usuario
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.usuarios  set ? ', newUser);
    const usuario = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.usuarios WHERE usuario_nombre = ?', [newUser.usuario_nombre]);
    res.status(201).json(usuario[0])
  } catch (e) {
    res.status(400).json(e)
  }
})

module.exports = router
