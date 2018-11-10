const { deck, Player } = require("./deck");

// console.log(deck);
// deck.shuffle();
// let Jojo = new Player("Jojo");
// Jojo.takeCard(deck);
// Jojo.takeCard(deck);
// Jojo.takeCard(deck);
// console.log(Jojo);
// console.log(Jojo.blackjackValue());

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
  start() {
    for (let i = 0; i < 2; i++) {
      this.players.forEach(player => {
        player.takeCard(this.deck);
      });
      this.dealer.takeCard(this.deck);
    }
  }
}

module.exports = {
  BlackJack
};
