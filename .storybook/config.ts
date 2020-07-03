import { configure, addDecorator } from "@storybook/react";
import { themeDecorator } from "../decorators/themeDecorator";
import StoryRouter from "storybook-react-router";
import { withI18next } from "storybook-addon-i18next";
import i18n from "../app/javascript/i18n/i18n";

const req = require.context("../", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(req);
}
addDecorator(themeDecorator);
addDecorator(StoryRouter());
addDecorator(
  withI18next({
    i18n,
    languages: {
      en: "English",
    },
  }),
);

configure(loadStories, module);
