const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.JWTSW)
    console.log(decodedToken)
  } catch (e) {
    next(e)
  }
  const { id: userId } = decodedToken

  req.userId = userId

  next()
}
