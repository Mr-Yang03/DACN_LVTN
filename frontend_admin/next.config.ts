import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "camera.thongtingiaothong.vn",
        port: "",
        pathname: "/api/snapshot/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["storage.googleapis.com"],
  },
};

export default nextConfig;
