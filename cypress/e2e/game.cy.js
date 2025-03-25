describe("game", () => {
  describe("gameplay features", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });
    it("increases left score", () => {
      cy.get('[data-test="left-score"]').contains("0");
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-score"]').contains("1");
    });

    it("increases right score", () => {
      cy.get('[data-test="right-score"]').contains("0");
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-score"]').contains("1");
    });
    // TODO: test default keys to increment score

    it("plays a regular game, left wins", () => {
      cy.get('[data-test="right-score"]').contains("0");
      cy.get('[data-test="left-score"]').contains("0");
      // 0-0
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 1-1
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 2-2
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 3-3
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-score"]').contains("5");
      cy.get('[data-test="right-score"]').contains("3");
      // 5-3

      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-button"]').click();
      // 9-3
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="left-score"]').contains("9");
      cy.get('[data-test="right-score"]').contains("5");
      // 9-5

      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-button"]').click();
      // 11-5
      cy.get('[data-test="winner-text"]').contains("Player 1");
      cy.get('[data-test="left-score"]').contains("11");
      cy.get('[data-test="right-score"]').contains("5");
    });
    it("plays a regular game, right wins", () => {
      cy.get('[data-test="right-score"]').contains("0");
      cy.get('[data-test="left-score"]').contains("0");
      // 0-0
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 1-1
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 1-3
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 2-4

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="left-button"]').click();
      // 3-7
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="left-score"]').contains("4");
      cy.get('[data-test="right-score"]').contains("8");
      // 8-4

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-button"]').click();
      // 11-4
      cy.get('[data-test="winner-text"]').contains("Player 2");
      cy.get('[data-test="left-score"]').contains("4");
      cy.get('[data-test="right-score"]').contains("11");
    });

    it("correctly handles a deuce in the default configuration", () => {
      cy.setPlayerScore("left", 10);
      cy.setPlayerScore("right", 10);

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-score"]').contains("11");
      cy.get('[data-test="game-end-screen"]').should("not.be.visible");

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-score"]').contains("12");
      cy.get('[data-test="left-score"]').contains("10");

      cy.get('[data-test="game-end-screen"]').should("be.visible");
    });

    it("correctly handles multiple deuces in the default configuration", () => {
      cy.setPlayerScore("left", 10);
      cy.setPlayerScore("right", 10);

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="left-button"]').click();
      cy.get('[data-test="right-score"]').contains("11");
      cy.get('[data-test="left-score"]').contains("11");
      cy.get('[data-test="game-end-screen"]').should("not.be.visible");

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-score"]').contains("12");
      cy.get('[data-test="game-end-screen"]').should("not.be.visible");

      cy.get('[data-test="right-button"]').click();
      cy.get('[data-test="right-score"]').contains("13");
      cy.get('[data-test="game-end-screen"]').should("be.visible");
    });
  });

  describe("correction", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });

    it("can enter correction mode", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.get('[data-test="correction-button"]').click();

      cy.get('[data-test="left-correction-button"]').should("be.visible");
      cy.get('[data-test="left-button"]').should("not.be.visible");
      cy.get('[data-test="right-correction-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("not.be.visible");
    });

    it("can leave correction mode", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.get('[data-test="correction-button"]').click();

      cy.get('[data-test="left-correction-button"]').should("be.visible");
      cy.get('[data-test="left-button"]').should("not.be.visible");
      cy.get('[data-test="right-correction-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("not.be.visible");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').should("not.be.visible");
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-correction-button"]').should("not.be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
    });

    it("can correct left score by 1 point and retains the correction", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("left", 3);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("2");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("2");
    });

    it("can correct player 2 score by 1 point and retains the correction", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("right", 3);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("2");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("2");
    });

    it("can correct player 2 score by more than 1 point and retains the correction", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("right", 3);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("0");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("0");
    });

    it("can correct left score by more than 1 point and retains the correction", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("left", 8);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("4");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("4");
    });

    it("left score cannot be negative", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("left", 3);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("0");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="left-score"]').contains("0");
    });

    it("player 2 score cannot be negative", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.setPlayerScore("right", 3);

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("0");

      cy.get('[data-test="end-correction-button"]').click();
      cy.get('[data-test="right-score"]').contains("0");
    });
  });

  describe("keyboard", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });

    it("increases the player one score with the left arrow, but not the player two score", () => {
      cy.get('[data-test="left-score"]').contains("0");
      cy.pressKey("ArrowLeft");
      cy.get('[data-test="left-score"]').contains("1");
      cy.get('[data-test="right-score"]').contains("0");
    });

    it("increases the player two score with the right arrow", () => {
      cy.get('[data-test="right-score"]').contains("0");
      cy.pressKey("ArrowRight");
      cy.get('[data-test="right-score"]').contains("1");
      cy.get('[data-test="left-score"]').contains("0");
    });

    it("Enters correction mode with the tab key", () => {
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="left-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");
      cy.get('[data-test="left-button"]').should("be.not.visible");
      cy.get('[data-test="left-correction-button"]').should("be.visible");
    });

    it("decreases player 1 score by 1 with the player 1 key in correction mode", () => {
      // TODO: make this side independent and test reversed
      cy.setPlayerScore("left", 2);
      cy.get('[data-test="left-score"]').contains("2");
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="left-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="left-button"]').should("be.not.visible");
      cy.get('[data-test="left-correction-button"]').should("be.visible");

      cy.pressKey("ArrowLeft");
      cy.get('[data-test="left-score"]').contains("1");

      cy.pressKey("Tab");
      cy.get('[data-test="left-score"]').contains("1");
    });

    it("decreases player 2 score by 1 with the player 2 key in correction mode", () => {
      // TODO: make side independent and test reversed
      cy.setPlayerScore("right", 2);
      cy.get('[data-test="right-score"]').contains("2");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.get('[data-test="right-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="right-button"]').should("be.not.visible");
      cy.get('[data-test="right-correction-button"]').should("be.visible");

      cy.pressKey("ArrowRight");
      cy.get('[data-test="right-score"]').contains("1");

      cy.pressKey("Tab");
      cy.get('[data-test="right-score"]').contains("1");
    });

    it("decreases player 1 score by 1 with the player 1 key in correction mode", () => {
      // TODO: make side independent and test reversed
      cy.setPlayerScore("left", 5);
      cy.get('[data-test="left-score"]').contains("5");
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="left-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="left-button"]').should("be.not.visible");
      cy.get('[data-test="left-correction-button"]').should("be.visible");

      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.get('[data-test="left-score"]').contains("2");

      cy.pressKey("Tab");
      cy.get('[data-test="left-score"]').contains("2");
    });

    it("decreases player 2 score by more than 1 with the player 2 key", () => {
      // TODO: make side independent and test reversed
      cy.setPlayerScore("right", 6);
      cy.get('[data-test="right-score"]').contains("6");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.get('[data-test="right-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="right-button"]').should("be.not.visible");
      cy.get('[data-test="right-correction-button"]').should("be.visible");

      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.get('[data-test="right-score"]').contains("2");

      cy.pressKey("Tab");
      cy.get('[data-test="right-score"]').contains("2");
    });

    it("cannot make left score negative", () => {
      cy.setPlayerScore("left", 1);
      cy.get('[data-test="left-score"]').contains("1");
      cy.get('[data-test="left-button"]').should("be.visible");
      cy.get('[data-test="left-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="left-button"]').should("be.not.visible");
      cy.get('[data-test="left-correction-button"]').should("be.visible");

      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.pressKey("ArrowLeft");
      cy.get('[data-test="left-score"]').contains("0");

      cy.pressKey("Tab");
      cy.get('[data-test="left-score"]').contains("0");
    });

    it("cannot make right score negative", () => {
      cy.setPlayerScore("right", 1);
      cy.get('[data-test="right-score"]').contains("1");
      cy.get('[data-test="right-button"]').should("be.visible");
      cy.get('[data-test="right-correction-button"]').should("be.not.visible");
      cy.pressKey("Tab");

      cy.get('[data-test="right-button"]').should("be.not.visible");
      cy.get('[data-test="right-correction-button"]').should("be.visible");

      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.pressKey("ArrowRight");
      cy.get('[data-test="right-score"]').contains("0");

      cy.pressKey("Tab");
      cy.get('[data-test="right-score"]').contains("0");
    });

    it("can use any key to advance the game", () => {
      cy.setPlayerScore("right", 11);
      cy.get('[data-test="right-score"]').contains("11");
      cy.get('[data-test="winner-text"]').should("be.visible");
      cy.pressKey("ArrowRight");
      cy.get('[data-test="winner-text"]').should("not.be.visible");
      cy.get('[data-test="right-score"]').contains("0");
    });
  });
});
