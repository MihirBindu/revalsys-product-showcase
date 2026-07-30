import type { MetadataRoute } from "next";

const siteUrl = "https://nexusgadgets.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
