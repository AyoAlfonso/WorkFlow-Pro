import * as React from "react";
import IcoMoon from "react-icomoon";
import styled from "styled-components";
import { baseTheme } from "../../themes/base";
import { IconContainer } from "./icon";
const iconSet = require("../../assets/icons/selection.json");

interface IStepProgressBarIconProps {
  iconContainerProps?: typeof IconContainer;
  iconProps?: typeof IcoMoon;
}

const StepProgressBarIconContainer = styled(IconContainer)`
  background-color: ${props => props.theme.colors.white};
  border-radius: 100%;
`;

export const StepProgressBarIcon = ({
  iconContainerProps,
  iconProps,
  iconProps: { color },
}: IStepProgressBarIconProps) => (
  <StepProgressBarIconContainer {...iconContainerProps}>
    <IcoMoon
      iconSet={iconSet}
      size={"25px"}
      {...iconProps}
      color={`${baseTheme.colors[color] ? baseTheme.colors[color] : color}`}
    />
  </StepProgressBarIconContainer>
);
