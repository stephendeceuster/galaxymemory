import Card from "./Card";
import Yoda from "./Yoda";
import Message from "./Message";
import Sound from "./Sound";

const yodasound = new Sound("./sounds/yodalaughing.mp3");
const victory = new Sound("./sounds/star-wars-theme-song.mp3");

export default class Memory {
  constructor(lvl = 1) {
    this._allCards = [];
    this._lvl = lvl;
    this._username = "";
    this._playground = document.body.querySelector(".playground");

    this._firstCard = null;
    this._secondCard = null;
    this._foundCards = [];
    this._allPlayCardsLength = null;

    this.setUpEvents();

    if(localStorage.getItem("galaxymemory")) {
      console.log(persistedData)
      const persistedData = JSON.parse(localStorage.getItem("galaxymemory"));
      this._lvl = persistedData.lvl;
      this._allCards = persistedData.allCards;
      this._username = persistedData.username;
      this.init()
    } else {
      this._username = prompt('Geef aub uw gebruikersnaam in?');
      this.fetchCards();
    }
  }

  saveToPersist() {
    localStorage.setItem(
      "galaxymemory",
      JSON.stringify({
        lvl: this._lvl,
        allCards: this._allCards,
        username: this._username,
      })
    );
  }

  fetchCards = () => {
    fetch("cards.json")
      .then((resp) => resp.json())
      .then((data) => {
        this._allCards = data.cards.map((card) => card.filename);
        this.init();
      })
      .catch((error) => console.log(error));
  };

  init = () => { 
   this.startLevel();
  };

  startLevel = () => {
    const numberOfDiffentCards = this._lvl * 2;
    const playCards = this._allCards
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfDiffentCards);
    const allPlayCards = this.shuffleCards([...playCards, ...playCards]);
    this._allPlayCardsLength = allPlayCards.length;
    allPlayCards.forEach((element) => {
      new Card(this._playground, element);
    });
  };

  shuffleCards = (cards) => {
    let ctr = cards.length,
      temp,
      index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = cards[ctr];
      cards[ctr] = cards[index];
      cards[index] = temp;
    }
    return cards;
  };

  setUpEvents = () => {
    window.addEventListener("flipped", (e) => this.setValues(e));
  };

  setValues = (e) => {
    console.log(e.detail);
    if (!this._firstCard) {
      this._firstCard = e.detail;
    } else {
      document.body
        .querySelectorAll(".card")
        .forEach((el) => el.classList.add("no-click"));
      this._secondCard = e.detail;
      setTimeout(() => this.checkValues(), 1000);
    }
  };

  checkValues = () => {
    if (this._firstCard._filename === this._secondCard._filename) {
      this._firstCard._ref.classList.add("matched");
      this._secondCard._ref.classList.add("matched");
      this._foundCards.push(this._firstCard, this._secondCard);
      this.resetCards();

      document.body
        .querySelectorAll(".card")
        .forEach((el) => el.classList.remove("no-click"));

      if (this._foundCards.length === this._allPlayCardsLength) {
        setTimeout(() => this.finishGame(), 500);
      }
    } else {
      this._firstCard._isFlipped = false;
      this._secondCard._isFlipped = false;

      document.body
        .querySelectorAll(".card")
        .forEach((el) => el.classList.remove("no-click"));

      this._firstCard._ref.classList.remove("flipped");
      this._secondCard._ref.classList.remove("flipped");

      this.resetCards();
    }
  };

  resetCards = () => {
    this._firstCard = null;
    this._secondCard = null;
  };

  finishGame = () => {
    console.log(this._lvl);
    if (this._lvl >= 8) {
      this.theEnd();
    } else {
      this._lvl++;
      this.saveToPersist();
      this._foundCards = [];
      this._allPlayCardsLength = null;
      this._playground.innerHTML = "";

      let msg = new Message(
        this._playground,
        `Good job you did!<br> Level ${this._lvl} next is.`
      );
      let yoda = new Yoda(this._playground);
      console.log(yoda);
      setTimeout(() => {
        yoda._ref.classList.add("show");
        yodasound.play();
        msg._ref.classList.add("show");
        setTimeout(() => {
          yoda._ref.classList.remove("show");
          msg._ref.classList.remove("show");
          setTimeout(() => {
            this._playground.innerHTML = "";
            msg = null;
            yoda = null;
            this.init();
          }, 1500);
        }, 3200);
      }, 300);
    }
  };

  theEnd = () => {
    this._playground.innerHTML = "";
    this._lvl = 1;
    let endmsg = new Message(
      this._playground,
      `Well done, ${this._username}.<br> You have earned the rank of Jedi Master.`
    );
    setTimeout(() => {endmsg._ref.classList.add("show");}, 500);
    victory.play();
    localStorage.clear();
    setTimeout(() => {
      this._playground.innerHTML = "";
      endmsg = null;
      this.startLevel();
    }, 120000);
  };
}
