const { storeUser, getUser } = require("../redis/mainredis");

var setupSocket = (socket, categoryId, itemId, errorEmit) => {
  // console.log("here", socket.request.session);
  if (socket.request.session.name) {
    socket.emit("name_set", {
      name: socket.request.session.name
    });
    storeUser(socket.id, socket.request.session.name).then(() => {
      socket.emit("messages", {
        message: `${socket.request.session.name} has joined`,
        nickname: socket.request.session.name,
        timestamp: Date.now()
      });
    }, errorEmit(socket));
  } else {
    socket.emit("name_set", {
      name: false
    });
  }
  socket.on("name", ({ nickname }) => {
    storeNewUser(socket, nickname, errorEmit);
  });
};

function storeNewUser(socket, nickname, errorEmit) {
  storeUser(socket.id, nickname).then(() => {
    socket.request.session.name = nickname;
    socket.request.session.save();
    // console.log("HEREEEEEEE", socket.request.session.name);
    socket.emit("messages", {
      message: `${nickname} has joined.`,
      nickname,
      timestamp: Date.now()
    });
  }, errorEmit(socket));
}

module.exports = { setupSocket };
