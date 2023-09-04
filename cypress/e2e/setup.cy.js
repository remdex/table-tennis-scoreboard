describe("setup", () => {

  describe("player names", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });
    it("can change player 1 name", () => {
      cy.get('[data-test="player1-name"]').contains("Player 1");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player1-name-input"]').clear();
      cy.get('[data-test="player1-name-input"]').type("New Name");
      cy.get('[data-test="setup-done-button"]').click();
      cy.get('[data-test="player1-name"]').contains("New Name");
      cy.get('[data-test="player1-button"]').contains("New Name Scored");
      cy.get('[data-test="player1-button"]').should("not.contain", "Player 1");
    });

    it("can change player 2 name", () => {
      cy.get('[data-test="player2-name"]').contains("Player 2");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player2-name-input"]').clear();
      cy.get('[data-test="player2-name-input"]').type("New Name");
      cy.get('[data-test="setup-done-button"]').click();
      cy.get('[data-test="player2-name"]').contains("New Name");
      cy.get('[data-test="player2-button"]').contains("New Name Scored");
      cy.get('[data-test="player2-button"]').should("not.contain", "Player 2");
    });

    it("player 1 name change applies in correction mode", () => {
      cy.get('[data-test="player1-name"]').contains("Player 1");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player1-name-input"]').clear();
      cy.get('[data-test="player1-name-input"]').type("New Name");
      cy.get('[data-test="setup-done-button"]').click();

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="player1-name"]').contains("New Name");
      cy.get('[data-test="player1-correction-button"]').contains("New Name");
      cy.get('[data-test="player1-correction-button"]').should(
        "not.contain",
        "Player 1"
      );
    });

    it("player 2 name change applies in correction mode", () => {
      cy.get('[data-test="player2-name"]').contains("Player 2");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player2-name-input"]').clear();
      cy.get('[data-test="player2-name-input"]').type("New Name");
      cy.get('[data-test="setup-done-button"]').click();

      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="player2-name"]').contains("New Name");
      cy.get('[data-test="player2-correction-button"]').contains("New Name");
      cy.get('[data-test="player2-correction-button"]').should(
        "not.contain",
        "Player 1"
      );
    });
  });
  describe("keybinds", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });
    it("can change player 1 keybind", () => {
      cy.get('[data-test="player1-score"]').contains("0");
      cy.pressKey('ArrowLeft');
      cy.get('[data-test="player1-score"]').contains("1");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player1-keybind-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="setup-done-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="player1-score"]').contains("2");
      cy.pressKey('ArrowLeft');
      cy.get('[data-test="player1-score"]').contains("2");
      cy.get('[data-test="player2-score"]').contains("0");
    });

    it("can change player 2 keybind", () => {
      cy.get('[data-test="player2-score"]').contains("0");
      cy.pressKey('ArrowRight');
      cy.get('[data-test="player2-score"]').contains("1");
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player2-keybind-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="setup-done-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="player2-score"]').contains("2");
      cy.pressKey('ArrowRight');
      cy.get('[data-test="player2-score"]').contains("2");
      cy.get('[data-test="player1-score"]').contains("0");
    });

    it("player 1 keybind applies in correction mode", () => {
      cy.setPlayerScore('player1', 2)
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player1-keybind-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="setup-done-button"]').click();
      cy.wait(100);
      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="player1-score"]').contains("2");
      cy.pressKey('a');
      cy.get('[data-test="player1-score"]').contains("1");
    });
    it("player 2 keybind applies in correction mode", () => {
      cy.setPlayerScore('player2', 2)
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="player2-keybind-button"]').click();
      cy.pressKey('a');
      cy.get('[data-test="setup-done-button"]').click();
      cy.wait(100);
      cy.get('[data-test="correction-button"]').click();
      cy.get('[data-test="player2-score"]').contains("2");
      cy.pressKey('a');
      cy.get('[data-test="player2-score"]').contains("1");
    });
    it("can change correction keybind", () => {
      cy.get('[data-test="correction-button"]').should('be.visible');
      cy.get('[data-test="end-correction-button"]').should('not.be.visible');
      cy.pressKey('Tab');
      cy.get('[data-test="correction-button"]').should('not.be.visible');
      cy.get('[data-test="end-correction-button"]').should('be.visible');
      cy.pressKey('Tab');

      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="correction-keybind-button"]').click();
      cy.pressKey('c');
      cy.get('[data-test="setup-done-button"]').click();

      cy.get('[data-test="correction-button"]').should('be.visible');
      cy.get('[data-test="end-correction-button"]').should('not.be.visible');
      cy.pressKey('c');
      cy.get('[data-test="correction-button"]').should('not.be.visible');
      cy.get('[data-test="end-correction-button"]').should('be.visible');
      cy.pressKey('c');

      cy.get('[data-test="correction-button"]').should('be.visible');
      cy.get('[data-test="end-correction-button"]').should('not.be.visible');
      cy.pressKey('Tab');
      cy.get('[data-test="correction-button"]').should('be.visible');
      cy.get('[data-test="end-correction-button"]').should('not.be.visible');
    });
  });

  describe('gameSettings', () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080");
    });

    it('can change the winning score', () => {
      cy.get('[data-test="setup-button"]').click();
      cy.get('[data-test="winning-score-input"]').clear();
      cy.get('[data-test="winning-score-input"]').type("21");
      cy.get('[data-test="setup-done-button"]').click();
      cy.setPlayerScore('player1', 11);
      cy.get('[data-test="winner-text"]').should("not.be.visible")
      cy.setPlayerScore('player2', 18);
      cy.get('[data-test="winner-text"]').should("not.be.visible")
      cy.get('[data-test="player2-button"]').click();
      cy.get('[data-test="player2-button"]').click();
      cy.get('[data-test="player2-button"]').click();
      cy.get('[data-test="winner-text"]').should("be.visible")
    })
  })
});
