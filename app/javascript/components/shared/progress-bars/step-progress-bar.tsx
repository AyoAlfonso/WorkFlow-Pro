import * as React from "react";
import * as R from "ramda";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { StepProgressBarIcon } from "./step-progress-bar-icon";
import { baseTheme } from "~/themes";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

export type TStepProgressBarStep = typeof Step;
export interface IStepProgressBar {
  progressBarProps?: typeof ProgressBar;
  steps: Array<TStepProgressBarStep>;
  onStepClick: (args: any) => void;
  currentStepIndex: number;
}

// TODO: Needs correct icon assets
export const StepProgressBar = ({
  progressBarProps,
  steps,
  onStepClick,
  currentStepIndex,
}: IStepProgressBar): JSX.Element => {
  const renderIcon = (iconColor, bgColor, iconName) => (
    <StepProgressBarIcon iconBackgroundColor={bgColor} iconName={iconName} iconColor={iconColor} />
  );

  const totalDuration = steps.reduce((acc, curr) => acc + curr.duration, 0);

  const isOverTime = () => {
    if (currentStepIndex === steps[steps.length - 1].index) {
      return false;
    } else if (currentStepIndex === steps[steps.length - 2].index) {
      return progressBarProps.percent === 100 ? true : false;
    } else if (steps[currentStepIndex + 1].position < progressBarProps.percent) {
      return true;
    } else {
      return false;
    }
  };

  const calculatePercent = () => {
    const currentPosition = steps[currentStepIndex].position;
    return progressBarProps.percent > currentPosition ? progressBarProps.percent : currentPosition;
  };

  const isOneMinuteUntilNextStep = () => {
    const currentStepPosInSec = (calculatePercent() * totalDuration) / 100;
    if (currentStepIndex === steps[steps.length - 1].index) {
      return false;
    } else {
      const nextStepPosInSec = (steps[currentStepIndex + 1].position * totalDuration) / 100;
      return nextStepPosInSec - currentStepPosInSec <= 60;
    }
  };

  const defaultStepProgressBarProps = {
    percent: 0,
    filledBackground: `linear-gradient(to right, ${baseTheme.colors.grey80}, ${
      isOverTime() ? baseTheme.colors.warningRed : baseTheme.colors.primary80
    }`,
  };
  const defaultStepProgressBarStepProps = {
    transition: "scale",
  };

  const renderSteps: JSX.Element[] = steps.map((step, index) => (
    <Step key={index} {...defaultStepProgressBarStepProps} {...step}>
      {progressStep => {
        // Getting a bug where it's not reading values correctly from progressStep
        // So using the original step instead
        return (
          <StepDiv
            data-tip={step.title}
            onClick={() => {
              onStepClick(index);
            }}
          >
            {step.accomplished
              ? renderIcon("white", "grey100", "Checkmark")
              : isOverTime() && index === currentStepIndex
              ? renderIcon("white", "warningRed", "Chevron-Left")
              : isOneMinuteUntilNextStep() && index === currentStepIndex
              ? renderIcon("cautionYellow", "primary100", "Chevron-Left")
              : renderIcon("white", "primary100", "Chevron-Left")}
          </StepDiv>
        );
      }}
    </Step>
  ));

  return (
    <Container>
      <ReactTooltip />
      <ProgressBar
        {...defaultStepProgressBarProps}
        percent={calculatePercent()}
        stepPositions={progressBarProps.stepPositions}
      >
        {renderSteps}
      </ProgressBar>
    </Container>
  );
};

const StepDiv = styled.div`
  border-radius: 50%;
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

const Container = styled.div`
  width: 100%;
`;
