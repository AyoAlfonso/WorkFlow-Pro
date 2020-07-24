import * as React from "react";
import styled from "styled-components";
import { color, layout, space, typography, variant } from "styled-system";

const StyledButton = styled.button`
  ${color}
  ${layout}
  ${space}
  ${typography}
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: 0
  }
  &:active {
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, .1);
    transform: translate(1px, 1px)
  }
  transition: all ease 0.1s;
  ${props =>
    variant({
      variants: {
        primary: {
          bg: props.disabled ? "primary60" : "primary100",
          color: "white",
          borderColor: props.disabled ? "primary60" : "primary100",
        },
        primaryOutline: {
          bg: "white",
          color: props.disabled ? "primary60" : "primary100",
          borderColor: props.disabled ? "primary60" : "primary100",
        },
        redOutline: {
          bg: "white",
          color: props.disabled ? "fadedRed" : "warningRed",
          borderColor: props.disabled ? "fadedRed" : "warningRed",
        },
      },
    })}
`;

export const Button = props => {
  const { onClick, disabled, small, ...restProps } = props;
  return (
    <StyledButton
      {...restProps}
      fontFamily={"Lato"}
      fontSize={small ? 1 : 2}
      px={4}
      disabled={disabled}
      onClick={disabled ? null : onClick}
      height={small ? "32px" : "40px"}
    >
      {props.children}
    </StyledButton>
  );
};
