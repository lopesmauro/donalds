import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      hostname: "u9a6wmr3as.ufs.sh"
    }]
  }
};

export default nextConfig;
