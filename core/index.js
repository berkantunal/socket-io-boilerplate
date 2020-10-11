var fs = require('fs')
var path = require('path')
var CoreControllers = require('./controllers')
var CoreMiddlewares = require('./middlewares')

/**
 * Get rooms from routes
 */
async function getRooms () {
  /**
   * Get routes sub directories
   */
  var rooms = await fs.readdirSync(path.join(__dirname, '../rooms'))

  return rooms
}

/**
 * Set listeners to room
 *
 * @param {object} io
 * @param {object} socket
 * @param {string} room
 */
function onConnection (io, socket, room) {
  /**
   * Set controllers to socket
   */
  var coreControllers = new CoreControllers(io, socket, room)
  coreControllers.set()
}

/**
 * Set listeners to room
 *
 * @param {object} io
 * @param {string} room
 */
function setListeners (io, room) {
  io.of(room).on('connect', (socket) => onConnection(io, socket, room))
}

/**
 * Application setup
 */
async function setup (app, io) {
  var rooms = await getRooms()

  rooms.forEach(room => {
    /**
     * Set room listeners
     */
    setListeners(io, room)

    /**
     * Set room middlewares
     */
    var coreMiddlewares = new CoreMiddlewares(io, room)
    coreMiddlewares.set()
  })
}

module.exports = {
  getRooms,
  setup
}
