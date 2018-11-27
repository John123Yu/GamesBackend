var { BlackJack } = require("../deck/blackjack");

let blackJackGames = {};
var blackJackSocket = (socket, io, room, errorEmit) => {
  socket.on("joinBlackJack", ({ name }) => {
    if (!blackJackGames[room]) {
      blackJackGames[room] = new BlackJack();
    }
    blackJackGames[room].addPlayer(name);
  });

  socket.on("startBlackJack", () => {
    blackJackGames[room].start(() => {
      io.in(room).emit("playersCards", {
        players: blackJackGames[room].players,
        dealer: blackJackGames[room].dealer
      });
    });
  });

  socket.on("disconnect", () => {});
};

module.exports = { blackJackSocket };
