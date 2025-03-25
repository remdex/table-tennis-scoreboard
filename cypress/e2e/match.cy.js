describe("match", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
  });

  it("starts new game from win screen on click and records win (player1 win)", () => {
    // player 1 starts on the left, score should be on the left
    cy.setPlayerScore("right", 8);
    cy.setPlayerScore("left", 11);
    cy.get('[data-test="winner-text"]').contains("Player 1");
    cy.get('[data-test="left-score"]').contains("11");
    cy.get('[data-test="right-score"]').contains("8");
    cy.get('[data-test="new-game-button"]').click();
    // default config this will reverse
    cy.get('[data-test="right-games"]').contains("1");
    cy.get('[data-test="left-games"]').contains("0");
    cy.get('[data-test="right-score"]').contains("0");
    cy.get('[data-test="left-score"]').contains("0");
  });

  it("starts new game from win screen on click and records win (player2 win)", () => {
    // player 2 starts on the right
    cy.setPlayerScore("left", 4);
    cy.setPlayerScore("right", 11);
    cy.get('[data-test="winner-text"]').contains("Player 2");
    cy.get('[data-test="right-score"]').contains("11");
    cy.get('[data-test="left-score"]').contains("4");
    cy.get('[data-test="new-game-button"]').click();
    // default configuration will reverse
    cy.get('[data-test="left-games"]').contains("1");
    cy.get('[data-test="right-games"]').contains("0");
    cy.get('[data-test="left-score"]').contains("0");
    cy.get('[data-test="right-score"]').contains("0");
  });

  it("Plays entire match, player1 wins", () => {
    cy.setPlayerScore("player2", 4);
    cy.setPlayerScore("player1", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player2", 8);
    cy.setPlayerScore("player1", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player2", 8);
    cy.setPlayerScore("player1", 11);
    cy.get('[data-test="winner-text"]').contains("match");
    cy.get('[data-test="winner-text"]').contains("Player 1");
  });

  it("Plays entire match, player2 wins", () => {
    cy.setPlayerScore("player1", 4);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player1", 8);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player1", 9);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="winner-text"]').contains("match");
    cy.get('[data-test="winner-text"]').contains("Player 2");
  });

  it("Plays complex match, player2 wins", () => {
    cy.setPlayerScore("player1", 4);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player2", 7);
    cy.setPlayerScore("player1", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player1", 8);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player2", 2);
    cy.setPlayerScore("player1", 11);
    cy.get('[data-test="new-game-button"]').click();

    cy.setPlayerScore("player1", 9);
    cy.setPlayerScore("player2", 11);
    cy.get('[data-test="winner-text"]').contains("match");
    cy.get('[data-test="winner-text"]').contains("Player 2");
  });
});
