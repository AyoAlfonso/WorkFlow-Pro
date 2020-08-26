import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { color, ColorProps } from "styled-system";

export interface IStepBarProgressIconProps {
  iconBackgroundColor: string;
  iconColor: string;
  iconName: string;
}

export const StepProgressBarIcon = ({
  iconBackgroundColor,
  iconColor,
  iconName,
}: IStepBarProgressIconProps): JSX.Element => {
  return (
    <Container bg={iconBackgroundColor}>
      <IconContainer iconName={iconName}>
        <Icon icon={iconName} iconColor={iconColor} size={"17px"} />
      </IconContainer>
    </Container>
  );
};

const Container = styled.div<ColorProps>`
  ${color}
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
`;

interface IIconContainerProps {
  iconName: string;
}

const IconContainer = styled.div<IIconContainerProps>`
  padding-top: 3px;
  padding-right: ${props => (props.iconName === "Chevron-Left" ? "2px" : null)};
  transform: ${props => (props.iconName === "Chevron-Left" ? "scaleX(-1)" : null)};
`;
