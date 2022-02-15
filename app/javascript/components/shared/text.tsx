import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const Text = props => {
  const { type, children, fontFamily } = props;
  switch (type) {
    case "small":
      return (
        <StyledText {...props} fontSize={"11px"} lineHeight={"12px"} fontFamily={"Lato"}>
          {children}
        </StyledText>
      );
    case "paragraph":
      return (
        <StyledText {...props} fontSize={"14px"} lineHeight={"16px"} fontFamily={"Lato"}>
          {children}
        </StyledText>
      );
    case "fieldLabel":
      return (
        <StyledText
          {...props}
          fontSize={"12px"}
          lineHeight={"12px"}
          fontFamily={"Lato"}
          fontWeight={"bold"}
        >
          {children}
        </StyledText>
      );
    default:
      return (
        <StyledText {...props} fontFamily={fontFamily ? fontFamily : "Lato"}>
          {children}
        </StyledText>
      );
  }
};

const StyledTextNoMargin = styled.p`
  ${color}
  ${space}
  ${typography}
  margin-top: 0px;
  margin-bottom: 0px;
`;

const StyledTextDiv = styled.div`
  ${color}
  ${space}
  ${typography}
`;
export const TextDiv = props => (
  <StyledTextDiv {...props} fontFamily={props.fontFamily ? props.fontFamily : "Lato"}>
    {props.children}
  </StyledTextDiv>
);

export const TextNoMargin = props => (
  <StyledTextNoMargin {...props} fontFamily={props.fontFamily ? props.fontFamily : "Lato"}>
    {props.children}
  </StyledTextNoMargin>
);

export const TableHeader = styled(Text)`
  font-weight: bold;
  color: ${props => props.theme.colors.grey100};
`;
