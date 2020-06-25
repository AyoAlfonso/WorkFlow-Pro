import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const Text = props => (
  <StyledText {...props} fontFamily={"Lato"}>
    {props.children}
  </StyledText>
);
