import * as React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { withKnobs, text } from "@storybook/addon-knobs";
import { themeGet } from "@styled-system/theme-get";

export default { title: "Button", decorators: [withKnobs] };

const StyledButton = styled.button`
  height: 40px;
  width: 120px;
  background-color: ${themeGet("colors.primary100")};
  border-color: ${themeGet("colors.primary100")};
  color: ${themeGet("colors.white")};
  border-radius: 5px;
  padding: 10px;
  margin: 20px;
  text-align: center;
`;

const actionFn = action("you clicked the button");

export const Styled_Example = () => (
  <StyledButton onClick={actionFn}>{text("Text", "Button")}</StyledButton>
);
