import React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, color } from "@storybook/addon-knobs";

export default { title: "Button", decorators: [withKnobs] };

const StyledButton = styled.button`
  height: 40px;
  width: 120px;
`;

export const Styled = () => (
  <StyledButton
    onClick={action("you clicked the button")}
    style={{ backgroundColor: color("Color", "red") }}
  >
    {text("Text", "Some Button Text")}
  </StyledButton>
);
