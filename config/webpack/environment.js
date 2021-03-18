const { environment } = require("@rails/webpacker");
const jquery = require("./plugins/jquery");
const typescript = require("./loaders/typescript");
const customConfig = require("./custom");
const Dotenv = require("dotenv-webpack");

environment.loaders.prepend("typescript", typescript);
environment.plugins.prepend("jquery", jquery);
environment.plugins.append("DotenvPlugin", new Dotenv());

// Merge custom config
environment.config.merge(customConfig);

module.exports = environment;
