// noinspection JSUnusedGlobalSymbols
// TODO: make sure the keybindings are exclusive

document.addEventListener("alpine:init", () => {
  document.addEventListener("keyup", (event) => {
    if (Alpine.store("state") === "matchover") {
      Alpine.store("match").newMatch();
      return;
    }
    if (Alpine.store("state") === "gameover") {
      Alpine.store("match").newGame();
      return;
    }
    if (Alpine.store("state") === "game") {
      Alpine.store("config").scoreFromKey(event);
      return;
    }
    if (Alpine.store("state") === "correction") {
      Alpine.store("config").correctFromKey(event);
      return;
    }
    if (Alpine.store("config").mode === "recording") {
      Alpine.store("config").recordKey(event.key);
    }
  });
  // states are "game" "setup" "gameover" and "matchover" to show the current game score, a screen for the winner,
  // or  setup data in the store config
  Alpine.store("state", "game");

  // Stores the configuration of the match length and scoring buttons. Also persists to localStorage.
  Alpine.store("config", {
    init() {
      this.matchLength = localStorage.getItem("config.matchLength") || 5;
      this.player1Key =
        localStorage.getItem("config.player1Key") || "ArrowLeft";
      this.player2Key =
        localStorage.getItem("config.player2Key") || "ArrowRight";
      this.scoreCorrectionKey =
        localStorage.getItem("config.scoreCorrectionKey") || "Tab";
      this.winningScore = localStorage.getItem("config.winningScore") || 11;
      this.switchSides =
        Boolean(localStorage.getItem("config.config.switchSides")) || true;
    },

    matchLength: 5,
    player1Key: "ArrowLeft",
    player2Key: "ArrowRight",
    scoreCorrectionKey: "Tab",
    mode: "playing",
    recording: "",
    winningScore: 11,
    switchSides: true,

    correctFromKey(event) {
      if (event.key === this.player1Key) {
        Alpine.store("match").player1Correction();
        event.stopPropagation();
      } else if (event.key === this.player2Key) {
        Alpine.store("match").player2Correction();
        event.stopPropagation();
      } else {
        Alpine.store("state", "game");
      }
    },

    scoreFromKey(event) {
      if (event.key === this.player1Key) {
        Alpine.store("match").player1Scored();
        event.stopPropagation();
      } else if (event.key === this.player2Key) {
        Alpine.store("match").player2Scored();
        event.stopPropagation();
      } else if (event.key === this.scoreCorrectionKey) {
        Alpine.store("state", "correction");
        event.stopPropagation();
      }
    },

    recordKey(key) {
      if (this.recording === "player1") {
        this.player1Key = key;
        localStorage.setItem("config.player1Key", key);
      } else if (this.recording === "player2") {
        this.player2Key = key;
        localStorage.setItem("config.player2Key", key);
      } else if (this.recording === "correction") {
        this.scoreCorrectionKey = key;
        localStorage.setItem("config.scoreCorrectionKey", key);
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

    recordCorrectionKey() {
      this.mode = "recording";
      this.recording = "correction";
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
      localStorage.setItem("config.matchLength", this.matchLength);
      this.player1Key = "ArrowLeft";
      localStorage.setItem("config.player1Key", this.player1Key);
      this.player2Key = "ArrowRight";
      localStorage.setItem("config.player2Key", this.player2Key);
      this.mode = "playing";
      this.recording = "";
      this.winningScore = 11;
    },

    saveConfig() {
      localStorage.setItem("config.matchLength", this.matchLength);
      localStorage.setItem("config.winningScore", this.winningScore);
      localStorage.setItem("config.switchSides", this.switchSides);
    },
  });

  // Models the state of the match between the two players, with current scores, game counts, and a game log.
  Alpine.store("match", {
    init() {
      this.player1.name =
        localStorage.getItem("match.player1.name") || "Player 1";
      this.player2.name =
        localStorage.getItem("match.player2.name") || "Player 2";
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
    reversed: false,

    saveNames() {
      localStorage.setItem("match.player1.name", this.player1.name);
      localStorage.setItem("match.player2.name", this.player2.name);
    },

    get leftName() {
      return this.reversed ? this.player2.name : this.player1.name;
    },

    get rightName() {
      return this.reversed ? this.player1.name : this.player2.name;
    },

    player1Correction() {
      if (this.player1.score > 0) {
        this.player1.score -= 1;
      }
    },

    player2Correction() {
      if (this.player2.score > 0) {
        this.player2.score -= 1;
      }
    },

    leftCorrection() {
      if (this.reversed) {
        this.player2Correction();
      } else {
        this.player1Correction();
      }
    },

    rightCorrection() {
      if (this.reversed) {
        this.player1Correction();
      } else {
        this.player2Correction();
      }
    },

    get leftScore() {
      return this.reversed ? this.player2.score : this.player1.score;
    },

    get rightScore() {
      return this.reversed ? this.player1.score : this.player2.score;
    },

    get leftGames() {
      return this.reversed ? this.player2.games : this.player1.games;
    },

    get rightGames() {
      return this.reversed ? this.player1.games : this.player2.games;
    },

    leftScored() {
      if (this.reversed) {
        this.player2Scored();
      } else {
        this.player1Scored();
      }
    },

    rightScored() {
      if (this.reversed) {
        this.player1Scored();
      } else {
        this.player2Scored();
      }
    },

    player1Scored() {
      this.player1.score += 1;
      // play to 11 AND win by more than one point
      if (
        this.player1.score >= Alpine.store("config").winningScore &&
        this.player1.score > this.player2.score + 1
      ) {
        this.recordGame(this.player1);
      }
    },

    player2Scored() {
      this.player2.score += 1;
      // play to 11 AND win by more than one point
      if (
        this.player2.score >= Alpine.store("config").winningScore &&
        this.player2.score > this.player1.score + 1
      ) {
        this.recordGame(this.player2);
      }
    },

    newMatch() {
      this.player1.games = 0;
      this.player2.games = 0;
      this.gameLog = [];
      this.reversed = false;
      this.newGame();
    },

    switchSides() {
      this.reversed = !this.reversed;
    },

    newGame() {
      this.player1.score = 0;
      this.player2.score = 0;
      if (Alpine.store("config").switchSides) {
        this.switchSides();
      }
      Alpine.store("state", "game");
    },

    showGameWinner() {
      Alpine.store("state", "gameover");
    },

    showMatchWinner() {
      Alpine.store("state", "matchover");
    },

    recordGame(winner) {
      this.gameLog.push({
        winner,
        player1score: this.player1.score,
        player2score: this.player2.score,
      });
      winner.games += 1;
      if (winner.games > Alpine.store("config").matchLength / 2) {
        this.showMatchWinner();
      } else {
        this.showGameWinner();
      }
    },

    get lastGameLeftScore() {
      return this.reversed
        ? this.lastGame.player2score
        : this.lastGame.player1score;
    },

    get lastGameRightScore() {
      return this.reversed
        ? this.lastGame.player1score
        : this.lastGame.player2score;
    },

    get lastGame() {
      if (this.gameLog.length === 0) {
        return {
          winner: "Error",
          player1Score: "Error",
          player2Score: "Error",
        };
      }
      return this.gameLog[this.gameLog.length - 1];
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
      this.player1.name = "Player 1";
      this.player2.name = "Player 2";
      this.saveNames();
      this.player1.games = 0;
      this.player2.games = 0;
      this.gameLog = [];
      this.player1.score = 0;
      this.player2.score = 0;
    },
  });
});
