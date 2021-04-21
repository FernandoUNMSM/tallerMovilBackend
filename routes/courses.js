const express = require('express')
const router = express.Router()
const Course = require('./../models/Courses')
const User = require('./../models/User')
const userExtractor = require('./../middleware/userExtractor')

router.post('/courses', userExtractor, async (req,  res, next) => {
  const { name } = req.body

  const user = await User.findById(req.userId)

  const newCourse = new Course({
    name,
    user: user._id
  })

  try {
    const savedCourse = await newCourse.save()

    user.courses = user.courses.concat(savedCourse._id)
    await user.save()

    res.status(201).json(savedCourse)
  } catch (e) {
    next(e)
  }
})

module.exports = router
