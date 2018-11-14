const { storeUser, getUser } = require("../redis/mainredis");

var messagesSocket = (socket, namespace, errorEmit) => {
  socket.on("message", ({ message, nickname }) => {
    namespace.emit("messages", { message, nickname, timestamp: Date.now() });
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
          nickname: user,
          timestamp: Date.now()
        });
      }, errorEmit(socket));
  });
};

module.exports = { messagesSocket };
