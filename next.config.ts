import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['better-sqlite3', 'bcrypt'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Handle better-sqlite3 for server-side only
    if (isServer) {
      config.externals.push('bcrypt');
      config.externals.push('better-sqlite3');
    }

    // Add module resolve fallbacks for edge runtime
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Ignore problematic files from node-pre-gyp and fs modules
    config.module.rules.push(
      {
        test: /node_modules[\\/\\]@mapbox[\\/\\]node-pre-gyp[\\/\\]lib[\\/\\]util[\\/\\]nw-pre-gyp[\\/\\]index\.html$/,
        use: 'ignore-loader'
      },
      {
        test: /node_modules[\\/\\]fs\.realpath/,
        use: 'ignore-loader'
      }
    );

    return config;
  },
};

export default nextConfig;
