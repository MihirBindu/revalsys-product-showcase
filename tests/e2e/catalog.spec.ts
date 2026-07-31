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

test("adds a selected quantity and removes the line at zero", async ({ page }) => {
  await page.goto("/products/aerobook-pro-14");
  const increase = page.getByRole("button", {
    name: "Increase quantity of AeroBook Pro 14",
  });

  await increase.click();
  await increase.click();
  await page.getByRole("button", { name: "Add to cart" }).first().click();
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

test("validates the contact form and focuses the first error", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email address.")).toBeVisible();
  await expect(page.getByText("Please enter a message.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
});
