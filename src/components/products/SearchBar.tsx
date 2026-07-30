"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";

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
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(handle);
    // `searchParams` is a dependency on purpose: if another control (a category
    // or brand filter) changes the URL mid-debounce, this re-reads the updated
    // params so the pending push preserves that change instead of reverting it.
  }, [value, queryFromUrl, searchParams, pathname, router]);

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
