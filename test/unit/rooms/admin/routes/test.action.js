var SocketIO = require('socket.io')
var action = require('../../../../../rooms/admin/routes/action')

jest.mock('socket.io')

var io
beforeAll(function (done) {
  io = SocketIO()

  done()
})

describe('-- admin route action --', () => {
  test('it should control id', () => {
    function doAction () {
      action(io, {})
    }

    expect(doAction).toThrowError(/ID is required/)
  })

  test('it should send action all clients', () => {
    var data = {
      id: 1,
    }

    action(io, data)

    expect(io.sockets.to).toHaveBeenCalled()
    expect(io.sockets.to.mock.calls[0][0]).toBe('client')
    expect(io.sockets.emit).toHaveBeenCalled()
    expect(io.sockets.emit.mock.calls[0][0]).toBe('action/1')
    expect(io.sockets.emit.mock.calls[0][1]).toBe(data)
  })
})
