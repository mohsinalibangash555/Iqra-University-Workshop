import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
// Static export: the whole wall is known at build time, so it deploys the same
// to GitHub Pages or Vercel. For Pages set DEPLOY_TARGET=pages (the workflow does).
const isPages = process.env.DEPLOY_TARGET === "pages";
const repo = "Iqra-University-Workshop";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
  webpack: (config) => {
    // One copy of d3-selection, so d3-transition patches the selection Mermaid uses.
    config.resolve.alias = {
      ...config.resolve.alias,
      "d3-selection": require.resolve("d3-selection"),
      "d3-transition": require.resolve("d3-transition"),
    };
    return config;
  },
};

export default nextConfig;
