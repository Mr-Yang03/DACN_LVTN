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
    ],
  },
};

export default nextConfig;
