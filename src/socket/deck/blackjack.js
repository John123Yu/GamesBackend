const { Player, CardGame } = require("./deck");

class BlackJackPlayer extends Player {
  constructor(name) {
    super(name);
    this.position;
    this.aces = 0;
    this.status = true;
  }
  takeCard(deck) {
    if (!this.status) return this;
    this.hand.push(deck.dealRandomCard());
    this.hand[this.hand.length - 1].number === "1" ? this.aces++ : undefined;
    if (this.blackjackValue() > 21) this.status = false;
    return this;
  }
  stay() {
    this.status = false;
    return this;
  }
  blackjackValue() {
    let value = 0;
    for (let i = 0; i < this.hand.length; i++) {
      !isNaN(this.hand[i].score)
        ? (value += this.hand[i].score)
        : (value += this.hand[i].score[0]);
    }
    while (value > 21 && this.aces > 0) {
      this.aces--;
      value -= 10;
    }
    return value;
  }
}

class BlackJack extends CardGame {
  constructor() {
    super(deck, players);
    this.dealer = new BlackJackPlayer("Dealer");
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
