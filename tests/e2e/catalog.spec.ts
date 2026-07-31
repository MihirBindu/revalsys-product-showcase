import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("e2e-storage-initialized")) {
      localStorage.clear();
      sessionStorage.setItem("e2e-storage-initialized", "true");
    }
  });
});

test("keeps a rapid search and category change in the URL", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("searchbox", { name: "Search products" }).fill("watch");
  await page.getByRole("button", { name: "Wearables" }).click();

  await expect(page).toHaveURL(/q=watch/);
  await expect(page).toHaveURL(/category=Wearables/);
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("back navigation synchronizes the search input", async ({ page }) => {
  await page.goto("/products");
  const search = page.getByRole("searchbox", { name: "Search products" });

  await search.fill("camera");
  await expect(page).toHaveURL(/q=camera/);
  await page.goBack();

  await expect(search).toHaveValue("");
  await expect(page.getByRole("article")).toHaveCount(18);
});

test("keeps catalog controls sticky only on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products?inStock=1");

  const controls = page.getByRole("complementary", {
    name: "Catalog controls",
  });
  await expect(controls).toHaveCSS("position", "sticky");
  await expect(controls).toHaveCSS("top", "80px");
  await expect(
    controls.getByRole("searchbox", { name: "Search products" })
  ).toBeVisible();
  await expect(
    controls.getByRole("heading", { name: "Category" })
  ).toBeVisible();
  await expect(
    controls.getByRole("combobox", { name: "Sort products" })
  ).toBeVisible();
  await expect(
    controls.getByRole("button", { name: "Clear all" })
  ).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 400));
  await expect
    .poll(async () =>
      Math.round(
        await controls.evaluate(
          (element) => element.getBoundingClientRect().top
        )
      )
    )
    .toBe(80);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/products?inStock=1");

  await expect(controls).toHaveCSS("position", "static");
  await expect(
    controls.locator('select[aria-label="Sort products"]')
  ).toBeHidden();
  await expect(
    page.getByRole("button", { name: /Filters/ })
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Sort products" })
  ).toBeVisible();
});

test("offers an accessible desktop quick view without changing mobile cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products");

  const card = page
    .getByRole("article")
    .filter({ hasText: "AeroBook Pro 14" });
  const quickView = card.getByRole("button", {
    name: "Quick view AeroBook Pro 14",
  });

  await expect(quickView).toHaveCSS("opacity", "0");
  await card.hover();
  await expect(quickView).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await quickView.focus();
  await expect(quickView).toHaveCSS("opacity", "1");
  await quickView.press("Enter");

  const dialog = page.getByRole("dialog", { name: "AeroBook Pro 14" });
  const closeButton = dialog.getByRole("button", {
    name: "Close quick view for AeroBook Pro 14",
  });
  const detailsLink = dialog.getByRole("link", {
    name: "View full details",
  });

  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("img", { name: "AeroBook Pro 14" })
  ).toBeVisible();
  await expect(dialog.getByText("₹1,19,999", { exact: true })).toBeVisible();
  await expect(dialog.getByText("In stock", { exact: true })).toBeVisible();
  await expect(dialog.locator("dl > div")).toHaveCount(3);
  await expect(detailsLink).toHaveAttribute(
    "href",
    "/products/aerobook-pro-14"
  );
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(detailsLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(quickView).toBeFocused();

  await quickView.press("Enter");
  const increase = dialog.getByRole("button", {
    name: "Increase quantity of AeroBook Pro 14",
  });
  await increase.click();
  await increase.click();
  await dialog.locator("[data-add-to-cart-button]").click();

  await expect(dialog).toBeHidden();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "3 × AeroBook Pro 14 added to your cart." })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/products");

  const mobileCard = page
    .getByRole("article")
    .filter({ hasText: "AeroBook Pro 14" });
  await expect(
    mobileCard.locator('button[aria-label="Quick view AeroBook Pro 14"]')
  ).toBeHidden();
  await expect(
    mobileCard.locator("[data-add-to-cart-button]")
  ).toBeVisible();
});

test("keeps every product-card action compact and equal-sized", async ({
  page,
}) => {
  await page.setViewportSize({ width: 660, height: 800 });
  await page.goto("/products");

  const buttons = page
    .getByRole("article")
    .getByRole("button", { name: /Add to cart|Out of stock/ });
  await expect(buttons).toHaveCount(18);

  const measurements = await buttons.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        height: Math.round(rect.height),
        whiteSpace: getComputedStyle(element).whiteSpace,
        width: Math.round(rect.width),
      };
    })
  );

  expect([...new Set(measurements.map(({ width }) => width))]).toEqual([80]);
  expect([...new Set(measurements.map(({ height }) => height))]).toEqual([32]);
  expect([...new Set(measurements.map(({ whiteSpace }) => whiteSpace))]).toEqual(
    ["nowrap"]
  );
});

test("offers View cart and exact Undo after adding a product", async ({
  page,
}) => {
  await page.goto("/products");
  const card = page
    .getByRole("article")
    .filter({ hasText: "AeroBook Pro 14" });
  const addButton = card.locator("[data-add-to-cart-button]");

  await addButton.click();
  await addButton.click();

  const toast = page
    .getByRole("status")
    .filter({ hasText: "AeroBook Pro 14 added to your cart." });
  await expect(toast).toBeVisible();
  await expect(
    toast.getByRole("link", { name: "View cart" })
  ).toHaveAttribute("href", "/cart");
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();

  await toast.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();

  await addButton.click();
  await page
    .getByRole("status")
    .filter({ hasText: "AeroBook Pro 14 added to your cart." })
    .getByRole("link", { name: "View cart" })
    .click();

  await expect(page).toHaveURL("/cart");
  await expect(
    page.getByRole("button", {
      name: "Decrease quantity of AeroBook Pro 14",
    })
  ).toBeVisible();
});

test("adds a selected quantity and removes the line at zero", async ({ page }) => {
  await page.goto("/products/aerobook-pro-14");
  const increase = page.getByRole("button", {
    name: "Increase quantity of AeroBook Pro 14",
  });

  await increase.click();
  await increase.click();
  const addToCart = page.getByRole("button", { name: "Add to cart" }).first();
  await expect(addToCart).toHaveCSS("cursor", "pointer");
  await addToCart.click();
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();

  await page.goto("/cart");
  const decrease = page.getByRole("button", {
    name: "Decrease quantity of AeroBook Pro 14",
  });
  await decrease.click();
  await decrease.click();
  await decrease.click();

  await expect(page.getByText("Your cart is empty")).toBeVisible();
});

test("shows a dismissible toast after placing an order", async ({ page }) => {
  await page.goto("/products/aerobook-pro-14");
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await page.goto("/cart");
  await page.getByRole("button", { name: "Checkout (Demo)" }).click();

  const toast = page.getByRole("status");
  await expect(toast).toContainText("Order placed successfully (demo).");
  await expect(page.getByText("Order placed (demo)")).toBeVisible();

  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toast).toBeHidden();
});

test("validates the contact form and focuses the first error", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email address.")).toBeVisible();
  await expect(page.getByText("Please enter a message.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
});
