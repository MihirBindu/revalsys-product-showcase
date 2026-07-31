import AxeBuilder from "@axe-core/playwright";
import {
  cloneElement,
  createElement,
  isValidElement,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, type Locator, type Page } from "@playwright/test";
import ProductsLoading from "../../src/app/products/loading";
import ProductDetailLoading from "../../src/app/products/[slug]/loading";

const scriptPattern = /\/_next\/static\/chunks\/.*\.js(?:\?.*)?$/;

interface SerializedJsx {
  __pw_type: string;
  key?: string | null;
  props: Record<string, unknown>;
  type: ElementType;
}

function isSerializedJsx(value: unknown): value is SerializedJsx {
  return (
    typeof value === "object" &&
    value !== null &&
    "__pw_type" in value &&
    "type" in value &&
    "props" in value
  );
}

/** Convert Playwright's imported JSX representation back to React elements. */
function materializeJsx(value: unknown): ReactNode {
  if (Array.isArray(value)) {
    return value.flat(Infinity).map((child, index) => {
      const rendered = materializeJsx(child);
      return isValidElement(rendered) && rendered.key === null
        ? cloneElement(rendered, { key: `loading-qa-${index}` })
        : rendered;
    });
  }
  if (!isSerializedJsx(value)) return value as ReactNode;

  if (typeof value.type === "function") {
    const Component = value.type as (
      props: Record<string, unknown>
    ) => unknown;
    const rendered = materializeJsx(Component(value.props));
    return value.key !== null && value.key !== undefined && isValidElement(rendered)
      ? cloneElement(rendered, { key: value.key })
      : rendered;
  }

  const { children, ...props } = value.props;
  const renderedChildren = materializeJsx(children);
  const elementProps = { ...props, key: value.key ?? undefined };
  return Array.isArray(renderedChildren)
    ? createElement(value.type, elementProps, ...renderedChildren)
    : createElement(value.type, elementProps, renderedChildren);
}

function render(Component: ComponentType) {
  const renderComponent = Component as () => unknown;
  return renderToStaticMarkup(materializeJsx(renderComponent()));
}

async function showLoadingView(
  page: Page,
  Component: ComponentType
) {
  await page.route(scriptPattern, (route) => route.abort());
  await page.goto("/about");
  await page.locator("main").evaluate(
    (main, markup) => {
      main.innerHTML = markup;
    },
    render(Component)
  );
}

async function expectLoadingContract(loadingView: Locator) {
  await expect(loadingView).toBeVisible();
  await expect(loadingView).toHaveAttribute("aria-busy", "true");
  await expect(loadingView.locator('[role="status"]')).toHaveCount(1);
  await expect(loadingView.locator("[data-skeleton]")).not.toHaveCount(0);
  await expect(
    loadingView.locator('[data-skeleton]:not([aria-hidden="true"])')
  ).toHaveCount(0);
  await expect(
    loadingView.locator(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
  ).toHaveCount(0);
}

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    overflowingElements: Array.from(document.querySelectorAll<HTMLElement>("*"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          className: element.className,
          right: Math.round(rect.right),
          tagName: element.tagName,
        };
      })
      .filter(({ right }) => right > window.innerWidth + 1)
      .slice(0, 5),
  }));

  expect(metrics.documentWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(
    metrics.viewportWidth
  );
}

async function roundedBox(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return {
    height: Math.round(box!.height),
    width: Math.round(box!.width),
    x: Math.round(box!.x),
    y: Math.round(box!.y),
  };
}

function expectDimensionsWithin(
  actual: { height: number; width: number },
  expected: { height: number; width: number },
  tolerance = 2
) {
  expect(Math.abs(actual.height - expected.height)).toBeLessThanOrEqual(
    tolerance
  );
  expect(Math.abs(actual.width - expected.width)).toBeLessThanOrEqual(
    tolerance
  );
}

async function expectNoWcagViolations(page: Page) {
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
}

