import { expect, test } from "@playwright/test";

test.describe("with a German-preferring browser", () => {
  test.use({ locale: "de-DE" });

  test("root negotiates to /de and renders the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "willkommen",
    );
  });
});

test("each locale renders its own hero", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Welcome to our bistro",
  );

  await page.goto("/it");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Benvenuti",
  );
});

test("section routes render (menu)", async ({ page }) => {
  await page.goto("/de/menu");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Speisekarte",
  );
});

test("language switcher changes locale and preserves the page", async ({
  page,
}) => {
  await page.goto("/de/menu");
  await page.getByTestId("language-switcher").first().click();
  await page.getByRole("menuitem", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/menu$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Our Menu",
  );
});

test("admin is gated: anonymous users are sent to the localized login", async ({
  page,
}) => {
  await page.goto("/de/admin");
  await expect(page).toHaveURL(/\/de\/login/);
  await expect(page.getByLabel("E-Mail")).toBeVisible();
});

test("cookie banner can be accepted", async ({ page }) => {
  await page.goto("/de");
  const accept = page.getByRole("button", { name: "Alle akzeptieren" });
  await expect(accept).toBeVisible();
  await accept.click();
  await expect(accept).toBeHidden();
});
