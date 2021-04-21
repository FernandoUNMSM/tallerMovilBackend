/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

const User = require('../models/User')

router.get('/users', async (req, res) => {
  const users = await User.find({}).populate('course', {
    name: 1
  })
  res.status(200).json({
    users
  })
})

router.post('/register', async (req, res, next) => {
  const {body} = req
  const {username, name, password} = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (e) {
    // next(e)
    res.status(400).json(e)
  }
})

module.exports = router
