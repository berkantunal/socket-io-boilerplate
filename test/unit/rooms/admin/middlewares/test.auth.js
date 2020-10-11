var MockedSocket = require('socket.io-mock')
var authMiddleware = require('../../../../../rooms/admin/middlewares/auth')
var axios = require('axios')
var authService = require('../../../../../services/auth')

/**
 * Axios mock
 */
var user = {
  id: 1
}

jest.mock('axios')

/**
 * Next mock
 */
var nextMock = jest.fn()

/**
 * Auth service spy
 */
var isAuthorizedSpy

var socket
beforeAll(function (done) {
  socket = new MockedSocket()
  socket.handshake = { headers: { token: 'Bearer test' } }

  axios.get.mockResolvedValue(user)

  isAuthorizedSpy = jest.spyOn(authService, 'isAuthorized')

  done()
})

beforeEach(function (done) {
  nextMock.mockClear()
  isAuthorizedSpy.mockClear()

  done()
})

describe('-- admin auth middleware  --', () => {
  test('it should enter', async () => {
    await authMiddleware(socket, nextMock)

    expect(socket.user).toMatchObject(user)
    expect(isAuthorizedSpy).toHaveBeenCalledTimes(1)
    expect(nextMock).toHaveBeenCalledTimes(1)
  })

  test('it should reject', async () => {
    socket.handshake = { headers: {} }
    await authMiddleware(socket, nextMock)

    expect(authService.isAuthorized).not.toHaveBeenCalled()
    expect(nextMock).toHaveBeenCalledTimes(1)
    expect(nextMock.mock.calls[0][0].message).toBe('You must be authorized!')
  })
})
