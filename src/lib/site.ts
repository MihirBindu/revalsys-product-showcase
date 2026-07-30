/**
 * Single source of truth for the site's public origin.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment (e.g. Vercel project
 * settings) so metadata, canonical URLs, sitemap and robots all point at the
 * real domain without a code change.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusgadgets.example.com";

/** Builds an absolute URL for structured data, which requires absolute URLs. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
