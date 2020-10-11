/**
 * Action Controller
 *
 * @param {object} io
 * @param {object} data
 */
function action (io, data = {}) {
  /**
   * Imei control
   */
  if (!data.id) {
    throw new Error('ID is required!')
  }

  /**
   * Broadcast action to all clients
   */
  io.sockets.to('client').emit(`action/${data.id}`, data)
}

module.exports = action
