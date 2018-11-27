const { deck, Player } = require("./deck");

class BlackJack {
  constructor() {
    this.deck = deck;
    this.deck.shuffle();
    this.players = [];
    this.dealer = new Player("Dealer");
  }
  addPlayer(name) {
    let player = new Player(name);
    this.players.push(player);
  }
  start(callback) {
    for (let i = 0; i < 2; i++) {
      this.players.forEach(player => {
        player.takeCard(this.deck);
      });
      this.dealer.takeCard(this.deck);
    }
    callback();
    this.start = () => {};
  }
}

module.exports = {
  BlackJack
};
