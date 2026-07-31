import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProductsLoading from "../../src/app/products/loading";
import ProductDetailLoading from "../../src/app/products/[slug]/loading";
import CartViewSkeleton from "../../src/components/cart/CartViewSkeleton";
import ProductCardSkeleton from "../../src/components/products/ProductCardSkeleton";

function render(Component: ComponentType) {
  return renderToStaticMarkup(createElement(Component));
}

function count(markup: string, token: string) {
  return markup.split(token).length - 1;
}

const loadingViews = [
  ["product listing", ProductsLoading],
  ["product detail", ProductDetailLoading],
  ["cart", CartViewSkeleton],
] as const;

describe("loading skeleton accessibility", () => {
  it.each(loadingViews)(
    "%s exposes one status while hiding every placeholder",
    (_, Component) => {
      const markup = render(Component);
      const skeletonTags =
        markup.match(/<div[^>]*data-skeleton="true"[^>]*>/g) ?? [];

      expect(markup).toContain('aria-busy="true"');
      expect(count(markup, 'role="status"')).toBe(1);
      expect(skeletonTags.length).toBeGreaterThan(0);
      expect(
        skeletonTags.every((tag) => tag.includes('aria-hidden="true"'))
      ).toBe(true);
      expect(markup).not.toMatch(/<(?:a|button|input|select|textarea)\b/);
    }
  );

  it("uses the shared CSS-only shimmer primitive", () => {
    const markup = render(ProductCardSkeleton);

    expect(markup).toContain("skeleton-shimmer");
    expect(markup).not.toContain("animate-pulse");
  });
});

describe("loading skeleton structure", () => {
  it("mirrors listing controls at mobile and desktop breakpoints", () => {
    const markup = render(ProductsLoading);

    expect(markup).toMatch(
      /data-loading-mobile-controls="true"[^>]*class="[^"]*lg:hidden/
    );
    expect(markup).toMatch(
      /data-loading-desktop-controls="true"[^>]*class="[^"]*hidden[^"]*lg:flex/
    );
    expect(markup).toContain('data-loading-active-filters="true"');
    expect(count(markup, "h-[38px]")).toBe(5);
    expect(count(markup, 'data-product-card-skeleton="true"')).toBe(8);
  });

  it("mirrors product-card controls and wrapping", () => {
    const markup = render(ProductCardSkeleton);

    expect(markup).toContain("flex-wrap items-center justify-between");
    expect(markup).toContain("h-6 w-20");
    expect(markup).toContain("h-8 w-20 rounded-lg");
  });

  it("mirrors product-detail purchase and specification structures", () => {
    const markup = render(ProductDetailLoading);

    expect(markup).toContain('data-loading-detail-image="true"');
    expect(markup).toContain('data-loading-add-to-cart="true"');
    expect(markup).toContain("h-8 w-28 rounded-lg");
    expect(markup).toContain("h-12 w-36 rounded-lg");
    expect(count(markup, 'data-loading-specification-row="true"')).toBe(6);
  });

  it("mirrors cart rows and reserves the continue-shopping area", () => {
    const markup = render(CartViewSkeleton);

    expect(count(markup, 'data-loading-cart-row="true"')).toBe(2);
    expect(markup).toContain('data-loading-continue-shopping="true"');
    expect(markup).toContain("lg:grid-cols-[1fr_320px]");
  });
});
