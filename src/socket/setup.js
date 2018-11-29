const { storeUser, getUser } = require("../redis/mainredis");

var setupSocket = (socket, io, room, errorEmit) => {
  // console.log("here", socket.request.session);
  // if (socket.request.session.name) {
  //   storeUser(socket.id, socket.request.session.name).then(() => {
  //     console.log("hereee", socket.request.session.name);
  //     socket.emit("messages", {
  //       message: `${socket.request.session.name} has joined`,
  //       username: socket.request.session.name,
  //       timestamp: Date.now()
  //     });
  //   }, errorEmit(socket));
  // }
  socket.on("name", ({ username }) => {
    storeNewUser(socket, io, room, username, errorEmit);
  });
};

function storeNewUser(socket, io, room, username, errorEmit) {
  storeUser(socket.id, username).then(() => {
    socket.request.session.name = username;
    socket.request.session.save();
    console.log("person has joined", socket.request.session.name);
    io.in(room).emit("messages", {
      message: `${username} has joined.`,
      username,
      timestamp: Date.now()
    });
  }, errorEmit(socket));
}

module.exports = { setupSocket };
