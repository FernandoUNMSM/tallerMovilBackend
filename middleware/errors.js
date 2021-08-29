//Manejo de Errores
const ERROR_HANDLERS = {
  //Error Cast
  CastError: res => res.status(400).send({
    //Mensahe de error
    error: 'id used is malformed'
  }),
  //Error validate
  ValidatorError: res => res.status(400).send({
    //Mensahe de error
    error: '`username` to be unique'
  }),
  //Error Json
  JsonWebTokenError: res => res.status(401).json({
    //Mensahe de error
    error: 'token is invalid'
  }),
  //Error tipical
  Error: res => res.status(400).json({
    //Mensahe de error
    error: 'data invalid'
  }),
  //Definicion del default error
  defaultError: res => res.status(500).end()
}
//exportacion del modulo
module.exports = (error, req, res, next) => {
  //Definicion del handler
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  //Instancia del handler
  handler(res, error)
}
