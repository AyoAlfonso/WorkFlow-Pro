import { configure, addDecorator } from "@storybook/react";
import { themeDecorator } from "../decorators/themeDecorator";

const req = require.context("../", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(req);
}
addDecorator(themeDecorator);
configure(loadStories, module);
