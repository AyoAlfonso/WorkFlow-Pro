import * as React from "react";
import styled from "styled-components";
import { Text } from "./text";

interface ISubHeaderTextProps {
  text: string;
  noMargin?: boolean;
}

export const SubHeaderText = ({ text, noMargin }: ISubHeaderTextProps): JSX.Element => {
  return <StyledText noMargin={noMargin}>{text}</StyledText>;
};

type StyledTextProps = {
  noMargin?: boolean;
};

const StyledText = styled(Text)<StyledTextProps>`
  font-size: 16px;
  font-weight: bold;
  margin-top: ${props => props.noMargin && "0px"};
  margin-bottom: ${props => props.noMargin && "0px"};
`;
