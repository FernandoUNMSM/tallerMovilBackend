const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.get('/login', async (req, res) => {
  res.status(200).json({
    gawr: 'gura'
  })
})

router.post('/login', async (req, res) => {
  const {body} = req
  // console.log(body)
  const {username, password} = body

  // const user = await User.findOne({username})
  //Aqui va el query de obtener un usuario

  // console.log(user)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

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
