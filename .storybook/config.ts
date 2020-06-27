import { configure, addDecorator } from "@storybook/react";
import { themeDecorator } from "../decorators/themeDecorator";
import StoryRouter from "storybook-react-router";

const req = require.context("../", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(req);
}
addDecorator(themeDecorator);
addDecorator(StoryRouter());
configure(loadStories, module);
