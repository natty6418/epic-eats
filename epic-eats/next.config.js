const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Externalize all MongoDB-related packages for client-side
      config.externals.push(
        '@mongodb-js/zstd',
        'kerberos',
        'mongodb-client-encryption',
        'snappy',
        'socks',
        'aws4',
        'mongodb',
        'mongoose'
      );
    }

    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader'
    });

    // Ignore problematic dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'encoding': false,
      'ignore-loader': false,
      'fs': false,
      'net': false,
      'tls': false,
      'crypto': false,
    };

    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   "sharp$": false,
    //   "onnxruntime-node$": false,
    // };

        // Ignore specific modules that cause issues
        config.plugins.push(
          new webpack.IgnorePlugin({
            resourceRegExp: /^(kerberos|@mongodb-js\/zstd|mongodb-client-encryption|snappy|socks|aws4)$/,
          })
        );

    // Additional ignore patterns for problematic modules
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/snappy\.(.*)\.node$/,
      })
    );

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@napi-rs\/snappy-(.*)$/,
      })
    );

    return config;
  }
}

module.exports = nextConfig
