const express = require('express')
const router = express.Router()
const pool = require('../src/database');

router.post('/crearTarea', async (req, res, next) => {
  //Esta es la ruta para crear una nueva tarea

  //Obtenemos los datos de la nueva tarea del cuerpo de la peticion
  const {curso_id, nombre, descripcion, tarea_fecha_creacion, tarea_fecha_entrega} = req.body;

  const newTarea = {
    curso_id,
    nombre,
    descripcion,
    tarea_fecha_creacion,
    tarea_fecha_entrega
  }

  try{
    //Aqui va el query para crear una nueva tarea
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.tareas  set ? ', newTarea);
    
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea creada'
    })

  }catch(err){
    next(err);
  }

})


router.put('/editarTarea/:idTarea', async (req, res, next) => {
  //MEtodo para editar tarea
  const { idTarea } = req.params
  const {curso_id, nombre, descripcion, tarea_fecha_creacion, tarea_fecha_entrega} = req.body;

  try {
    //guarda los datos de ediccion
    await pool.query('UPDATE heroku_b3e0382f6ba83ba.tareas SET nombre = ?, descripcion = ?, tarea_fecha_creacion = ?, tarea_fecha_entrega = ?  WHERE tarea_id = ? AND curso_id = ?', [nombre, descripcion, tarea_fecha_creacion, tarea_fecha_entrega, idTarea, curso_id])
   

    const TareaEditada = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.tareas WHERE tarea_id = ? AND curso_id = ?', [idTarea, curso_id])
    //Envia los datos de la ediccion de como quedo al fronted
    res.status(200).json(TareaEditada)
  } catch (err) {
    next(err)
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

module.exports = router