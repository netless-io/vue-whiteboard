const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
  },
  externals: {
    "white-web-sdk": "white-web-sdk",
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
  },

  modules: {
    rules: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessorOptions: {
            safe: true,
            autoprefixer: { disable: true },
            mergeLonghand: false,
            discardComments: {
              removeAll: true,
            },
          },
          canPrint: true,
        }),
      ],
    },
  },
};
