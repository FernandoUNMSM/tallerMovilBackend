//IMportamos la libreria mysql
const mysql = require('mysql');
//Delcaramos el pormisify
const { promisify }= require('util');
//Traemos la credenciales del keys
const { database } = require('./keys');
//Creamos el pool
const pool = mysql.createPool(database);
//Se crea la connecion
pool.getConnection((err, connection) => {
  //Condicional 
    if (err) {
      //Seguncda condicional
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        //Console del erroer
        console.error('Database connection was closed.');
      }
      //tercera condicional
      if (err.code === 'ER_CON_COUNT_ERROR') {
        //Console del erroer
        console.error('Database has to many connections');
      }
      //curata condicional
      if (err.code === 'ECONNREFUSED') {
        //Console del erroer
        console.error('Database connection was refused');
      }
    }
    //Codicional de la coneccion
    if (connection) connection.release();
//Return dela conexion  
    return true;
  });


  // Promisify Pool Querys
pool.query = promisify(pool.query);
//Se exporta el pool
module.exports = pool;