test("listing skeleton mirrors desktop controls and product-card geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await showLoadingView(page, ProductsLoading);

  const loading = page.locator('[data-loading-view="products"]');
  await expectLoadingContract(loading);
  await expect(loading.locator("[data-loading-desktop-controls]"))
    .toBeVisible();
  await expect(loading.locator("[data-loading-mobile-controls]")).toBeHidden();
  await expect(loading.locator("[data-loading-search]")).toHaveCSS(
    "height",
    "38px"
  );
  await expect(loading.locator("[data-loading-desktop-sort]")).toHaveCSS(
    "height",
    "38px"
  );
  await expect(loading.locator("[data-loading-category]")).toHaveCount(7);
  await expect(loading.locator("[data-loading-category]").first()).toHaveCSS(
    "height",
    "32px"
  );
  await expect(loading.locator("[data-product-card-skeleton]")).toHaveCount(8);

  const skeletonCardBox = await roundedBox(
    loading.locator("[data-product-card-skeleton]").first()
  );
  await expectNoHorizontalOverflow(page);
  await expectNoWcagViolations(page);

  await page.unroute(scriptPattern);
  await page.goto("/products");

  const productCardBox = await roundedBox(page.getByRole("article").first());
  expectDimensionsWithin(productCardBox, skeletonCardBox);
});

test("listing skeleton preserves the mobile controls and two-column grid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await showLoadingView(page, ProductsLoading);

  const loading = page.locator('[data-loading-view="products"]');
  await expectLoadingContract(loading);
  await expect(loading.locator("[data-loading-mobile-controls]")).toBeVisible();
  await expect(loading.locator("[data-loading-desktop-controls]")).toBeHidden();
  await expect(loading.locator("[data-loading-filter-toggle]")).toBeVisible();
  await expect(loading.locator("[data-loading-mobile-sort]")).toBeVisible();

  const cards = loading.locator("[data-product-card-skeleton]");
  const firstCard = await roundedBox(cards.nth(0));
  const secondCard = await roundedBox(cards.nth(1));
  expect(secondCard.y).toBe(firstCard.y);
  expect(secondCard.x).toBeGreaterThan(firstCard.x);
  await expectNoHorizontalOverflow(page);

  await page.unroute(scriptPattern);
  await page.goto("/products");
});

for (const viewport of [
  { width: 1024, height: 600 },
  { width: 1280, height: 720 },
] as const) {
  test(`product-detail skeleton keeps image geometry at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await showLoadingView(page, ProductDetailLoading);

    const loading = page.locator('[data-loading-view="product-detail"]');
    await expectLoadingContract(loading);
    await expect(loading.locator("[data-loading-add-to-cart] [data-skeleton]")).toHaveCount(2);
    await expect(loading.locator("[data-loading-specification-row]")).toHaveCount(6);

    const skeletonImageBox = await roundedBox(
      loading.locator("[data-loading-detail-image]")
    );
    await expectNoHorizontalOverflow(page);
    if (viewport.width === 1280) await expectNoWcagViolations(page);

    await page.unroute(scriptPattern);
    await page.goto("/products/aerobook-pro-14");

    const productImageBox = await roundedBox(
      page.getByRole("main").getByRole("img", { name: "AeroBook Pro 14" })
    );
    expectDimensionsWithin(productImageBox, skeletonImageBox);
    expect(Math.abs(productImageBox.x - skeletonImageBox.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(productImageBox.y - skeletonImageBox.y)).toBeLessThanOrEqual(2);
  });
}

test("cart skeleton is motion-safe, accessible, and geometrically stable", async ({
  page,
}) => {
  await page.route(scriptPattern, (route) => route.abort());
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/cart");

  const loading = page.locator('[data-loading-view="cart"]');
  await expectLoadingContract(loading);
  await expect(loading.locator("[data-loading-cart-row]")).toHaveCount(2);
  await expect(loading.locator("[data-loading-continue-shopping]")).toBeVisible();

  const shimmer = loading.locator("[data-skeleton]").first();
  const normalMotion = await shimmer.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return { animationName: style.animationName, display: style.display };
  });
  expect(normalMotion.animationName).toBe("skeleton-shimmer");
  expect(normalMotion.display).not.toBe("none");

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await shimmer.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return { animationName: style.animationName, display: style.display };
  });
  expect(reducedMotion.animationName).toBe("none");
  expect(reducedMotion.display).toBe("none");

  const skeletonListBox = await roundedBox(
    loading.locator("[data-loading-cart-list]")
  );
  await expectNoWcagViolations(page);

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 1024, height: 600 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await expectNoHorizontalOverflow(page);
  }

  await page.evaluate(() => {
    localStorage.setItem(
      "cart-storage",
      JSON.stringify({
        state: {
          lines: [
            { productId: "p01", quantity: 1 },
            { productId: "p02", quantity: 1 },
          ],
        },
        version: 1,
      })
    );
  });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.unroute(scriptPattern);
  await page.reload();

  const cartList = page.getByRole("main").getByRole("list");
  await expect(cartList).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue shopping" })).toBeVisible();
  const cartListBox = await roundedBox(cartList);
  expectDimensionsWithin(cartListBox, skeletonListBox);
});
