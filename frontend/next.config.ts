import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
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