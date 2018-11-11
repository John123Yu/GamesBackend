var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");
const { storeUser, getUser } = require("../redis/mainredis");

var errorEmit = socket => {
  return err => {
    console.log(err);
    socket.broadcast.emit("user.events", "Something weng wrong!");
  };
};

var socketConnector = server => {
  const io = require("socket.io")(server, { origins: "*:*" });

  io.on("connection", socket => {
    messagesSocket(socket, io, errorEmit);
    blackJackSocket(socket, io, errorEmit);
  });
};

module.exports = { socketConnector };
