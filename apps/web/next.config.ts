import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@wahlen/schemas", "@wahlen/engine"],
};

export default nextConfig;
