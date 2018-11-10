var { BlackJack } = require("../deck/blackjack");

let blackJackGame;

var blackJackSocket = (socket, io) => {
  socket.on("joinBlackJack", ({ name }) => {
    if (!blackJackGame) {
      blackJackGame = new BlackJack();
    }
    blackJackGame.addPlayer(name);
    console.log(name, " joined");
  });

  socket.on("startBlackJack", data => {
    blackJackGame.start();
    console.log("HERE ", blackJackGame);
    io.emit("playersCards", {
      players: blackJackGame.players,
      dealer: blackJackGame.dealer
    });
  });
};

module.exports = { blackJackSocket };
