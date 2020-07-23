const path = require("path");
module.exports = {
  webpackFinal: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "~": path.resolve(__dirname, "../app/javascript"),
      },
    },
  }),
  addons: [
    {
      name: "@storybook/preset-typescript",
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, "../tsconfig.json"),
        },
        include: [path.resolve(__dirname, "../app/javascript")],
      },
    },
    "@storybook/addon-actions/register",
    "@storybook/addon-knobs/register",
  ],
  stories: ["../stories/**/*.stories.tsx"],
};
