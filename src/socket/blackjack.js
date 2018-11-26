var { BlackJack } = require("../deck/blackjack");
const { storeUser, getUser } = require("../redis/mainredis");

let blackJackGame;
var blackJackSocket = (socket, errorEmit) => {
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
    socket.emit("playersCards", {
      players: blackJackGame.players,
      dealer: blackJackGame.dealer
    });
  });

  socket.on("disconnect", () => {
    console.log("ALSO HERE");
  });
};

module.exports = { blackJackSocket };
