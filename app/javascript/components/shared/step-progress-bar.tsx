import * as React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { StepProgressBarIcon } from "./step-progress-bar-icon";
import { baseTheme } from "../../themes";

export interface IStepProgressBar {
  percent?: number;
  backgroundColor?: string;
  steps: Array<IStepProgressBarStep>;
}

const defaultStepProgressBarProps = {
  percent: 0,
  filledBackground: baseTheme.colors.grey100,
};

export interface IStepProgressBarStep {
  accomplished: boolean;
  position?: number;
  index: number;
  children: () => JSX.Element;
  transition?: string;
  transitionDuration?: string;
}

const defaultStepProgressBarStepProps = {
  transition: "scale",
};
// TODO: Needs correct icon assets
export const StepProgressBar = (props): JSX.Element => {
  const { steps } = props;
  const accomplishedIcon = (
    <StepProgressBarIcon iconProps={{ color: "grey100", icon: "Priority-High" }} />
  );
  const unaccomplishedIcon = (
    <StepProgressBarIcon iconProps={{ color: "primary100", icon: "Priority-Urgent" }} />
  );
  const renderSteps: JSX.Element[] = steps.map((step, index) => (
    <Step key={index} {...defaultStepProgressBarStepProps} {...step}>
      {progressStep => {
        // Getting a bug where it's not reading values correctly from progressStep
        // So using the original step instead
        return <div>{step.accomplished ? accomplishedIcon : unaccomplishedIcon}</div>;
      }}
    </Step>
  ));

  const calculatePercent = () => {
    const accomplishedTasks = steps.filter(st => st.accomplished === true);
    return (accomplishedTasks.length / steps.length) * 100;
  };

  const allStepsCompleted = steps.every(st => st.accomplished === true);
  return (
    <ProgressBar {...defaultStepProgressBarProps} percent={calculatePercent()} {...props}>
      {renderSteps}
      {/* A Final Default Completed Step is needed so that calculatePercentage calculates properly */}
      <Step key={"last-step"}>
        {progressStep => <div>{allStepsCompleted ? accomplishedIcon : unaccomplishedIcon}</div>}
      </Step>
    </ProgressBar>
  );
};
