const express = require('express')
const router = express.Router()
const pool = require('../src/database');

router.post('/creartarea', async (req, res, next) => {
  //Esta es la ruta para crear una nueva tarea

  //Obtenemos los datos de la nueva tarea del cuerpo de la peticion
  const {curso_id, nombre, descripcion, tarea_fecha_creacion, tarea_fecha_entrega, imagen, enlace} = req.body;

  const newTarea = {
    curso_id,
    nombre,
    descripcion,
    tarea_fecha_creacion,
    tarea_fecha_entrega,
    imagen,
    enlace
  }

  try{
    //Aqui va el query para crear una nueva tarea
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.tareas set ? ', newTarea);
    
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea creada'
    })

  }catch(err){
    next(err);
  }

})

//Metodo para subir archivos
router.post('/subirArchivo', async (req, res, next) => {

  const {archivo_id, origen_id, url, nombre_archivo, tipo} = req.body;
 
  const newArchivo = {
    archivo_id,
    origen_id,
    url,
    nombre_archivo,
    tipo
  }

  try{
    //Aqui va el query para crear una nueva tarea
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.archivos set ? ', newArchivo);
    
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'Archivo subido'
    })

  }catch(err){
    next(err);
  }

})

router.get('/listarTareasCurso/:idcurso', async (req, res, next) => {

  const {idcurso} = req.params;

  try{
    //Aqui va el query para crear una nueva tarea
    const tareas = await pool.query('SELECT * FROM tareas WHERE curso_id = ? ', [idcurso]);
    console.log(tareas)
    //Respuesta a la peticion
    res.status(200).json({
      tareas,
      msg: `Tareas del curso: ${idcurso} listadas`
    })

  }catch(err){
    next(err);
  }

})


module.exports = router