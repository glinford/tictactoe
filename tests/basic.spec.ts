import { test, expect } from "@playwright/test";

test("Title is present", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Tic Tac Toe/);
});

test("Settings are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Game Mode")).toBeVisible();
    await expect(page.getByTestId("game")).toBeVisible();
    await expect(page.getByText("Victory Mode")).toBeVisible();
    await expect(page.getByTestId("victory")).toBeVisible();
    await expect(page.getByText("Opponent")).toBeVisible();
    await expect(page.getByTestId("opponent")).toBeVisible();
    await expect(page.getByText("Level")).not.toBeVisible();
    await expect(page.getByTestId("level")).not.toBeVisible();

    await expect(page.locator("#play")).toBeVisible();
});

test("Settings gets highlighted when selected", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("game").click();
    await expect(page.getByTestId("game").locator(".button-section.selected")).toContainText("Wild");
});

test("Settings expends when opponent is Computer", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("opponent").click();
    await expect(page.getByText("Level")).toBeVisible();
    await expect(page.getByTestId("level")).toBeVisible();
});

test("Play show the board", async ({ page }) => {
    await page.goto("/");
    await page.locator("#play").click();
    await expect(page.getByTestId("board")).toBeVisible();
});

test("Play in wild mode show choice button", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("game").click();
    await page.locator("#play").click();
    await expect(page.getByTestId("board")).toBeVisible();
    await expect(page.getByTestId("choice")).toBeVisible();
});
