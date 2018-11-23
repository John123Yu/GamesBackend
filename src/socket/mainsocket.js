var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");
var { setupSocket } = require("./setup");
const { storeUser, getUser } = require("../redis/mainredis");
const { sessionMiddleware } = require("../config/express");

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
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  let namespace = io.of("/api/namespace");
  namespace.on("connection", socket => {
    setupSocket(socket, namespace, errorEmit);
    messagesSocket(socket, namespace, errorEmit);
    blackJackSocket(socket, namespace, errorEmit);
  });
};

module.exports = { socketConnector };
