var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");

var socketConnector = server => {
  const io = require("socket.io")(server, { origins: "*:*" });

  io.on("connection", socket => {
    messagesSocket(socket, io);
    blackJackSocket(socket, io);
  });
};

module.exports = { socketConnector };
