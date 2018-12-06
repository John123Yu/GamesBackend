const suits = ["s", "h", "c", "d"];
const values = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "T",
  j: "J",
  q: "Q",
  k: "K",
  1: "A"
};
const scores = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  j: 10,
  q: 10,
  k: 10,
  1: [11, 1]
};

class Card {
  constructor(suit, number, value, score) {
    this.suit = suit;
    this.number = number;
    this.value = value;
    this.score = score;
    this.img = null;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.buildDeck();
  }
  buildDeck() {
    this.cards.length = 0;
    suits.forEach(suit => {
      for (let number in values) {
        let newestCard = new Card(
          suit,
          number,
          values[number] + suit,
          scores[number]
        );
        newestCard.img = imageGenerator(newestCard.suit, newestCard.number);
        this.cards.push(newestCard);
      }
    });
    return this;
  }
  shuffle() {
    let unshuffledEdge = this.cards.length,
      cardToShuffleIdx,
      temp;
    while (unshuffledEdge > 0) {
      cardToShuffleIdx = Math.floor(Math.random() * unshuffledEdge);
      unshuffledEdge--;
      temp = this.cards[cardToShuffleIdx];
      this.cards[cardToShuffleIdx] = this.cards[unshuffledEdge];
      this.cards[unshuffledEdge] = temp;
    }
    return this;
  }
  reset() {
    this.buildDeck().shuffle();
  }
  dealRandomCard() {
    return this.cards.length > 0 ? this.cards.pop() : null;
  }
}
//this is a blackjack player
class Player {
  constructor(name) {
    this.name = name;
    this.hand = [];
  }
  takeCard(deck) {
    this.hand.push(deck.dealRandomCard());
    return this;
  }
}
class CardGame() {
  constructor() {
      this.deck = new Deck();
      this.deck.reset();
      this.players = [];
  }
  addPlayer(name, cls) {
      if (this.players.length < 5) {
        let player = new cls(name);
        this.players.push(player);
      }
    }
}

module.exports = {
  Deck,
  Player,
  CardGame
};

function imageGenerator(suit, number) {
  if (suit == "s") {
    return `s${number}.png`;
  } else if (suit == "h") {
    return `h${number}.png`;
  } else if (suit == "d") {
    return `d${number}.png`;
  } else {
    return `c${number}.png`;
  }
}