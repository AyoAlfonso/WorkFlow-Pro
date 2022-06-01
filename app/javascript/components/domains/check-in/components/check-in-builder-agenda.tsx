import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { baseTheme } from "~/themes";

interface CheckinBuilderAgendaProps {
  steps: any;
  currentStep: number;
}

export const CheckinBuilderAgenda = ({
  steps,
  currentStep,
}: CheckinBuilderAgendaProps): JSX.Element => {
  const renderSteps = () => {
    return steps.map((step, index) => {
      const stepIcon = () => {
        if (step.orderIndex == currentStep) {
          return (
            <StepIconContainer bgColor={baseTheme.colors.primary100}>
              <ChevronRightIcon icon="Chevron-Left" iconColor="white" size="16px" />
            </StepIconContainer>
          );
        } else if (step.orderIndex < currentStep) {
          return (
            <StepIconContainer bgColor={baseTheme.colors.grey100}>
              <Icon icon="Checkmark" iconColor="white" size="16px" />
            </StepIconContainer>
          );
        } else {
          return (
            <Circle ml="6px" mr="1.37em" size={"24px"} bgColor={baseTheme.colors.greyInactive}>
              <Circle m="auto" size={"12px"} bgColor={"white"} />
            </Circle>
          );
        }
      };

      return (
        <StepContainer key={`step-${index}`}>
          <StepDetails index={index}>
            {stepIcon()}
            <StepText>{step.name}</StepText>
          </StepDetails>
        </StepContainer>
      );
    });
  };
  return <Container>{renderSteps()}</Container>;
};

const Container = styled.div`
`;

type StepDetailsProps = {
  index: number;
}

const StepDetails = styled.div<StepDetailsProps>`
  order: 1;
  padding-bottom: ${props => props.index == 2 ? "0em" : "1em"};
  display: flex;
  align-items: center;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: #e7e8ee;
    left: 16px;
  }
`;

const StepContainer = styled.li`
  display: flex;
  position: relative;
  overflow: hidden;
`;

type StepIconContainerProps = {
  bgColor: string;
};

const StepIconContainer = styled.div<StepIconContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
  margin-right: 1em;
  z-index: 5;
`;

const ChevronRightIcon = styled(Icon)`
  transform: rotate(180deg);
`;

const StepText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 14px;
  font-weight: bold;
  order: 1;
`;

type CircleProps = {
  size: string;
  bgColor: string;
  mr?: string;
  m?: string;
  ml?: string;
};

const Circle = styled.div<CircleProps>`
  display: flex;
  align-items: center;
  border-radius: 50%;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  background-color: ${({ bgColor }) => bgColor};
  margin-right: ${({ mr }) => mr};
  margin: ${({ m }) => m};
  z-index: 5;
  margin-left: ${({ ml }) => ml};
`;
