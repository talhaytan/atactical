import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.1.134", "192.168.1.134:3000", "localhost:3000"],
};

export default nextConfig;

