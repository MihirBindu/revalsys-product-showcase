/**
 * Single source of truth for the site's public origin, resolved in order:
 *
 * 1. NEXT_PUBLIC_SITE_URL — explicit override, e.g. a custom domain.
 * 2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time, so a
 *    Vercel deployment gets correct canonical/sitemap URLs with zero config.
 * 3. A local placeholder for development.
 *
 * Only imported by server components, so the non-public Vercel variable is
 * safe to read here.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return "https://nexusgadgets.example.com";
}

export const siteUrl = resolveSiteUrl();

/** Builds an absolute URL for structured data, which requires absolute URLs. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
