const path = require("path");
const webpack = require("webpack");
require("dotenv").config({ path: "./.env" });

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const environment = require("./environment");

environment.config.set("resolve.extensions", [".ts", ".tsx"]);

environment.loaders.append("tsx", {
  test: /\.(ts|tsx|)$/,
  exclude: /node_modules/,
  use: ["babel-loader"],
});

environment.plugins.prepend(
  "env",
  new webpack.DefinePlugin({
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    PRODUCT_STASH_PRODUCT_ID: process.env.PRODUCT_STASH_PRODUCT_ID,
    FRESHDESK_WIDGET_ID: process.env.FRESHDESK_WIDGET_ID,
    QA_SHOW_CREATE_COMPANY_FORUM_MENU: process.env.QA_SHOW_CREATE_COMPANY_FORUM_MENU,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI,
    MICROSOFT_LOGOUT_REDIRECT_URI: process.env.MICROSOFT_LOGOUT_REDIRECT_URI,
  }),
);

environment.config.set("entry", "./app/javascript/index.js");
environment.config.set("resolve.alias", { "~": path.resolve(__dirname, "../../app/javascript") });
module.exports = environment.toWebpackConfig();
