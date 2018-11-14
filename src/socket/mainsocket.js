var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");
const { storeUser, getUser } = require("../redis/mainredis");
const { sessionMiddleware } = require("../config/express");

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
    // console.log("here", socket.request.session);
    if (socket.request.session.name) {
      storeUser(socket.id, socket.request.session.name).then(() => { console.log('success storeUser') }, errorEmit(socket));
      socket.emit("name_set", {
        name: socket.request.session.name
      });
      namespace.emit("messages", {
        message: `${socket.request.session.name} has joined`,
        nickname: socket.request.session.name,
        timestamp: Date.now()
      });
    }
    socket.on("name", ({ nickname }) => {
      storeNewUser(socket, nickname, namespace);
    });
    
    messagesSocket(socket, namespace, errorEmit);
    blackJackSocket(socket, namespace, errorEmit);
  });
};

function storeNewUser(socket, nickname, namespace) {
  storeUser(socket.id, nickname)
  .then(() => {
    socket.request.session.name = nickname;
    socket.request.session.save();
    namespace.emit("messages", {
      message: `${nickname} has joined.`,
      nickname,
      timestamp: Date.now()
    });
  }, errorEmit(socket));
}

module.exports = { socketConnector };
