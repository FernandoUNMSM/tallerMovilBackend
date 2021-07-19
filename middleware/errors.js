const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({
    error: 'id used is malformed'
  }),
  ValidatorError: res => res.status(400).send({
    error: '`username` to be unique'
  }),
  JsonWebTokenError: res => res.status(401).json({
    error: 'token is invalid'
  }),
  Error: res => res.status(400).json({
    error: 'data invalid'
  }),
  defaultError: res => res.status(500).end()
}

module.exports = (error, req, res, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(res, error)
}
