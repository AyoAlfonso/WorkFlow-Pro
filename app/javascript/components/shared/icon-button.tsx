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
} from "styled-system";
import { Text } from "./text";
import { baseTheme } from "../../themes/base";
import IcoMoon from "react-icomoon";
const iconSet = require("../../assets/icons/selection.json");

type StyledSystemProps = ColorProps & LayoutProps & SpaceProps & TypographyProps;

export interface IIconButtonProps extends StyledSystemProps {
  iconName: string;
  iconSize: string | number;
  iconColor?: string;
  text?: string;
  textColor?: string;
  shadow?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Button = styled.button<IIconButtonProps>`
  ${color}
  ${layout}
  ${space}
  ${typography}
  border-radius: 5px;
  border: 0px solid white;
  box-shadow: ${props => (props.shadow ? "1px 3px 4px 2px rgba(0, 0, 0, .1)" : "0")};
  &:hover {
    cursor: pointer;
    opacity: ${props => (props.bg ? "0.85" : "1.0")};
    background: ${props => (props.bg === "white" ? "rgba(0, 0, 0, 0.02)" : props.bg)}
  }
  &:active {
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, .2);
    transform: translate(1px, 1px)
  }
  &:focus {
    outline: 0;
  }
  transition: all ease 0.1s;
  font-family: Lato;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export const IconButton: React.FunctionComponent<IIconButtonProps> = ({
  iconName,
  iconSize,
  iconColor,
  text,
  textColor,
  shadow,
  onClick,
  disabled,
  ...restProps
}): JSX.Element => {
  return text ? (
    <Button shadow={shadow} onClick={onClick} {...restProps} pl={"20px"} disabled={disabled}>
      <IcoMoon
        icon={iconName}
        iconSet={iconSet}
        color={`${iconColor in baseTheme.colors ? baseTheme.colors[iconColor] : iconColor}`}
        size={iconSize}
      />
      <TextContainer>
        <Text color={textColor || "black"}>{text}</Text>
      </TextContainer>
    </Button>
  ) : (
    <Button shadow={shadow} onClick={onClick} {...restProps} p={0} disabled={disabled}>
      <IcoMoon
        icon={iconName}
        iconSet={iconSet}
        color={`${iconColor in baseTheme.colors ? baseTheme.colors[iconColor] : iconColor}`}
        size={iconSize}
      />
    </Button>
  );
};
