/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

router.get('/users', async (req, res) => {
  // const users = await User.find({}).populate('courses', {
  //   name: 1
  // })
  //Aqui va el query de obtener todos los usuarios

  res.status(200).json({
    users
  })
})

router.post('/register', async (req, res, next) => {
  const {body} = req
  const {username, password, userType} = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // const user = new User({
  //   username,
  //   passwordHash,
  //   userType
  // })

  try {
    // const savedUser = await user.save()
    //Aqui va el query de guardar un usuario
    res.status(201).json(savedUser)
  } catch (e) {
    // next(e)
    res.status(400).json(e)
  }
})

module.exports = router
