var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");
var { setupSocket } = require("./setup");
const { sessionMiddleware } = require("../config/express");
const url = require("url");
//set this up with routes
//set up express-socket-session
var errorEmit = socket => {
  return err => {
    console.log(err);
    socket.broadcast.emit("user.events", "Something weng wrong!");
  };
};

var socketConnector = server => {
  const io = require("socket.io")(server, { origins: "*:*" });
  io.sockets.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", socket => {
    const { room } = url.parse(socket.handshake.url, true).query;

    socket.join(room);

    setupSocket(socket, io, room, errorEmit);
    messagesSocket(socket, io, room, errorEmit);
    blackJackSocket(socket, io, room, errorEmit);
  });
};

module.exports = { socketConnector };
