const path = require("path");
module.exports = {
  webpackFinal: async config => {
    const faultyPluginName = "plugin-transform-react-constant-elements";
    const javaScriptFilesRule = config.module.rules.find(rule =>
      rule.test.toString().includes("js"),
    );
    const babelLoader = javaScriptFilesRule.use.find(usage => usage.loader === "babel-loader");
    babelLoader.options.plugins = babelLoader.options.plugins.filter(
      plugin => typeof plugin !== "string" || !plugin.includes(faultyPluginName),
    );
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "~": path.resolve(__dirname, "../app/javascript"),
        },
      },
    };
  },
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
