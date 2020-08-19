import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const Text = props => (
  <StyledText {...props} fontFamily={props.fontFamily ? props.fontFamily : "Lato"}>
    {props.children}
  </StyledText>
);

const StyledTextNoMargin = styled.p`
  ${color}
  ${space}
  ${typography}
  margin-top: 0px;
  margin-bottom: 0px;
`;

export const TextNoMargin = props => (
  <StyledTextNoMargin {...props} fontFamily={props.fontFamily ? props.fontFamily : "Lato"}>
    {props.children}
  </StyledTextNoMargin>
);
