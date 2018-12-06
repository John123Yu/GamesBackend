const { storeUser, getUser } = require("../redis/mainredis");

var messagesSocket = (socket, io, room, errorEmit) => {
  socket.on("message", ({ message, username }) => {
    io.in(room).emit("messages", { message, username, timestamp: Date.now() });
  });

  socket.on("disconnect", reason => {
    getUser(socket.id)
      .then(user => {
        if (user === null) return "Someone";
        else return user;
      })
      .then(user => {
        console.log(`${user} has left for ${reason}`);
        if (reason !== "ping timeout" && user !== "Someone") {
          io.in(room).emit("messages", {
            message: `${user} left`,
            username: user,
            timestamp: Date.now()
          });
        }
      }, errorEmit(socket));
  });
};

module.exports = { messagesSocket };
