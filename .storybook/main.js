const path = require("path");
module.exports = {
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
  ],
  stories: ["../stories/**/*.stories.tsx"],
};
