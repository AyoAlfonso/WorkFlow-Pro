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
import IcoMoon from "react-icomoon";
import { baseTheme } from "../../themes/base";
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
  }
  font-family: Lato;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export const IconButton = (props: IIconButtonProps) => {
  const { iconName, iconSize, iconColor, text, textColor, shadow, onClick, ...restProps } = props;
  return (
    <Button shadow={shadow} onClick={onClick} {...restProps}>
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
  );
};
