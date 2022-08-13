// Framework de nodejs
const express = require('express')
// Definicion del router
const router = express.Router()
// const fetch = require('node-fetch')
// conexion a la BD
const pool = require('../src/database')
let multer = require('multer')
let upload = multer()
var FormData = require('form-data')

const fetch = require('node-fetch')
const axios = require('axios')
const { URLSearchParams } = require('url')

    const fs = require('fs')
router.post('/image', upload.single('file'), async (req, res, next) => {
  try {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dfkrcsufm/image/upload`
    const CLOUDINARY_UPLOAD_PRESET = 'ml_default'
    let data = req.file.buffer // you image stored on arrayBuffer variable;
    data = Buffer.from(data)
    fs.writeFile(`../assets/test.png`, data)
    const formData = new URLSearchParams()
    formData.append('file', Buffer.from(req.file.buffer, 'base64'))
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(async response => {
        console.log(response)
        // const url = response.url
        // return url
      })
  } catch (err) {
    next(err)
  }
})

module.exports = router
