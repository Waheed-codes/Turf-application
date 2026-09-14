import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep this application independent of the parent application's lockfile.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
