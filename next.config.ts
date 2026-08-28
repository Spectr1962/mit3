import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  additionalPrecacheEntries: [{ url: "/~offline", revision: "1.0.0" }],
});

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
};

export default withSerwist(nextConfig);
