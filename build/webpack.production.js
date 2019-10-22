const path = require("path");
const merge = require("webpack-merge");
const common = Object.assign({}, require("./webpack.common"));
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  "mode": "production",
  "output": {
    "filename": "[name].js",
  },
  "optimization": {
    "minimize": true,
    "minimizer": [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        "cache": true,
        "parallel": false,
        "sourceMap": false,
        "terserOptions": {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  "module": {
    "rules": [
      {
        "test": /\.css?$/,
        "use": [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
      },
    ],
  },
  "plugins": [
    new MiniCssExtractPlugin({
      "filename": "[name].[chunkhash].css"
    }),
    new HtmlWebpackPlugin({
      "filename": "index.html",
      "template": path.join(__dirname, "..", "public", "index.html"),
      "inject": true,
    }),
  ],
});
