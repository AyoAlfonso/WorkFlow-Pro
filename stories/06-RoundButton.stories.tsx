import * as React from "react";
import { RoundButton } from "../app/javascript/components/shared/Round-Button";
import { text, withKnobs } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

const actionFn = action("you clicked the button");

export default { title: "Round Button", decorators: [withKnobs] };

export const Example = () => (
  <div>
    <RoundButton onClick={actionFn}>{text("Text", "Button")}</RoundButton>
  </div>
);
