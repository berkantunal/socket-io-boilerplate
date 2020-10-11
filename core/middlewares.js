var fs = require('fs')
var path = require('path')

function CoreMiddlewares (io, room) {
  this.io = io
  this.room = room

  /**
   * Get middleware caller
   *
   * @param {string} middlewaresPath
   * @param {string} middlewaresFile
   *
   * return caller object
   */
  this.getCaller = function (middlewaresPath, middlewaresFile) {
    return {
      name: middlewaresFile.replace('.js', ''),
      caller: require(path.join(middlewaresPath, middlewaresFile))
    }
  }

  /**
   * Get room middlewares
   *
   * @param {string} room
   */
  this.get = async function () {
    var middlewaresPath = path.join(__dirname, '..', 'routes', this.room, 'middlewares')
    var isExists = await fs.existsSync(middlewaresPath)
    var middlewares = []

    if (isExists) {
      /**
       * Get middlewares files from route
       */
      var middlewaresFiles = await fs.readdirSync(middlewaresPath)

      /**
       * Get middlewares from files
       */
      middlewares = middlewaresFiles.map(middlewaresFile => this.getCaller(middlewaresPath, middlewaresFile))
    }

    return middlewares
  }

  this.set = async function () {
    const middlewares = await this.get(this.room)
    /**
     * Set middlewares if that is function
     */
    middlewares.forEach(middleware => {
      if (typeof middleware.caller === 'function') {
        this.io.of(this.room).use(middleware.caller)
      }
    })
  }

  return this
}

module.exports = CoreMiddlewares
