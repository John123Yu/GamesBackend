const { Player, CardGame } = require("./deck");

class WarPlayer extends Player {
  constructor(name) {
    super(name, hand);
    this.wins = 0;
  }
  hit() {
    if (this.hand.length) {
      return this.hand.pop();
    }
  }
  win() {
    return ++this.wins;
  }
  score() {
    return this.wins;
  }
}

class War extends CardGame {
  constructor() {
    super(deck, players);
    this.shownCards = {};
  }
  dealCards() {
    let numCards = Math.floor(this.deck.cards.length / this.players);
    this.players.forEach(player => {
      for (let i = 0; i < numCards; i++) {
        player.takeCard(this.deck);
      }
    });
  }
  reset() {
    this.deck.reset();
  }
}

module.exports = {
  War,
  WarPlayer
};
