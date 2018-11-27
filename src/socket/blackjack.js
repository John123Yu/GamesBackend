var { BlackJack } = require("../deck/blackjack");

let blackJackGame;
var blackJackSocket = (socket, room, errorEmit) => {
  console.log("initiated");
  socket.on("joinBlackJack", ({ name }) => {
    if (!blackJackGame) {
      blackJackGame = new BlackJack();
    }
    blackJackGame.addPlayer(name);
    console.log("logged");
    console.log(name, " joined");
  });

  socket.on("startBlackJack", data => {
    blackJackGame.start();
    console.log("HERE ", blackJackGame);
    socket.emit("playersCards", {
      players: blackJackGame.players,
      dealer: blackJackGame.dealer
    });
  });

  socket.on("disconnect", () => {});
};

module.exports = { blackJackSocket };
