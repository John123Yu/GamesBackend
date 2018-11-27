const { storeUser, getUser } = require("../redis/mainredis");

var setupSocket = (socket, room, errorEmit) => {
  // console.log("here", socket.request.session);
  if (socket.request.session.name) {
    socket.emit("name_set", {
      name: socket.request.session.name
    });
    storeUser(socket.id, socket.request.session.name).then(() => {
      socket.emit("messages", {
        message: `${socket.request.session.name} has joined`,
        username: socket.request.session.name,
        timestamp: Date.now()
      });
    }, errorEmit(socket));
  } else {
    socket.emit("name_set", {
      name: false
    });
  }
  socket.on("name", ({ username }) => {
    storeNewUser(socket, username, errorEmit);
  });
};

function storeNewUser(socket, username, errorEmit) {
  storeUser(socket.id, username).then(() => {
    socket.request.session.name = username;
    socket.request.session.save();
    // console.log("HEREEEEEEE", socket.request.session.name);
    socket.emit("messages", {
      message: `${username} has joined.`,
      username,
      timestamp: Date.now()
    });
  }, errorEmit(socket));
}

module.exports = { setupSocket };
