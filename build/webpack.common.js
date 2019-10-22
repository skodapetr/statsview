const path = require("path");
const {VueLoaderPlugin} = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  "entry": [
    path.join(__dirname, "..", "client", "index.js")
  ],
  "output": {
    "path": path.join(__dirname, "..", "dist"),
    "filename": "bundle.js",
    "publicPath": "./"
  },
  "optimization": {
    "splitChunks": {
      "cacheGroups": {
        "commons": {
          "test": /[\\/]node_modules[\\/]/,
          "filename": "[name].[chunkhash].js",
          "name": "vendor",
          "chunks": "all"
        },
      },
    },
  },
  "resolve": {
    "modules": ["node_modules"],
    "extensions": [".js", ".vue"],
    "alias": {}
  },
  "module": {
    "rules": [
      {
        "test": /\.vue$/,
        "use": "vue-loader"
      }, {
        "test": /\.js$/,
        "use": "babel-loader",
        "include": [
          path.resolve(__dirname, "..", "client"),
          path.resolve("node_modules")
        ]
      }
    ]
  },
  "plugins": [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      "filename": "index.html",
      "template": path.join(__dirname, "..", "public", "index.html"),
      "inject": true
    })
  ],
};