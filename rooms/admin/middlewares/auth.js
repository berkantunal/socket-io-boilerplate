var authService = require('../../../services/auth')

/**
 * Auth control middleware
 *
 * @param {object} socket
 * @param {function} next
 */
async function authMiddleware (socket, next) {
  /**
   * JWT token
   */
  var token = socket.handshake.headers.token

  if (token) {
    try {
      const user = await authService.isAuthorized(token)

      if (user) {
        /**
         * Set user details to socket
         */
        socket.user = user

        return next()
      }
    } catch (err) {
      return next(err)
    }
  }

  return next(new Error('You must be authorized!'))
}

module.exports = authMiddleware
