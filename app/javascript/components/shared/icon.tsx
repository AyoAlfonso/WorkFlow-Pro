import * as React from "react";
import IcoMoon from "react-icomoon";
import styled from "styled-components";
import { layout, LayoutProps, space, SpaceProps } from "styled-system";
import { baseTheme } from "../../themes/base";
const iconSet = require("../../assets/icons/selection.json");

type StyledSystemProps = LayoutProps & SpaceProps;
interface IIconProps extends StyledSystemProps {
  icon: string;
  iconColor?: string;
  size: string | number;
  style?: object;
  disableFill?: boolean;
  removeInlineStyle?: boolean;
}

export const IconContainer = styled.div<IIconProps>`
  ${layout}
  ${space}
`;

export const Icon = (props: IIconProps) => {
  const { icon, iconColor, size, disableFill, removeInlineStyle, ...restProps } = props;
  return (
    <IconContainer {...restProps}>
      <IcoMoon
        icon={icon}
        iconSet={iconSet}
        color={`${iconColor in baseTheme.colors ? baseTheme.colors[iconColor] : iconColor}`}
        size={size}
        disableFill={disableFill}
        removeInlineStyle={removeInlineStyle}
      />
    </IconContainer>
  );
};
