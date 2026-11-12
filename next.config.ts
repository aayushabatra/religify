import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local SVG placeholders use `unoptimized` on Image components.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
