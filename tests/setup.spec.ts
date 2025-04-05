import { test, expect } from "@playwright/test";
import { increaseSideScore, setSideScore } from "./util";

test.describe("setup mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test.describe("player names", () => {
    test("can change player 1 name", async ({ page }) => {
      await expect(page.getByTestId("left-name")).toContainText("Player 1");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player1-name-input").fill("New Name");
      await page.getByTestId("setup-done-button").click();
      await expect(page.getByTestId("left-name")).toContainText("New Name");
      await expect(page.getByTestId("left-button")).toContainText(
        "New Name Scored",
      );
      await expect(page.getByTestId("left-button")).not.toContainText(
        "Player 1",
      );
      await expect(page.getByTestId("left-name")).not.toContainText("Player 1");
    });

    test("can change player 2 name", async ({ page }) => {
      await expect(page.getByTestId("right-name")).toContainText("Player 2");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player2-name-input").fill("New Name");
      await page.getByTestId("setup-done-button").click();
      await expect(page.getByTestId("right-name")).toContainText("New Name");
      await expect(page.getByTestId("right-button")).toContainText(
        "New Name Scored",
      );
      await expect(page.getByTestId("right-button")).not.toContainText(
        "Player 2",
      );
      await expect(page.getByTestId("right-name")).not.toContainText(
        "Player 2",
      );
    });

    test("player 1 name change applies in correction mode", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-name")).toContainText("Player 1");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player1-name-input").fill("New Name");
      await page.getByTestId("setup-done-button").click();

      await page.getByTestId("correction-button").click();
      await expect(page.getByTestId("left-name")).toContainText("New Name");
      await expect(page.getByTestId("left-correction-button")).toContainText(
        "New Name",
      );
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toContainText("Player 1");
    });

    test("player 2 name change applies in correction mode", async ({
      page,
    }) => {
      await expect(page.getByTestId("right-name")).toContainText("Player 2");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player2-name-input").fill("New Name");
      await page.getByTestId("setup-done-button").click();

      await page.getByTestId("correction-button").click();
      await expect(page.getByTestId("right-name")).toContainText("New Name");
      await expect(page.getByTestId("right-correction-button")).toContainText(
        "New Name",
      );
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toContainText("Player 2");
    });
  });

  test.describe("keybinds", () => {
    test("can change player 1 keybind", async ({ page }) => {
      // player 1 is on the left by default
      await expect(page.getByTestId("left-score")).toContainText("0");
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByTestId("left-score")).toContainText("1");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player1-keybind-button").click();
      await page.keyboard.press("a");
      await page.getByTestId("setup-done-button").click();
      await page.keyboard.press("a");
      await expect(page.getByTestId("left-score")).toContainText("2");
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByTestId("left-score")).toContainText("2");
      await expect(page.getByTestId("right-score")).toContainText("0");
    });

    test("can change player 2 keybind", async ({ page }) => {
      // player 2 is on the left by default
      await expect(page.getByTestId("right-score")).toContainText("0");
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("right-score")).toContainText("1");
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player2-keybind-button").click();
      await page.keyboard.press("a");
      await page.getByTestId("setup-done-button").click();
      await page.keyboard.press("a");
      await expect(page.getByTestId("right-score")).toContainText("2");
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("right-score")).toContainText("2");
      await expect(page.getByTestId("left-score")).toContainText("0");
    });

    test("player 1 keybind applies in correction mode", async ({ page }) => {
      for (let i = 0; i < 2; ++i) {
        await page.getByTestId("left-button").click();
      }
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player1-keybind-button").click();
      await page.keyboard.press("a");
      await page.getByTestId("setup-done-button").click();
      await page.getByTestId("correction-button").click();
      await expect(page.getByTestId("left-score")).toContainText("2");
      await page.keyboard.press("a");
      await expect(page.getByTestId("left-score")).toContainText("1");
    });
    test("player 2 keybind applies in correction mode", async ({ page }) => {
      for (let i = 0; i < 2; ++i) {
        await page.getByTestId("right-button").click();
      }
      await page.getByTestId("setup-button").click();
      await page.getByTestId("player2-keybind-button").click();
      await page.keyboard.press("a");
      await page.getByTestId("setup-done-button").click();
      await page.getByTestId("correction-button").click();
      await expect(page.getByTestId("right-score")).toContainText("2");
      await page.keyboard.press("a");
      await expect(page.getByTestId("right-score")).toContainText("1");
    });
    test("can change correction keybind", async ({ page }) => {
      await expect(page.getByTestId("correction-button")).toBeVisible();
      await expect(page.getByTestId("end-correction-button")).not.toBeVisible();
      await page.keyboard.press("Tab");
      await expect(page.getByTestId("correction-button")).not.toBeVisible();
      await expect(page.getByTestId("end-correction-button")).toBeVisible();
      await page.keyboard.press("Tab");

      await page.getByTestId("setup-button").click();
      await page.getByTestId("correction-keybind-button").click();
      await page.keyboard.press("c");
      await page.getByTestId("setup-done-button").click();

      await expect(page.getByTestId("correction-button")).toBeVisible();
      await expect(page.getByTestId("end-correction-button")).not.toBeVisible();
      await page.keyboard.press("c");
      await expect(page.getByTestId("correction-button")).not.toBeVisible();
      await expect(page.getByTestId("end-correction-button")).toBeVisible();
      await page.keyboard.press("c");

      await expect(page.getByTestId("correction-button")).toBeVisible();
      await expect(page.getByTestId("end-correction-button")).not.toBeVisible();
      await page.keyboard.press("Tab");
      await expect(page.getByTestId("correction-button")).toBeVisible();
      await expect(page.getByTestId("end-correction-button")).not.toBeVisible();
    });
  });

  test.describe("gameSettings", () => {
    test("can change the winning score", async ({ page }) => {
      await page.getByTestId("setup-button").click();
      await page.getByTestId("winning-score-input").fill("21");
      await page.getByTestId("setup-done-button").click();
      // set player 1 score to 11
      await setSideScore(page, "left", 11);
      await expect(page.getByTestId("winner-text")).not.toBeVisible();
      // set player 2 score to 18
      await setSideScore(page, "right", 18);
      await expect(page.getByTestId("winner-text")).not.toBeVisible();
      // set player 2 score to 21
      await increaseSideScore(page, "right", 3);
      await expect(page.getByTestId("winner-text")).toBeVisible();
    });

    test("can change the match length", async ({ page }) => {
      await page.getByTestId("setup-button").click();
      await page.getByTestId("match-length-input").fill("3");
      await page.getByTestId("setup-done-button").click();
      // play two games
      //
      // left player (player 1) wins
      await setSideScore(page, "left", 11);
      await expect(page.getByTestId("winner-text")).toBeVisible();
      await page.getByTestId("new-game-button").click();
      if (await page.getByTestId("left-score").isHidden()) {
        await page.getByTestId("start-game-button").click();
      }
      // sides swap

      await expect(page.getByTestId("left-score")).toBeVisible({
        timeout: 2100,
      });
      // left player (player 2) wins
      await setSideScore(page, "left", 11);
      await expect(page.getByTestId("winner-text")).toBeVisible();
      await page.getByTestId("new-game-button").click();
      if (await page.getByTestId("left-score").isHidden()) {
        await page.getByTestId("start-game-button").click();
      }

      await expect(page.getByTestId("left-score")).toBeVisible({
        timeout: 2100,
      });
      // third game ends match
      await setSideScore(page, "left", 11);
      await expect(page.getByTestId("winner-text")).toBeVisible();
      await expect(page.getByTestId("match-end-screen")).toBeVisible();
    });

    test("can change switching sides", async ({ page }) => {
      await page.getByTestId("setup-button").click();
      await page.getByTestId("switch-sides-input").uncheck();
      await page.getByTestId("setup-done-button").click();
      // play a game games
      //
      // left player is player 1 and right player is player 2
      await expect(page.getByTestId("left-name")).toContainText("Player 1");
      await expect(page.getByTestId("right-name")).toContainText("Player 2");
      await setSideScore(page, "left", 11);
      await expect(page.getByTestId("winner-text")).toBeVisible();
      await page.getByTestId("new-game-button").click();
      if (await page.getByTestId("left-score").isHidden()) {
        await page.getByTestId("start-game-button").click();
      }
      // sides DO NOT swap
      await expect(page.getByTestId("left-name")).toContainText("Player 1");
      await expect(page.getByTestId("right-name")).toContainText("Player 2");
    });
  });
});
