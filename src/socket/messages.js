var messagesSocket = (socket, io) => {
  socket.on("message", ({ message, nickname }) => {
    console.log("NICKNAME: ", nickname);
    io.emit("messages", {
      message,
      nickname,
      timestamp: Date.now()
    });
  });
};

module.exports = { messagesSocket };
