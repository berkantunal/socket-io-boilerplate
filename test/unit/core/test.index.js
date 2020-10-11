/**
 * Middleware mock
 */
jest.mock('../../../core/middlewares', () => {
  return jest.fn(() => ({
    set: jest.fn()
  }))
})

/**
 * Routes mock
 */
jest.mock('../../../core/controllers', () => {
  return jest.fn(() => ({
    set: jest.fn()
  }))
})

/**
 * Dependencies
 */
var fs = require('fs')
var io = require('socket.io-client')
var http = require('http')
var ioBack = require('socket.io')
var axios = require('axios')
var core = require('../../../core')
var coreMiddlewares = require('../../../core/middlewares')
var coreControllers = require('../../../core/controllers')

jest.unmock('socket.io')

/**
 * Axios mock
 */
var user = {
  id: 1
}

jest.mock('axios')

/**
 * Rooms
 */
var rooms = ['admin']

/**
 * IO Server spys
 */
var ioServerOfSpy

var httpServer
var httpServerAddr
var ioServer
var app

/**
 * Setup WS & HTTP servers
 */
beforeAll(async function (done) {
  await new Promise(function (resolve, reject) {
    /**
     * Setup socket app
     */

    httpServer = http.createServer().listen()
    httpServerAddr = httpServer.address()
    ioServer = ioBack(httpServer)

    ioServerOfSpy = jest.spyOn(ioServer, 'of')

    fs.readdirSync = jest.fn().mockReturnValue(rooms)
    axios.get.mockResolvedValue(user)

    httpServer.on('listening', async () => {
      app = core.setup(httpServer, ioServer)
      app.onConnection = jest.fn()
      await connect()

      resolve()
    })
  })

  done()
})

/**
 *  Cleanup WS & HTTP servers
 */
afterAll(function (done) {
  if (ioServer.close && httpServer.close) {
    ioServer.close()
    httpServer.close()
  }

  done()
})

async function connect () {
  /**
   * Socket client connection
   */
  return await new Promise(function (resolve) {
    io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/admin`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
      transportOptions: {
        polling: {
          extraHeaders: {
            token: 'test'
          }
        }
      }
    }).on('connect', resolve)
  })
}

describe('-- core setup --', () => {
  /**
   * Rooms sets
   */
  test('it should set rooms', () => {
    rooms.forEach((room) => {
      expect(ioServerOfSpy.mock.calls[0][0]).toBe(room)
      ioServerOfSpy.mockClear()
    })

    expect(fs.readdirSync).toHaveBeenCalledTimes(1)
  })

  /**
   * Rooms middlewares sets
   */
  test('it should set middlewares', () => {
    expect(coreMiddlewares).toHaveBeenCalled()
    expect(coreMiddlewares.mock.calls[0][0]).toMatchObject(ioServer)
    expect(coreMiddlewares.mock.calls[0][1]).toBe('admin')
  })

  /**
   * Connection trigs on connection event
   */
  test('it should call on connection', async () => {
    expect(coreControllers).toHaveBeenCalled()
    expect(coreControllers.mock.calls[0][0]).toMatchObject(ioServer)
    expect(typeof coreControllers.mock.calls[0][1]).toBe('object')
    expect(coreControllers.mock.calls[0][2]).toBe('admin')
  })
})
