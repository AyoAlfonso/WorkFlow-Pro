import React from "react";
import styled from "styled-components";
import { NumericalStep } from "./components/numerical-step";
import { OpenEndedPreview } from "./components/open-ended-preview";
import { SelectionScale } from "./components/selection-scale";
import { YesNoPreview } from "./components/yes-no-preview";
import { SelectedStepType } from "./steps-selector-page";

interface StepsPreviewProps {
  step: SelectedStepType;
}

export const StepsPreview = ({ step }: StepsPreviewProps): JSX.Element => {
  const renderComponent = () => {
    switch (step?.stepType) {
      case "Open-ended":
        return <OpenEndedPreview question={step.question} />;
      case "Numeric":
        return <NumericalStep question={step.question} />;
      case "Sentiment":
        return <SelectionScale question={step.question} type="sentiment" />;
      case "Agreement Scale":
        return <SelectionScale question={step.question} />;
      case "Yes/No":
        return <YesNoPreview question={step.question} />;
      default:
        return <></>;
    }
  };
  return <Container>{renderComponent()}</Container>;
};

const Container = styled.div`
  margin-right: 1px;
`;
