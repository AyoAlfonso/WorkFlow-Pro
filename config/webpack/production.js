// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const environment = require("./environment");

// environment.plugins.append(
//   "ForkTsCheckerWebpackPlugin",
//   new ForkTsCheckerWebpackPlugin({
//     tsconfig: path.resolve(__dirname, "../../tsconfig.json"),
//     async: false,
//   }),
// );
module.exports = environment.toWebpackConfig();
