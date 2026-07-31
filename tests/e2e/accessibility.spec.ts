import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/products",
  "/products/aerobook-pro-14",
  "/cart",
  "/login",
  "/about",
  "/contact",
] as const;

for (const route of publicRoutes) {
  test(`${route} meets the automated WCAG baseline`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target),
      }))
    ).toEqual([]);
  });
}

test("desktop product quick view meets the automated WCAG baseline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products");
  await page
    .getByRole("button", { name: "Quick view AeroBook Pro 14" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "AeroBook Pro 14" })
  ).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(
    violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map((node) => node.target),
    }))
  ).toEqual([]);
});

test("public routes keep their SEO and heading contracts", async ({ page }) => {
  for (const route of publicRoutes) {
    await page.goto(route);

    await expect(page).toHaveTitle(/\S+/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S+/
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main#main-content")).toHaveCount(1);
  }
});

test("key journeys do not overflow a 375px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  for (const route of [
    "/products",
    "/products/aerobook-pro-14",
    "/cart",
    "/login",
    "/contact",
  ]) {
    await page.goto(route);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalOverflow, `${route} has horizontal overflow`).toBe(
      false
    );
  }
});

test("skip navigation is the first keyboard target", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("reduced-motion users receive static product-card effects", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products");

  const card = page.getByRole("article").first();
  const image = card.locator("img");

  await expect(card).toHaveCSS("transition-duration", "0s");
  await expect(image).toHaveCSS("transition-duration", "0s");
});
