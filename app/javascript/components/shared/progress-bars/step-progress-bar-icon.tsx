import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { color, ColorProps } from "styled-system";

export interface IStepBarProgressIconProps {
  iconBackgroundColor: string;
  iconName: string;
}

export const StepProgressBarIcon = ({
  iconBackgroundColor,
  iconName,
}: IStepBarProgressIconProps): JSX.Element => {
  return (
    <Container bg={iconBackgroundColor} iconName={iconName}>
      <Icon icon={iconName} iconColor={"white"} size={"16px"} />
    </Container>
  );
};

interface IContainerProps extends ColorProps {
  iconName: string;
}

const Container = styled.div<IContainerProps>`
  ${color}
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transform: ${props => (props.iconName === "Chevron-Left" ? "scaleX(-1)" : null)};
`;
