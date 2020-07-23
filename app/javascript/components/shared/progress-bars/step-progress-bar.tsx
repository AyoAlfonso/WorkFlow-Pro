import * as React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { StepProgressBarIcon } from "./step-progress-bar-icon";
import { baseTheme } from "~/themes";
import ReactTooltip from "react-tooltip";

export type TStepProgressBarStep = typeof Step;
export interface IStepProgressBar {
  progressBarProps?: typeof ProgressBar;
  steps: Array<TStepProgressBarStep>;
  timed?: boolean;
}

const defaultStepProgressBarProps = {
  percent: 0,
  filledBackground: baseTheme.colors.grey100,
};

const defaultStepProgressBarStepProps = {
  transition: "scale",
};
// TODO: Needs correct icon assets
export const StepProgressBar = ({
  progressBarProps,
  steps,
  timed,
}: IStepProgressBar): JSX.Element => {
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
        return (
          <div data-tip={step.title}>
            {step.accomplished ? accomplishedIcon : unaccomplishedIcon}
          </div>
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
    <>
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
            <div data-tip={"All steps completed."}>
              {allStepsCompleted ? accomplishedIcon : unaccomplishedIcon}
            </div>
          )}
        </Step>
      </ProgressBar>
    </>
  );
};
