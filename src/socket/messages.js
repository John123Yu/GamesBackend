const { storeUser, getUser } = require("../redis/mainredis");

var messagesSocket = (socket, io, room, errorEmit) => {
  socket.on("message", ({ message, username }) => {
    io.in(room).emit("messages", { message, username, timestamp: Date.now() });
  });

  socket.on("disconnect", () => {
    getUser(socket.id)
      .then(user => {
        if (user === null) return "Someone";
        else return user;
      })
      .then(user => {
        console.log(`${user} has left`);
        socket.broadcast.emit("messages", {
          message: `${user} left`,
          username: user,
          timestamp: Date.now()
        });
      }, errorEmit(socket));
  });
};

module.exports = { messagesSocket };
