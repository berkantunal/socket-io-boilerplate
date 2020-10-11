var axios = require('axios')
var authService = require('../../../services/auth')

jest.mock('axios')

describe('-- admin route ride  --', () => {
  var user = {
    id: 1
  }

  axios.get.mockResolvedValue(user)
  test('it should control authentication', () => {
    return authService.isAuthorized('token').then(data => expect(data).toEqual(user))
  })
})
