import * as React from "react";
import styled from "styled-components";
import {
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  variant,
} from "styled-system";

type StyledSystemProps = ColorProps & LayoutProps & SpaceProps & TypographyProps;

interface IButtonProps extends StyledSystemProps {
  variant?: string;
  onClick: () => void | void;
  disabled?: boolean;
  children?: any;
  small?: boolean;
  style?: object;
}

const StyledButton = styled.button<IButtonProps>`
  ${color}
  ${layout}
  ${space}
  ${typography}
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  &:hover {
    cursor: pointer;
    opacity: ${props => (props.variant.includes("Outline") || props.disabled ? "1.0" : "0.85")};
    background: ${props =>
      props.variant.includes("Outline") && !props.disabled ? "rgba(0, 0, 0, 0.02)" : null};
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

export const Button = (props: IButtonProps) => {
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
