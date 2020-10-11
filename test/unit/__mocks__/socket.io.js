var emit = jest.fn()
var use = jest.fn()

var socketIO = () => ({
  sockets: {
    to: jest.fn().mockReturnValue({
      emit
    }),
    emit
  },
  use,
  of: jest.fn().mockReturnValue({
    use
  })
})

module.exports = socketIO
