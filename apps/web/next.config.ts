import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-Style-URLs (/quiz/index.html): portabel auf jedem statischen
  // Host inkl. simplem `python3 -m http.server` (E2E-Setup).
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["@wahlen/schemas", "@wahlen/engine"],
};

export default nextConfig;

