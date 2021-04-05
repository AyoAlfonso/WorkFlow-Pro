import * as React from "react";
import styled from "styled-components";
import { position, PositionProps } from "styled-system";
import { ProgressBar, Step } from "react-step-progress-bar";
import { baseTheme } from "~/themes";
import { StepProgressBarIcon } from "../progress-bars";
import { Text } from "~/components/shared/text";

interface ISignUpWizardProgressBarProps {
  stepNames: Array<String>;
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  clickDisabled?: boolean;
}

export const SignUpWizardProgressBar = ({
  stepNames,
  currentStep,
  onStepClick,
  clickDisabled,
}: ISignUpWizardProgressBarProps): JSX.Element => {
  const renderIcon = (iconColor, bgColor, iconName) => (
    <IconContainer>
      <StepProgressBarIcon
        iconBackgroundColor={bgColor}
        iconName={iconName}
        iconColor={iconColor}
      />
    </IconContainer>
  );

  const renderSteps = () => {
    return stepNames.map((step, index) => {
      return (
        <StepContainer key={index}>
          <StepTitleContainer titleCharLength={(step || "").length}>
            <StepTitle index={index} currentStep={currentStep}>
              {step}
            </StepTitle>
          </StepTitleContainer>
          <StepDiv
            onClick={() => {
              if (!clickDisabled) onStepClick(index);
            }}
          >
            <Step transition="scale">
              {({ accomplished }) => {
                if (currentStep === index) {
                  return renderIcon("white", "primary100", "Chevron-Left");
                } else if (currentStep > index) {
                  return renderIcon("white", "grey100", "Checkmark");
                } else {
                  return <IncompleteStep />;
                }
              }
              // currentStep > index
              // ? renderIcon("white", "primary100", "Chevron-Left")
              // : renderIcon("white", "grey100", "Chevron-Left")
              }
            </Step>
          </StepDiv>
        </StepContainer>
      );
    });
  };

  return (
    <ProgressBar filledBackground={baseTheme.colors.primary80} percent={currentStep * 25}>
      {renderSteps()}
    </ProgressBar>
  );
};

const StepContainer = styled.div``;

const StepTitle = styled(Text)<{ currentStep; index }>`
  font-size: 11px;
  color: ${({ currentStep, index, theme: { colors } }) =>
    currentStep === index ? colors.primary100 : colors.greyActive};
`;

const IconContainer = styled.div`
  margin-top: -15px;
`;

type StepTitleContainerProps = {
  titleCharLength: number;
};

const StepTitleContainer = styled.div<StepTitleContainerProps>`
  width: ${props => `${props.titleCharLength}em`};
  position: absolute;
  margin-top: -60px;
  margin-left: ${props => `-${props.titleCharLength * 2.1}px`};
`;

const StepDiv = styled.div`
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: 0;
  }
  &:active {
    transform: translate(1px, 1px);
  }
  transition: all ease 0.1s;
`;

interface ICircleProps extends PositionProps {
  bgColor: string;
  size: string;
}

const Circle = styled.div<ICircleProps>`
  ${position}
  border-radius: 50%;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  background-color: ${({ bgColor }) => bgColor};
`;

const IncompleteStep = () => {
  return (
    <Circle
      size={"24px"}
      bgColor={baseTheme.colors.greyInactive}
      position={"absolute"}
      top={"-12px"}
      left={"-12px"}
    >
      <Circle size={"12px"} bgColor={"white"} position={"absolute"} top={"6px"} left={"6px"} />
    </Circle>
  );
};
