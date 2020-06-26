import * as React from "react";
import { color } from "styled-system";
import styled from "styled-components";

type IconContainerType = {
  backgroundColor?: string;
};

const StyledButton = styled.div<IconContainerType>`
  ${color}
  height: 40px;
  width: 40px;
  border-radius: 50px;
  box-shadow: 0px 2px rgba(0, 0, 0, 0.2);
  &:hover {
    cursor: pointer;
  }
`;

export const RoundButton = props => <StyledButton {...props}>{props.children}</StyledButton>;
