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
    "Welcome to Das Schnucken",
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

test("home shows the Get to Know Us section", async ({ page }) => {
  await page.goto("/de");
  const about = page.locator("#about");
  await expect(
    about.getByRole("heading", { name: "Schön, dass ihr da seid" }),
  ).toBeVisible();
  await expect(about).toContainText("David, Till");
});

test("header 'Über uns' opens the home about section", async ({ page }) => {
  await page.goto("/de/menu");
  await page
    .locator("header")
    .getByRole("link", { name: "Über uns" })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(
    page.locator("#about").getByRole("heading", {
      name: "Schön, dass ihr da seid",
    }),
  ).toBeVisible();
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

test("cookie consent banner appears on first visit and can be accepted", async ({
  page,
}) => {
  await page.goto("/de");
  const banner = page.getByTestId("consent-banner-root");
  await expect(banner).toBeVisible();
  await page.getByTestId("consent-banner-accept-button").click();
  await expect(banner).toBeHidden();
});
