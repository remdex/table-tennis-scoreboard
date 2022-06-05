// noinspection JSUnusedGlobalSymbols

document.addEventListener("alpine:init", () => {
  document.addEventListener("keyup", event => {
    if (Alpine.store("state") === "matchover") {
      Alpine.store("match").newMatch();
      return;
    }
    if (Alpine.store("state") === "gameover") {
      Alpine.store("match").newGame();
      return;
    }
    if (Alpine.store("config").mode === "playing") {
      Alpine.store("config").scoreFromKey(event.key);
    } else if (Alpine.store("config").mode === "recording") {
      Alpine.store("config").recordKey(event.key);
    }
  });
  // states are "game" "setup" "gameover" and "matchover to show the current game score, a screen for the winner,
  // or  setup data in the store config
  Alpine.store("state", "game");

  Alpine.store("config", {
    init() {
      this.matchLength = localStorage.getItem("config.matchLength") || 5;
      this.player1Key = localStorage.getItem("config.player1Key") || "ArrowLeft";
      this.player2Key = localStorage.getItem("config.player2Key") || "ArrowRight";
    },

    matchLength: 5,
    player1Key: "ArrowLeft",
    player2Key: "ArrowRight",
    mode: "playing",
    recording: "",

    handleKeys(event) {
      console.log(Alpine.mode);
      if (this.mode === "playing") {
        console.log("playing");
        this.scoreFromKey(event.key);
      } else if (this.mode === "recording") {
        console.log("recording key", event.key);
        this.recordKey(event.key);
      }
    },

    scoreFromKey(key) {
      if (key === this.player1Key) {
        Alpine.store("match").player1Scored();
      } else if (key === this.player2Key) {
        Alpine.store("match").player2Scored();
      }
    },

    recordKey(key) {
      if (this.recording === "player1") {
        this.player1Key = key;
        localStorage.setItem("config.player1Key", key);
      } else if (this.recording === "player2") {
        this.player2Key = key;
        localStorage.setItem("config.player2Key", key);
      }
      this.mode = "playing";
      this.recording = "";
    },

    recordPlayer1Key() {
      this.mode = "recording";
      this.recording = "player1";
    },

    recordPlayer2Key() {
      this.mode = "recording";
      this.recording = "player2";
    },

    // Side effect of saving to localStorage
    validateMatchLength() {
      this.matchLength = parseInt(this.matchLength);
      if (!this.matchLength || this.matchLength < 1) {
        // reset to default if empty or 0
        this.matchLength = 5;
      } else if (this.matchLength % 2 === 0) {
        this.matchLength += 1;
      }
      localStorage.setItem("config.matchLength", this.matchLength);
    },

    fewerGames() {
      if (this.matchLength > 1) {
        this.matchLength = parseInt(this.matchLength) - 2;
      }
    },

    moreGames() {
      this.matchLength = parseInt(this.matchLength) + 2;
    },

    reset() {
      this.matchLength = 5;
      localStorage.setItem('config.matchLength', this.matchLength);
      this.player1Key = "ArrowLeft";
      localStorage.setItem('config.player1Key', this.player1Key)
      this.player2Key = "ArrowRight";
      localStorage.setItem('config.player2Key', this.player2Key)
      this.mode = "playing";
      this.recording = "";
    },
  });

  Alpine.store("match", {
    init() {
      this.player1.name = localStorage.getItem("match.player1.name") || "Player 1";
      this.player2.name = localStorage.getItem("match.player2.name") || "Player 2";
    },
    player1: {
      name: "Player 1",
      score: 0,
      games: 0,
    },
    player2: {
      name: "Player 2",
      score: 0,
      games: 0,
    },
    // A game is an object with keys winner, player1score, and player2score
    gameLog: [],

    saveNames() {
      localStorage.setItem("match.player1.name", this.player1.name);
      localStorage.setItem("match.player2.name", this.player2.name);
    },

    player1Scored() {
      this.player1.score += 1;
      // play to 11 AND win by more than one point
      if (this.player1.score > 10 && this.player1.score > this.player2.score + 1) {
        this.recordGame(this.player1);
      }
    },
    player2Scored() {
      this.player2.score += 1;
      // play to 11 AND win by more than one point
      if (this.player2.score > 10 && this.player2.score > this.player1.score + 1) {
        this.recordGame(this.player2);
      }
    },

    newMatch() {
      this.player1.games = 0;
      this.player2.games = 0;
      this.gameLog = [];
      this.newGame();
    },

    newGame() {
      this.player1.score = 0;
      this.player2.score = 0;
      Alpine.store("state", "game");
    },

    showGameWinner() {
      Alpine.store("state", "gameover");
    },

    showMatchWinner() {
      Alpine.store("state", "matchover");
    },

    recordGame(winner) {
      this.gameLog.push({ winner, player1score: this.player1.score, player2score: this.player2.score });
      winner.games += 1;
      if (winner.games > Alpine.store("config").matchLength / 2) {
        this.showMatchWinner();
      } else {
        this.showGameWinner();
      }
    },

    get lastGame() {
      return this.gameLog[(this.gameLog.length - 1)];
    },

    get winnerText() {
      if (this.lastGame) {
        return this.lastGame.winner.name + " Wins!";
      }
      return "Something Went Wrong";
    },

    get matchWinnerText() {
      if (this.lastGame.winner.games < Alpine.store("config").matchLength / 2) {
        return "Something Went Wrong";
      }
      return this.lastGame.winner.name + " Wins the match!";
    },

    resetConfig() {
      this.player1.name = 'Player 1';
      this.player2.name = 'Player 2';
      this.saveNames();
      this.player1.games = 0;
      this.player2.games = 0;
      this.gameLog = [];
      this.player1.score = 0;
      this.player2.score = 0;
    }

  });
});
