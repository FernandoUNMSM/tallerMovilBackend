const express = require('express')
const router = express.Router()

const userExtractor = require('./../middleware/userExtractor')

router.get('/courses', userExtractor, async (req, res, next) => {
  // const {courses: coursesId} = await User.findById(req.userId)
  //Aqui va el query de buscar los cursos de un usuario

  // console.log(coursesId)
  // const courses = await Course.find({'_id': {$in: [...coursesId]}})
  // Buscar varios documentos con un array de ids
  res.status(200).json({
    courses
  })
})

router.get('/courses/:id', userExtractor, async (req, res, next) => {
  const {id: courseId} = req.params

  // const course = await Course.findById(courseId)
  //Aqui va el query para obtener un curso especifico por su id

  res.status(200).json({
    course
  })
})

router.post('/courses', userExtractor, async (req,  res, next) => {
  const { name } = req.body

  // const user = await User.findById(req.userId)


  const newCourse = {
    user_id,
    category_id,
    name,
    description,
    conoci_previo,
    privacidad
  }

  try {
    // const savedCourse = await newCourse.save()
    //Aqui va el query para guardar un curso

    // user.courses = user.courses.concat(savedCourse._id)
    // await user.save()

    res.status(201).json(savedCourse)//Aca se debe de enviar el nuevo curso creado
  } catch (e) {
    next(e)
  }
})

module.exports = router
