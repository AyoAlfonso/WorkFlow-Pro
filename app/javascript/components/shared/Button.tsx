import * as React from "react";
import styled from "styled-components";
import { color, layout, space, typography, variant } from "styled-system";
import { Button as RebassButton } from "rebass/styled-components";

const ButtonDiv = styled.div`
  ${color}
  ${layout}
  ${space}
  height: ${props => (props.small ? "32px" : "40px")}
  display: inline-block;
  border-radius: 8px;
  border-width: 2px;
  border-style: solid;
  ${props =>
    variant({
      variants: {
        primary: {
          bg: props.disabled ? "primary60" : "primary100",
          borderColor: props.disabled ? "primary60" : "primary100",
        },
        primaryOutline: {
          bg: "white",
          borderColor: props.disabled ? "primary60" : "primary100",
        },
        redOutline: {
          bg: "white",
          borderColor: props.disabled ? "fadedRed" : "warningRed",
        },
      },
    })}
`;

const ExtendedButton = styled(RebassButton)`
  ${color}
  ${layout}
  ${space}
  ${typography}
  height: 100%;
  border-radius: 5px;
  ${props =>
    variant({
      variants: {
        primary: {
          bg: props.disabled ? "primary60" : "primary100",
          color: "white",
        },
        primaryOutline: {
          bg: "white",
          color: props.disabled ? "primary60" : "primary100",
        },
        redOutline: {
          bg: "white",
          color: props.disabled ? "fadedRed" : "warningRed",
        },
      },
    })}
`;

export const Button = props => {
  const { onClick, disabled, small, ...restProps } = props;
  return (
    <ButtonDiv {...restProps} disabled={disabled}>
      <ExtendedButton
        {...restProps}
        fontFamily={"Lato"}
        fontSize={small ? 1 : 2}
        px={4}
        disabled={disabled}
        onClick={disabled ? null : onClick}
      >
        {props.children}
      </ExtendedButton>
    </ButtonDiv>
  );
};
