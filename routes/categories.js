const express = require('express')
const router = express.Router()
const pool = require('../src/database');

router.get('/categories', async (req, res, next) => {
  try{
    const categories = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.categoria');
    res.status(200).json({
      categories
    })

  }catch(err){
    next(err);
  }
})

module.exports = router