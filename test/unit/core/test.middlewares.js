/**
 * Dependencies
 */
var fs = require('fs')
var CoreMiddlewares = require('../../../core/middlewares')
var SocketIO = require('socket.io')

jest.mock('socket.io')

/**
 * Mock Middlewares
 */

var middlewares = {
  admin: [{
    name: 'auth',
    caller: jest.fn()
  }]
}

var io
var coreMiddlewares

/**
 * Setup WS & HTTP servers
 */
beforeAll(function (done) {
  /**
   * FS mock functions
   */
  fs.existsSync = jest.fn().mockResolvedValue(true)
  fs.readdirSync = jest.fn().mockReturnValue(['auth.js'])

  /**
   * Setup socket io server
   */
  io = SocketIO()

  /**
   * Setup core middlewares
   */
  coreMiddlewares = new CoreMiddlewares(io, 'admin')
  coreMiddlewares.getCaller = jest.fn().mockReturnValue(middlewares.admin[0])

  done()
})

beforeEach(function (done) {
  fs.existsSync.mockClear()
  fs.readdirSync.mockClear()
  io.of.mockClear()
  io.use.mockClear()

  done()
})

describe('-- core middlewares --', () => {
  /**
   * Gets middlewares from room folder
   */
  test('it should get middlewares', async () => {
    await coreMiddlewares.set()

    expect(fs.existsSync).toHaveBeenCalledTimes(1)
    expect(fs.readdirSync).toHaveBeenCalledTimes(1)
    expect(fs.readdirSync.mock.results[0].value).toMatchObject(['auth.js'])
  })

  /**
   * Sets middlewares to room
   */
  test('it should set middlewares', async () => {
    await coreMiddlewares.set()

    for (var key in middlewares.admin) {
      var middleware = middlewares.admin[key]

      expect(io.of.mock.calls[0][0]).toBe('admin')
      expect(io.use.mock.calls[0][0]).toBe(middleware.caller)
    }
  })

  /**
   * Sets middlewares to room
   */
  test("it shouldn't set middlewares", async () => {
    fs.existsSync = jest.fn().mockResolvedValue(false)
    await coreMiddlewares.set()

    expect(io.of).not.toHaveBeenCalled()
    expect(io.use).not.toHaveBeenCalled()
  })
})
