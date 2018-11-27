var { BlackJack } = require("../deck/blackjack");

let blackJackGames = {};
var blackJackSocket = (socket, room, errorEmit) => {
  socket.on("joinBlackJack", ({ name, room }) => {
    if (!blackJackGames[room]) {
      blackJackGames[room] = new BlackJack();
    }
    blackJackGames[room].addPlayer(name);
  });

  socket.on("startBlackJack", ({ room }) => {
    blackJackGames[room].start(() => {
      socket.emit("playersCards", {
        players: blackJackGames[room].players,
        dealer: blackJackGames[room].dealer
      });
    });
  });

  socket.on("disconnect", () => {});
};

module.exports = { blackJackSocket };
