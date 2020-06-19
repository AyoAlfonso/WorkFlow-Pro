import * as React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { text, withKnobs } from "@storybook/addon-knobs";
import { themeGet } from "@styled-system/theme-get";
import { variant } from "styled-system";

export default { title: "Button", decorators: [withKnobs] };

const StyledButton = styled.button`
  height: 40px;
  width: 120px;
  color: ${themeGet("colors.white")};
  border-radius: 5px;
  padding: 10px;
  margin: 20px;
  text-align: center;
  ${(props) =>
    variant({
      variants: {
        primary: {
          backgroundColor: themeGet("colors.primary100")(props),
          borderColor: themeGet("colors.primary100")(props),
        },
        warning: {
          backgroundColor: themeGet("colors.warningRed")(props),
          borderColor: themeGet("colors.warningRed")(props),
        },
      },
    })}
`;

const actionFn = action("you clicked the button");

export const Primary_Example = () => (
  <StyledButton onClick={actionFn} variant={"primary"}>
    {text("Text", "Button")}
  </StyledButton>
);

export const Warning_Example = () => (
  <StyledButton onClick={actionFn} variant={"warning"}>
    {text("Text", "Button")}
  </StyledButton>
);
