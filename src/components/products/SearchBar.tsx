"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { PRODUCT_QUERY } from "@/lib/productQuery";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const { updateParams } = useFilterNavigation();
  const queryFromUrl = searchParams.get(PRODUCT_QUERY.search) ?? "";

  const [value, setValue] = useState(queryFromUrl);
  const [syncedQuery, setSyncedQuery] = useState(queryFromUrl);

  // Adopt the URL's query whenever it changes from outside this input, so
  // back/forward navigation and filter resets don't leave a stale search term
  // displayed next to unfiltered results. Adjusting state during render (rather
  // than in an effect) avoids rendering the stale value for a frame first.
  if (queryFromUrl !== syncedQuery) {
    setSyncedQuery(queryFromUrl);
    setValue(queryFromUrl);
  }

  useEffect(() => {
    // Already in sync — nothing to push. This also keeps mounting the page
    // from issuing a redundant navigation.
    if (value === queryFromUrl) return;

    const handle = setTimeout(() => {
      updateParams((params) => {
        if (value) {
          params.set(PRODUCT_QUERY.search, value);
        } else {
          params.delete(PRODUCT_QUERY.search);
        }
      });
    }, 300);

    return () => clearTimeout(handle);
    // Only `q` is touched here. Any filter the user changes mid-debounce is
    // preserved because the provider composes this onto the latest requested
    // params rather than onto a URL that may not have caught up yet.
  }, [value, queryFromUrl, updateParams]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products, brands..."
      aria-label="Search products"
    />
  );
}
