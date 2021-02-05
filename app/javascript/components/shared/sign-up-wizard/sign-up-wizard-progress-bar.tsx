import * as React from "react";
import styled from "styled-components";
import { ProgressBar, Step } from "react-step-progress-bar";
import { baseTheme } from "~/themes";
import { StepProgressBarIcon } from "../progress-bars";
import { Text } from "~/components/shared/text";

interface ISignUpWizardProgressBarProps {
  stepNames: Array<String>;
  currentStep: number;
}

export const SignUpWizardProgressBar = ({
  stepNames,
  currentStep,
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

  const titleCharLength = (title): number => {
    const splittedTitle = title.split("");
    return splittedTitle.length;
  };

  const renderSteps = () => {
    return stepNames.map((step, index) => {
      return (
        <StepContainer key={index}>
          <StepTitleContainer titleCharLength={titleCharLength(step)}>
            <StepTitle>{step}</StepTitle>
          </StepTitleContainer>

          <Step transition="scale">
            {({ accomplished }) =>
              currentStep >= index
                ? renderIcon("white", "primary100", "Chevron-Left")
                : renderIcon("white", "grey100", "Chevron-Left")
            }
          </Step>
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

const StepTitle = styled(Text)`
  font-size: 9px;
  color: ${props => props.theme.colors.greyActive};
`;

const IconContainer = styled.div`
  margin-top: -15px;
`;

type StepTitleContainerProps = {
  titleCharLength: number;
};

const StepTitleContainer = styled.div<StepTitleContainerProps>`
  width: 20%;
  position: absolute;
  margin-top: -60px;
  margin-left: ${props => `-${props.titleCharLength * 2.1}px`};
`;
