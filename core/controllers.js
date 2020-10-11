var fs = require('fs')
var path = require('path')

function CoreControllers (io, socket, room) {
  this.io = io
  this.room = room
  this.socket = socket

  /**
   * Get controller caller
   *
   * @param {string} controllersPath
   * @param {string} controllerFile
   *
   * return caller object
   */
  this.getCaller = function (controllersPath, controllerFile) {
    return {
      name: controllerFile.replace('.js', ''),
      caller: require(path.join(controllersPath, controllerFile))
    }
  }

  /**
   * Get room controllers
   */
  this.get = async function () {
    var controllersPath = path.join(__dirname, '..', 'routes', this.room, 'controllers')
    var isExists = await fs.existsSync(controllersPath)
    var controllers = []

    if (isExists) {
      /**
       * Get controllers files from route
       */
      var controllersFiles = await fs.readdirSync(controllersPath)

      /**
       * Get controllers from files
       */
      controllers = controllersFiles.map(controllerFile => this.getCaller(controllersPath, controllerFile))
    }

    return controllers
  }

  this.set = async function () {
    const controllers = await this.get(this.room)

    /**
     * Set middlewares if that is function
     */
    controllers.forEach(controller => {
      if (typeof controller.caller === 'function') {
        this.socket.on(controller.name, data => controller.caller(this.io, data))
      }
    })
  }
}

module.exports = CoreControllers
