import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    // Removed experimental features temporarily
    webpack: (config, { isServer }) => {
        // Add polling for development
        if (process.env.NODE_ENV === 'development') {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
                ignored: /node_modules/,
            }
        }
        return config
    },
};

export default nextConfig;