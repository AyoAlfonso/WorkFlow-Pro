import * as React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { text, withKnobs } from "@storybook/addon-knobs";
import { color, space, layout, typography, variant } from "styled-system";

export default { title: "Button", decorators: [withKnobs] };

const StyledButton = styled.button`
  ${color}
  ${space}
  ${layout}
  ${typography}
  height: 40px;
  width: 120px;
  color: white;
  border-radius: 5px;
  text-align: center;
  ${(props) =>
    variant({
      variants: {
        primary: {
          bg: "primary100",
          borderColor: "primary100",
        },
        warning: {
          bg: "warningRed",
          borderColor: "warningRed",
        },
      },
    })}
`;

const actionFn = action("you clicked the button");

export const Primary_Example = () => (
  <div>
    <StyledButton
      onClick={actionFn}
      variant={"primary"}
      p={1}
      m={4}
      fontFamily={"Lato"}
      fontSize={2}
    >
      {text("Text", "Button")}
    </StyledButton>
  </div>
);

export const Warning_Example = () => (
  <StyledButton
    onClick={actionFn}
    variant={"warning"}
    p={1}
    m={4}
    fontFamily={"Exo"}
    fontSize={3}
  >
    {text("Text", "Button")}
  </StyledButton>
);
