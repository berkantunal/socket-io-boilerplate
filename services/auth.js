var axios = require('axios')
var baseURL = process.env.AUTH_SERVICE_API

/**
 *  Gets user info
 *
 * @param {string} token
 *
 * @return {object} User
 */
function isAuthorized (token = '') {
  return axios.get('/user/info', {
    baseURL,
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

module.exports = {
  isAuthorized
}
