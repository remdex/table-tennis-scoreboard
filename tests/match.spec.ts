import test, { expect } from "@playwright/test";
import { advanceGame, setSideScore } from "./util";

test.describe("match", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("switches sides after one game", async ({ page }) => {
    await expect(page.getByTestId("left-name")).toContainText("Player 1");
    await expect(page.getByTestId("right-name")).toContainText("Player 2");
    await setSideScore(page, "left", 11);
    await advanceGame(page);
    await expect(page.getByTestId("left-name")).toContainText("Player 2");
    await expect(page.getByTestId("right-name")).toContainText("Player 1");
  });

  test("starts new game from win screen on click and records win (player1 win)", async ({
    page,
  }) => {
    // player 1 starts on the left, score should be on the left
    await setSideScore(page, "right", 8);
    await setSideScore(page, "left", 11);
    await expect(page.getByTestId("winner-text")).toContainText("Player 1");
    await expect(page.getByTestId("player1-score")).toContainText("11");
    await expect(page.getByTestId("player2-score")).toContainText("8");
    await page.getByTestId("new-game-button").click();
    // default config this will reverse
    await expect(page.getByTestId("right-games")).toContainText("1");
    await expect(page.getByTestId("left-games")).toContainText("0");
    await expect(page.getByTestId("right-score")).toContainText("0");
    await expect(page.getByTestId("left-score")).toContainText("0");
  });

  test("starts new game from win screen on click and records win (player2 win)", async ({
    page,
  }) => {
    // player 2 starts on the right
    await setSideScore(page, "left", 4);
    await setSideScore(page, "right", 11);
    await expect(page.getByTestId("winner-text")).toContainText("Player 2");
    await expect(page.getByTestId("player2-score")).toContainText("11");
    await expect(page.getByTestId("player1-score")).toContainText("4");
    await advanceGame(page);

    // default configuration will reverse
    await expect(page.getByTestId("left-games")).toContainText("1");
    await expect(page.getByTestId("right-games")).toContainText("0");
    await expect(page.getByTestId("left-score")).toContainText("0");
    await expect(page.getByTestId("right-score")).toContainText("0");
  });

  test("Plays entire match, player1 wins", async ({ page }) => {
    await setSideScore(page, "right", 4); // player2
    await setSideScore(page, "left", 11); // player1
    await advanceGame(page);

    // swap sides

    await setSideScore(page, "left", 8); // player2
    await setSideScore(page, "right", 11); // player1
    await advanceGame(page);

    // swap sides

    await setSideScore(page, "right", 8); // player2
    await setSideScore(page, "left", 11); // player1
    await expect(page.getByTestId("winner-text")).toContainText("Player 1");
    await expect(page.getByTestId("wins-the-match")).toBeVisible();
    await expect(page.getByTestId("player1-games")).toContainText("3");
    await expect(page.getByTestId("player2-games")).toContainText("0");
  });

  test("Plays entire match, player2 wins", async ({ page }) => {
    await setSideScore(page, "left", 4); // player1
    await setSideScore(page, "right", 11); // player2
    await advanceGame(page);
    // swap sides

    await setSideScore(page, "right", 8); // player1
    await setSideScore(page, "left", 11); //player2
    await advanceGame(page);
    //swap sides

    await setSideScore(page, "left", 9); // player1
    await setSideScore(page, "right", 11); // player2
    await expect(page.getByTestId("winner-text")).toContainText("Player 2");
    await expect(page.getByTestId("wins-the-match")).toBeVisible();

    await expect(page.getByTestId("player2-games")).toContainText("3");
    await expect(page.getByTestId("player1-games")).toContainText("0");
  });

  test("Plays complex match, player2 wins", async ({ page }) => {
    await setSideScore(page, "left", 4); //player1
    await setSideScore(page, "right", 11); //player2
    await advanceGame(page);
    // switch sides

    await setSideScore(page, "left", 7); // player2
    await setSideScore(page, "right", 11); //player1
    await advanceGame(page);
    // switch sides

    await setSideScore(page, "left", 8); //player1
    await setSideScore(page, "right", 11); // player2
    await advanceGame(page);
    //switch sides

    await setSideScore(page, "left", 2); //player2
    await setSideScore(page, "right", 11); // player1
    await page.getByTestId("new-game-button").click();
    //switch sides

    await setSideScore(page, "left", 9); // player1
    await setSideScore(page, "right", 11); //player2
    await expect(page.getByTestId("winner-text")).toContainText("Player 2");
    await expect(page.getByTestId("wins-the-match")).toBeVisible();

    await expect(page.getByTestId("player2-games")).toContainText("3");
    await expect(page.getByTestId("player1-games")).toContainText("2");
  });

  test("Plays complex match, player1 wins", async ({ page }) => {
    await setSideScore(page, "right", 4); //player1
    await setSideScore(page, "left", 11); //player2
    await advanceGame(page);
    // switch sides

    await setSideScore(page, "right", 7); // player2
    await setSideScore(page, "left", 11); //player1
    await advanceGame(page);
    // switch sides

    await setSideScore(page, "right", 8); //player1
    await setSideScore(page, "left", 11); // player2
    await advanceGame(page);
    //switch sides

    await setSideScore(page, "right", 2); //player2
    await setSideScore(page, "left", 11); // player1
    await page.getByTestId("new-game-button").click();
    //switch sides

    await setSideScore(page, "right", 9); // player1
    await setSideScore(page, "left", 11); //player2
    await expect(page.getByTestId("winner-text")).toContainText("Player 1");
    await expect(page.getByTestId("wins-the-match")).toBeVisible();
    await expect(page.getByTestId("player1-games")).toContainText("3");
    await expect(page.getByTestId("player2-games")).toContainText("2");
  });

  test("Plays a full match and can reset", async ({ page }) => {
    await setSideScore(page, "left", 11); // player1
    await advanceGame(page);

    // swap sides

    await setSideScore(page, "right", 11); // player1
    await advanceGame(page);

    // swap sides

    await setSideScore(page, "left", 11); // player1
    await expect(page.getByTestId("winner-text")).toContainText("Player 1");
    await page.getByTestId("new-match-button").click();

    await expect(page.getByTestId("winner-text")).not.toBeVisible({
      timeout: 750,
    });

    await expect(page.getByTestId("left-score")).toBeVisible();
    await expect(page.getByTestId("right-score")).toBeVisible();
    await expect(page.getByTestId("left-games")).toBeVisible();
    await expect(page.getByTestId("right-games")).toBeVisible();
    await expect(page.getByTestId("left-score")).toContainText("0");
    await expect(page.getByTestId("right-score")).toContainText("0");
    await expect(page.getByTestId("left-games")).toContainText("0");
    await expect(page.getByTestId("right-games")).toContainText("0");

    await expect(page.getByTestId("winner-text")).not.toBeVisible();
  });
});
