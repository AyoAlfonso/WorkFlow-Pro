import * as React from "react";
import { RoundButton } from "../app/javascript/components/shared/Round-Button";
import { text, withKnobs } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Icon from "../app/javascript/components/shared/Icon";
import { baseTheme } from "../app/javascript/themes";
import { ContainerDiv, PropsList } from "./shared";

const actionFn = action("you clicked the button");

export default { title: "Round Button", decorators: [withKnobs] };

export const Example = () => (
  <ContainerDiv pl={4}>
    <h1>Round Button</h1>
    <PropsList styledSystemProps={["color"]} />
    <div>
      <RoundButton onClick={actionFn}>
        <Icon
          icon={text("icon", "Plus")}
          size={20}
          iconColor={baseTheme.colors.primary100}
          style={{ marginLeft: "10px", marginTop: "10px" }}
        />
      </RoundButton>
    </div>
  </ContainerDiv>
);
