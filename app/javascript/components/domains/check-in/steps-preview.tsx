import React from "react";
import styled from "styled-components";
import { NumericalStep } from "./components/numerical-step";
import { OpenEndedPreview } from "./components/open-ended-preview";
import { SelectionScale } from "./components/selection-scale";
import { YesNoPreview } from "./components/yes-no-preview";

interface StepsPreviewProps {
  step: any;
}

export const StepsPreview = ({ step }: StepsPreviewProps): JSX.Element => {
  const renderComponent = () => {
    switch (step?.stepType) {
      case "Open-ended":
        return <OpenEndedPreview question={"here"} />;
      case "Numeric":
        return <NumericalStep question="here" />;
      case "Sentiment":
        return <SelectionScale question="here" type="sentiment" />;
      case "Agreement Scale":
        return <SelectionScale question="here" />;
      case "Yes/No":
        return <YesNoPreview question="here" />;
      default:
        return <></>;
    }
  };
  return <Container>{renderComponent()}</Container>;
};

const Container = styled.div``;
