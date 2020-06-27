import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const Placeholder = props => (
  <StyledText {...props} fontFamily={"Lato"}>
    Under Construction
  </StyledText>
);
