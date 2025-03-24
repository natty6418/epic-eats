/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: true,
      },
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.externals.push('@mongodb-js/zstd');
        }
    
        config.module.rules.push({
          test: /\.node$/,
          use: 'ignore-loader'
        });
    
        return config;
      }
}

module.exports = nextConfig
