const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const withSourceMaps = require("@zeit/next-source-maps");
const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || "development";
const dotEnvFile = path.resolve(process.cwd(), `.env.${env}`);
const dotEnvConfig = dotenv.config({ path: dotEnvFile });

if (dotEnvConfig.error) {
  throw dotEnvConfig.error;
}

const plugins = [
  withSourceMaps,
  withImages,
  [
    withBundleAnalyzer,
    {
      analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: "static",
          reportFilename: "../server-analyze.html",
        },
        browser: {
          analyzerMode: "static",
          reportFilename: "client-analyze.html",
        },
      },
    },
  ],
];

module.exports = withPlugins([...plugins], {
  webpack: (config, { dev, isServer }) => {
    const conf = config;
    // Fixes npm packages that depend on `fs` module
    conf.node = {
      fs: "empty",
    };

    // Pass environment variables from .env.development or .env.production to the application
    const envVars = Object.keys(process.env).reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {});

    conf.plugins.push(
      new webpack.EnvironmentPlugin({
        ...envVars,
        NODE_ENV: process.env.NODE_ENV || "development",
        DEBUG: process.env.DEBUG || false,
      })
    );

    return conf;
  },
});
