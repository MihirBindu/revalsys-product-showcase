import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local, self-authored placeholder SVGs only (no remote/user-uploaded SVGs).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
