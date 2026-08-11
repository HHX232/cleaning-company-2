import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Site images are few, already-sized webp served from S3 — skip Next's
  // in-process image optimizer (sharp) so it never resizes images in the
  // Node process memory on a tiny box.
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
