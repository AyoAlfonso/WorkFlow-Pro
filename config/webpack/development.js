const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const environment = require("./environment");

environment.plugins.append(
  "ForkTsCheckerWebpackPlugin",
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configFile: path.resolve(__dirname, "../../tsconfig.json"),
      memoryLimit: 2048,
    },
    async: false,
  }),
);
module.exports = environment.toWebpackConfig();
