/**
 * Dependencies
 */
var fs = require('fs')
var CoreControllers = require('../../../core/controllers')
var MockedSocket = require('socket.io-mock')
var SocketIO = require('socket.io')

/**
 * Mock controllers
 */
var controllers = {
  admin: [{
    name: 'action',
    caller: jest.fn()
  }]
}

var io
var socket
var coreControllers

/**
 * Setup WS & HTTP servers
 */
beforeAll(function (done) {
  /**
   * FS mock functions
   */
  fs.existsSync = jest.fn().mockReturnValue(true)
  fs.readdirSync = jest.fn().mockReturnValue(controllers.admin)

  /**
   * Setup socket io server
   */
  io = SocketIO()

  /**
   * Setup mock socket
   */
  socket = new MockedSocket()

  /**
   * Setup core controllers
   */
  coreControllers = new CoreControllers(io, socket, 'admin')
  coreControllers.getCaller = jest.fn().mockReturnValue(controllers.admin[0])

  done()
})

beforeEach(function (done) {
  fs.existsSync.mockClear()
  fs.readdirSync.mockClear()

  done()
})

describe('-- core controllers --', () => {
  /**
   * Controllers sets to socket
   */
  test('it should get controllers', async () => {
    await coreControllers.set()

    expect(fs.existsSync).toHaveBeenCalledTimes(1)
    expect(fs.readdirSync).toHaveBeenCalledTimes(1)
    expect(fs.readdirSync.mock.results[0].value).toBe(controllers.admin)
  })

  /**
   * Routes sets to socket
   */
  test('it should call controller', () => {
    socket.socketClient.emit('action')

    expect(controllers.admin[0].caller).toHaveBeenCalledTimes(1)
  })
})
