const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  // entry: "./app/javascript/packs/index.tsx",
  entry: path.resolve(__dirname, "app/javascript/packs/index.tsx"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        devtool: "inline-source-map",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    // path: __dirname + "./app/javascript/packs",
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};
