import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        optimizeCss: true,
        workerThreads: true,
    },
};


export default nextConfig;
