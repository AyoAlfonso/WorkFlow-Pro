const PnpWebpackPlugin = require('pnp-webpack-plugin')

module.exports = {
  test: /.(ts|tsx)$/,
  use: [
    {
      loader: "ts-loader",
      exclude: /node_modules/,
      // options: PnpWebpackPlugin.tsLoaderOptions(),
    },
  ],
};
