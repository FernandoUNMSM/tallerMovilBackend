//En este archivo estan las credenciales de la BD
//Importacion del modulo
module.exports = {
    //Se declara el json databse
    database: {
        //Datos del host
        host: 'us-cdbr-east-04.cleardb.com',
        //Datos del user
        user: 'b0b2ae9c7354b4',
        //Datos de la contraseña
        password: process.env.PASSWORDSQL,
        //Database
        database: 'heroku_b3e0382f6ba83ba'
    }
}