import { test, expect } from "@playwright/test";
import { setSideScore } from "./util";
import { defaultGameConfig } from "../src/components/common";

// TODO: add tests for sides swapped and full match
test.describe("game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test.describe("gameplay features", () => {
    test("increases left score", async ({ page }) => {
      await expect(page.getByTestId("left-score")).toContainText("0");
      await page.getByTestId("left-button").click();
      await expect(page.getByTestId("left-score")).toContainText("1");
    });

    test("increases right score", async ({ page }) => {
      await expect(page.getByTestId("right-score")).toContainText("0");
      await page.getByTestId("right-button").click();
      await expect(page.getByTestId("right-score")).toContainText("1");
    });

    test("puts players on correct sides to start", async ({ page }) => {
      await expect(page.getByTestId("left-name")).toContainText("Player 1");
      await expect(page.getByTestId("right-name")).toContainText("Player 2");
    });

    test("plays a regular game 1, left (player 1) wins", async ({ page }) => {
      await expect(page.getByTestId("right-score")).toContainText("0");
      await expect(page.getByTestId("left-score")).toContainText("0");

      // 0-0

      await page.getByTestId("left-button").click();
      await page.getByTestId("right-button").click();
      // 1-1

      await page.getByTestId("left-button").click();
      await page.getByTestId("right-button").click();
      // 2-2

      await page.getByTestId("left-button").click();
      await page.getByTestId("right-button").click();
      // 3-3

      await page.getByTestId("left-button").click();
      await page.getByTestId("left-button").click();

      await expect(page.getByTestId("left-score")).toContainText("5");
      await expect(page.getByTestId("right-score")).toContainText("3");

      await page.getByTestId("left-button").click();
      await page.getByTestId("left-button").click();
      await page.getByTestId("left-button").click();
      await page.getByTestId("left-button").click();
      // 9-3

      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      // 9-5

      await expect(page.getByTestId("left-score")).toContainText("9");
      await expect(page.getByTestId("right-score")).toContainText("5");

      await page.getByTestId("left-button").click();
      await page.getByTestId("left-button").click();
      // 11-5, left, player1 wins

      await expect(page.getByTestId("winner-text")).toContainText("Player 1");
      await expect(page.getByTestId("player1-score")).toContainText("11");
      await expect(page.getByTestId("player2-score")).toContainText("5");
    });

    test("plays a regular game, right (player 2), wins", async ({ page }) => {
      await expect(page.getByTestId("right-score")).toContainText("0");
      await expect(page.getByTestId("left-score")).toContainText("0");
      // 0-0
      await page.getByTestId("left-button").click();
      await page.getByTestId("right-button").click();
      // 1-1
      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      // 1-3
      await page.getByTestId("left-button").click();
      await page.getByTestId("right-button").click();
      // 2-4

      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      await page.getByTestId("left-button").click();
      // 3-7
      await page.getByTestId("right-button").click();
      await page.getByTestId("left-button").click();
      await expect(page.getByTestId("left-score")).toContainText("4");
      await expect(page.getByTestId("right-score")).toContainText("8");
      // 8-4

      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      await page.getByTestId("right-button").click();
      // 11-4
      await expect(page.getByTestId("winner-text")).toContainText("Player 2");
      await expect(page.getByTestId("player1-score")).toContainText("4");
      await expect(page.getByTestId("player2-score")).toContainText("11");
    });
    test.describe("deuce tests", () => {
      // preset deuce
      test.beforeEach(async ({ page }) => {
        //for (let i = 0; i < 10; ++i) {
        //  await page.getByTestId("right-button").click();
        //  await page.getByTestId("left-button").click();
        //}
        await setSideScore(page, "left", 10);
        await setSideScore(page, "right", 10);
      });

      test("correctly handles a deuce in the default configuration", async ({
        page,
      }) => {
        await page.getByTestId("right-button").click();
        await expect(page.getByTestId("right-score")).toContainText("11");
        await expect(page.getByTestId("game-end-screen")).not.toBeVisible();

        await page.getByTestId("right-button").click();
        await expect(page.getByTestId("player2-score")).toContainText("12");
        await expect(page.getByTestId("player1-score")).toContainText("10");

        await expect(page.getByTestId("game-end-screen")).toBeVisible();
      });

      test("handles multiple deuces in the default configuration", async ({
        page,
      }) => {
        await page.getByTestId("right-button").click();
        await page.getByTestId("left-button").click();
        await expect(page.getByTestId("right-score")).toContainText("11");
        await expect(page.getByTestId("left-score")).toContainText("11");
        await expect(page.getByTestId("game-end-screen")).not.toBeVisible();

        await page.getByTestId("right-button").click();
        await expect(page.getByTestId("right-score")).toContainText("12");
        await expect(page.getByTestId("game-end-screen")).not.toBeVisible();

        await page.getByTestId("right-button").click();
        await expect(page.getByTestId("game-end-screen")).toBeVisible();
        await expect(page.getByTestId("player2-score")).toContainText("13");
      });
    });
  });
  test.describe("correction", () => {
    test("can enter correction mode", async ({ page }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      await page.getByTestId("correction-button").click();

      await expect(page.getByTestId("left-correction-button")).toBeVisible();
      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("right-correction-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).not.toBeVisible();
    });

    test("can leave correction mode", async ({ page }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      await page.getByTestId("correction-button").click();

      await expect(page.getByTestId("left-correction-button")).toBeVisible();
      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("right-correction-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).not.toBeVisible();

      await page.getByTestId("end-correction-button").click();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
    });

    test("can correct left score by 1 point and retains the correction", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("left-button").click();
      }

      await page.getByTestId("correction-button").click();
      await page.getByTestId("left-correction-button").click();
      await expect(page.getByTestId("left-score")).toContainText("2");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("left-score")).toContainText("2");
    });

    test("can correct player 2 score by 1 point and retains the correction", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("right-button").click();
      }

      await page.getByTestId("correction-button").click();
      await page.getByTestId("right-correction-button").click();
      await expect(page.getByTestId("right-score")).toContainText("2");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("right-score")).toContainText("2");
    });

    test("can correct player 2 score by more than 1 point and retains the correction", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("right-button").click();
      }

      await page.getByTestId("correction-button").click();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("right-correction-button").click();
      }
      await expect(page.getByTestId("right-score")).toContainText("0");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("right-score")).toContainText("0");
    });

    test("can correct left score by more than 1 point and retains the correction", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 8; ++i) {
        await page.getByTestId("left-button").click();
      }

      await page.getByTestId("correction-button").click();
      for (let i = 0; i < 4; ++i) {
        await page.getByTestId("left-correction-button").click();
      }
      await expect(page.getByTestId("left-score")).toContainText("4");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("left-score")).toContainText("4");
    });
    //
    test("left score cannot be negative", async ({ page }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("left-button").click();
      }

      await page.getByTestId("correction-button").click();
      for (let i = 0; i < 10; ++i) {
        await page.getByTestId("left-correction-button").click();
      }
      await expect(page.getByTestId("left-score")).toContainText("0");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("left-score")).toContainText("0");
    });

    test("right score cannot be negative", async ({ page }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(page.getByTestId("right-button")).toBeVisible();
      for (let i = 0; i < 3; ++i) {
        await page.getByTestId("right-button").click();
      }

      await page.getByTestId("correction-button").click();
      for (let i = 0; i < 10; ++i) {
        await page.getByTestId("right-correction-button").click();
      }
      await expect(page.getByTestId("right-score")).toContainText("0");

      await page.getByTestId("end-correction-button").click();
      await expect(page.getByTestId("right-score")).toContainText("0");
    });
  });

  test.describe("keyboard", () => {
    test("increases the left score with the left arrow, but not the player two score", async ({
      page,
    }) => {
      await expect(page.getByTestId("left-score")).toContainText("0");
      await page.keyboard.press(defaultGameConfig.player1Key);
      await expect(page.getByTestId("left-score")).toContainText("1");
      await expect(page.getByTestId("right-score")).toContainText("0");
    });

    test("increases the player two score with the right arrow", async ({
      page,
    }) => {
      await expect(page.getByTestId("right-score")).toContainText("0");
      await page.keyboard.press(defaultGameConfig.player2Key);
      await expect(page.getByTestId("right-score")).toContainText("1");
      await expect(page.getByTestId("left-score")).toContainText("0");
    });

    test("Enters correction mode with the tab key", async ({ page }) => {
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);
      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("left-correction-button")).toBeVisible();
    });

    test("decreases player 1 score by 1 with the player 1 key in correction mode", async ({
      page,
    }) => {
      for (let i = 0; i < 2; ++i) {
        await page.getByTestId("left-button").click();
      }
      await expect(page.getByTestId("left-score")).toContainText("2");
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("left-correction-button")).toBeVisible();

      await page.keyboard.press("ArrowLeft");
      await expect(page.getByTestId("left-score")).toContainText("1");

      await page.keyboard.press("Tab");
      await expect(page.getByTestId("left-score")).toContainText("1");
    });

    test("decreases player 2 score by 1 with the player 2 key in correction mode", async ({
      page,
    }) => {
      for (let i = 0; i < 2; ++i) {
        await page.getByTestId("right-button").click();
      }
      await expect(page.getByTestId("right-score")).toContainText("2");
      await expect(page.getByTestId("right-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("right-button")).not.toBeVisible();
      await expect(page.getByTestId("right-correction-button")).toBeVisible();

      await page.keyboard.press(defaultGameConfig.player2Key);
      await expect(page.getByTestId("right-score")).toContainText("1");

      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);
      await expect(page.getByTestId("right-score")).toContainText("1");
    });

    test("decreases player 1 score by 3 with the player 1 key in correction mode", async ({
      page,
    }) => {
      // TODO: make side independent and test reversed
      for (let i = 0; i < 5; ++i) {
        await page.getByTestId("left-button").click();
      }
      await expect(page.getByTestId("left-score")).toContainText("5");
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("left-correction-button")).toBeVisible();

      for (let i = 0; i < 3; ++i) {
        await page.keyboard.press(defaultGameConfig.player1Key);
      }

      await expect(page.getByTestId("left-score")).toContainText("2");

      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);
      await expect(page.getByTestId("left-score")).toContainText("2");
    });

    test("decreases player 2 score by more than 4 with the player 2 key", async ({
      page,
    }) => {
      // TODO: make side independent and test reversed
      for (let i = 0; i < 6; ++i) {
        await page.getByTestId("right-button").click();
      }
      await expect(page.getByTestId("right-score")).toContainText("6");
      await expect(page.getByTestId("right-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("right-button")).not.toBeVisible();
      await expect(page.getByTestId("right-correction-button")).toBeVisible();

      for (let i = 0; i < 4; ++i) {
        await page.keyboard.press(defaultGameConfig.player2Key);
      }

      await expect(page.getByTestId("right-score")).toContainText("2");

      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);
      await expect(page.getByTestId("right-score")).toContainText("2");
    });

    test("cannot make left score negative", async ({ page }) => {
      // set score to 1
      await page.getByTestId("left-button").click();

      await expect(page.getByTestId("left-score")).toContainText("1");
      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("left-button")).not.toBeVisible();
      await expect(page.getByTestId("left-correction-button")).toBeVisible();

      for (let i = 0; i < 9; ++i) {
        await page.keyboard.press(defaultGameConfig.player1Key);
      }
      await expect(page.getByTestId("left-score")).toContainText("0");

      await page.keyboard.press("Tab");
      await expect(page.getByTestId("left-score")).toContainText("0");
    });

    test("cannot make right score negative", async ({ page }) => {
      // set score to 1
      await page.getByTestId("right-button").click();

      await expect(page.getByTestId("right-score")).toContainText("1");
      await expect(page.getByTestId("right-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();
      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);

      await expect(page.getByTestId("right-button")).not.toBeVisible();
      await expect(page.getByTestId("right-correction-button")).toBeVisible();

      for (let i = 0; i < 9; ++i) {
        await page.keyboard.press(defaultGameConfig.player2Key);
      }

      await expect(page.getByTestId("right-score")).toContainText("0");

      await page.keyboard.press(defaultGameConfig.scoreCorrectionKey);
      await expect(page.getByTestId("right-score")).toContainText("0");
    });

    [
      "a",
      "s",
      "d",
      "f",
      "Space",
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
    ].forEach((key) => {
      test(`can use any key to advance the game: ${key}`, async ({ page }) => {
        await setSideScore(page, "right", 11);
        await expect(page.getByTestId("player2-score")).toContainText("11");
        await expect(page.getByTestId("winner-text")).toBeVisible();
        await page.keyboard.press(key);
        await expect(page.getByTestId("winner-text")).not.toBeVisible();
        // if switch sides screen shows, it will be gone in 2 seconds
        await expect(page.getByTestId("right-score")).toBeVisible({
          timeout: 2100,
        });
      });
    });

    test("decreases left score by 1 with the player 1 instant correction key", async ({
      page,
    }) => {
      await setSideScore(page, "left", 2);
      await expect(page.getByTestId("left-score")).toContainText("2");

      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();

      await page.keyboard.press(defaultGameConfig.player1CorrectionKey);
      await expect(page.getByTestId("left-score")).toContainText("1");

      await expect(page.getByTestId("left-button")).toBeVisible();
      await expect(
        page.getByTestId("left-correction-button"),
      ).not.toBeVisible();
    });

    test("decreases right score by 1 with the player 1 instant correction key", async ({
      page,
    }) => {
      await setSideScore(page, "right", 2);
      await expect(page.getByTestId("right-score")).toContainText("2");

      await expect(page.getByTestId("right-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();

      await page.keyboard.press(defaultGameConfig.player2CorrectionKey);
      await expect(page.getByTestId("right-score")).toContainText("1");

      await expect(page.getByTestId("right-button")).toBeVisible();
      await expect(
        page.getByTestId("right-correction-button"),
      ).not.toBeVisible();
    });
  });
});
