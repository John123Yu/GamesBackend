const { storeUser, getUser } = require("../redis/mainredis");

var messagesSocket = (socket, io, errorEmit) => {
  socket.on("message", ({ message, nickname }) => {
    storeUser(socket.id, nickname).then(() => {
      console.log(`${nickname} has joined ${socket.id}`);
      io.emit("messages", {
        message,
        nickname,
        timestamp: Date.now()
      });
    }, errorEmit(socket));
  });

  socket.on("disconnect", () => {
    getUser(socket.id)
      .then(user => {
        if (user === null) return "Someone";
        else return user;
      })
      .then(user => {
        console.log(`${user} has left`);
        socket.broadcast.emit("messages", `${user} left`);
      }, errorEmit(socket));
  });
};

module.exports = { messagesSocket };
