import { expect, test, type Page } from "@playwright/test";

function getProductCard(page: Page, productName: string) {
  return page.getByRole("article").filter({ hasText: productName });
}

async function openQuickView(page: Page, productName: string) {
  const card = getProductCard(page, productName);
  const trigger = card.getByRole("button", {
    name: `Quick view ${productName}`,
  });
  await trigger.focus();
  await trigger.press("Enter");

  const dialog = page.getByRole("dialog", { name: productName });
  await expect(dialog).toBeVisible();
  return { card, dialog, trigger };
}

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

test("uses one discoverable, focus-contained desktop quick view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products");

  const card = getProductCard(page, "AeroBook Pro 14");
  const quickView = card.getByRole("button", {
    name: "Quick view AeroBook Pro 14",
  });
  const gradient = card.locator("[data-quick-view-gradient]");
  const headerBefore = await page.getByRole("banner").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: Math.round(rect.left), width: Math.round(rect.width) };
  });

  await expect(page.locator("[data-quick-view-dialog]")).toHaveCount(0);
  await expect(quickView).toHaveCSS("opacity", "0");
  await expect(quickView).toHaveCSS("pointer-events", "none");
  await expect(gradient).toHaveCSS("opacity", "0");
  await card.hover();
  await expect(quickView).toHaveCSS("opacity", "1");
  await expect(quickView).toHaveCSS("pointer-events", "auto");
  await expect(gradient).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await quickView.focus();
  await expect(quickView).toHaveCSS("opacity", "1");
  await expect(quickView).toHaveCSS("pointer-events", "auto");
  await quickView.press("Enter");

  const dialog = page.getByRole("dialog", { name: "AeroBook Pro 14" });
  const closeButton = dialog.getByRole("button", {
    name: "Close quick view for AeroBook Pro 14",
  });
  const detailsLink = dialog.getByRole("link", {
    name: "View full details",
  });

  await expect(dialog).toBeVisible();
  await expect(page.locator("[data-quick-view-dialog]")).toHaveCount(1);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const headerAfter = await page.getByRole("banner").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: Math.round(rect.left), width: Math.round(rect.width) };
  });
  expect(headerAfter).toEqual(headerBefore);
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
  const targetHeights = await dialog
    .locator('button:not([disabled]), a[href]')
    .evaluateAll((elements) =>
      elements.map((element) =>
        Math.round(element.getBoundingClientRect().height)
      )
    );
  expect(targetHeights.every((height) => height >= 40)).toBe(true);
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(detailsLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(quickView).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await quickView.press("Enter");
  await closeButton.click();
  await expect(dialog).toBeHidden();
  await expect(quickView).toBeFocused();

  await quickView.press("Enter");
  const dialogBox = await dialog.boundingBox();
  expect(dialogBox).not.toBeNull();
  await page.mouse.click(
    Math.max(1, Math.round(dialogBox!.x - 20)),
    Math.max(1, Math.round(dialogBox!.y - 20))
  );
  await expect(dialog).toBeHidden();
  await expect(quickView).toBeFocused();

  await quickView.press("Enter");
  await page.setViewportSize({ width: 1023, height: 720 });
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(quickView).toBeHidden();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/products");

  const mobileCard = getProductCard(page, "AeroBook Pro 14");
  await expect(
    mobileCard.locator('button[aria-label="Quick view AeroBook Pro 14"]')
  ).toBeHidden();
  await expect(
    mobileCard.locator("[data-add-to-cart-button]")
  ).toBeVisible();
});

test("keeps quick view readable at required desktop sizes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products");

  const { dialog } = await openQuickView(page, "Lumaxis X Mirrorless");
  const imagePanel = dialog.locator("[data-quick-view-image]");
  const detailsPanel = dialog.locator("[data-quick-view-details]");

  await expect(dialog.getByText("₹2,29,999", { exact: true })).toBeVisible();
  await expect(dialog).toHaveCSS("overflow", "hidden");
  await expect(detailsPanel).toHaveCSS("overflow-y", "auto");

  const desktopMetrics = await dialog.evaluate((element) => {
    const dialogRect = element.getBoundingClientRect();
    const imageRect = element
      .querySelector<HTMLElement>("[data-quick-view-image]")!
      .getBoundingClientRect();
    return {
      height: Math.round(dialogRect.height),
      imageRatio: imageRect.width / dialogRect.width,
      width: Math.round(dialogRect.width),
    };
  });
  expect(desktopMetrics.width).toBeLessThanOrEqual(896);
  expect(desktopMetrics.height).toBeLessThanOrEqual(672);
  expect(desktopMetrics.imageRatio).toBeGreaterThan(0.44);
  expect(desktopMetrics.imageRatio).toBeLessThan(0.46);
  await expect(imagePanel).toBeVisible();
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 1024, height: 600 });
  await page.goto("/products");
  const shortViewport = await openQuickView(page, "GridCharge 100W GaN");
  const shortDialog = shortViewport.dialog;
  const shortDetails = shortDialog.locator("[data-quick-view-details]");
  const closeButton = shortDialog.getByRole("button", {
    name: "Close quick view for GridCharge 100W GaN",
  });

  await expect(
    shortDialog.getByText("100W max (65W + 20W + USB-A)", { exact: true })
  ).toBeVisible();
  const shortMetrics = await shortDialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { height: Math.round(rect.height), width: Math.round(rect.width) };
  });
  expect(shortMetrics.width).toBeLessThanOrEqual(896);
  expect(shortMetrics.height).toBeLessThanOrEqual(552);

  const closeTopBefore = Math.round((await closeButton.boundingBox())!.y);
  await shortDetails.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const closeTopAfter = Math.round((await closeButton.boundingBox())!.y);
  expect(closeTopAfter).toBe(closeTopBefore);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasOverflow).toBe(false);

  await page.keyboard.press("Escape");
  const longName = await openQuickView(page, "GlidePoint Wireless Mouse");
  const headingFits = await longName.dialog
    .getByRole("heading", { name: "GlidePoint Wireless Mouse" })
    .evaluate((element) => element.scrollWidth <= element.clientWidth);
  expect(headingFits).toBe(true);
});

test("handles unavailable products and rapid Quick View additions safely", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/products");

  const unavailable = await openQuickView(page, "BoomCube Mini Speaker");
  await expect(
    unavailable.dialog.locator("span").filter({ hasText: "Out of stock" })
  ).toBeVisible();
  await expect(
    unavailable.dialog.getByRole("button", {
      name: "Increase quantity of BoomCube Mini Speaker",
    })
  ).toHaveCount(0);
  await expect(
    unavailable.dialog.locator("[data-add-to-cart-button]")
  ).toBeDisabled();
  await unavailable.dialog
    .getByRole("link", { name: "View full details" })
    .click();
  await expect(page).toHaveURL("/products/boomcube-mini-speaker");

  await page.goto("/products");
  const available = await openQuickView(page, "AeroBook Pro 14");
  const increase = available.dialog.getByRole("button", {
    name: "Increase quantity of AeroBook Pro 14",
  });
  await increase.click();
  await increase.click();
  await available.dialog.locator("[data-add-to-cart-button]").evaluate(
    (button) => {
      const addButton = button as HTMLButtonElement;
      addButton.click();
      addButton.click();
    }
  );

  await expect(available.dialog).toBeHidden();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "3 × AeroBook Pro 14 added to your cart." })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();
  await page
    .getByRole("status")
    .getByRole("button", { name: "Undo" })
    .click();
  await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
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
