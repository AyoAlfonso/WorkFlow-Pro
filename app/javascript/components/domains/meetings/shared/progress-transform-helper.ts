import * as R from "ramda";

export const progressBarStepsForMeeting = meeting =>
  meeting.steps.map((currentStep, index, stepsArray) => {
    const accumulatedPosition = stepsArray
      .slice(0, index)
      .reduce((acc, curr) => acc + (curr.duration / meeting.totalDuration) * 100, 0);
    return {
      accomplished: currentStep.orderIndex < meeting.currentStep,
      position: accumulatedPosition,
      index: currentStep.orderIndex,
      title: currentStep.name,
      duration: currentStep.duration * 60,
    };
  });
export const stepPositionsForMeeting = (meeting, progressBarStepsInstance) =>
  R.map(step => step.position, progressBarStepsInstance).concat([100]);
