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
  timed?: boolean;
  onStepClick: (args: any) => void;
  currentStep: number;
}

// TODO: Needs correct icon assets
export const StepProgressBar = ({
  progressBarProps,
  steps,
  timed,
  onStepClick,
  currentStep,
}: IStepProgressBar): JSX.Element => {
  const renderIcon = (color, iconName) => (
    <StepProgressBarIcon iconBackgroundColor={color} iconName={iconName} />
  );

  const isOverTime = () => {
    if (currentStep === steps[steps.length - 1].index) {
      return false;
    } else if (steps[currentStep + 1].position < progressBarProps.percent) {
      return true;
    } else {
      return false;
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
              ? renderIcon("grey100", "Checkmark")
              : isOverTime() && index === currentStep
              ? renderIcon("warningRed", "Chevron-Left")
              : renderIcon("primary100", "Chevron-Left")}
          </StepDiv>
        );
      }}
    </Step>
  ));

  const calculatePercent = () => {
    const accomplishedTasks = steps.filter(st => st.accomplished === true);
    return (accomplishedTasks.length / steps.length) * 100;
  };

  const allStepsCompleted = steps.every(st => st.accomplished === true);
  return (
    <Container>
      <ReactTooltip />
      <ProgressBar
        {...defaultStepProgressBarProps}
        percent={!timed && calculatePercent()}
        {...progressBarProps}
      >
        {renderSteps}
        {/* A Final Default Completed Step is needed so that calculatePercentage calculates properly */}
        <Step key={"last-step"}>
          {progressStep => (
            <div data-tip={"End Meeting"}>
              {allStepsCompleted
                ? renderIcon("grey100", "Chechmark")
                : renderIcon(
                    calculatePercent() >= 100 ? "warningRed" : "primary100",
                    "Chevron-Left",
                  )}
            </div>
          )}
        </Step>
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
