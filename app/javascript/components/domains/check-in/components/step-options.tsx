import * as React from "react";
import styled from "styled-components";
import { questionsArray, widgetArray } from "../data/step-data";
import { SelectedStepType } from "../steps-selector-page";
import { StepTypeCard } from "./step-type-card";

interface StepOptionsProps {
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<any>>>;
  setShowStepsModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChanging?: React.Dispatch<React.SetStateAction<boolean>>;
  isChanging?: boolean;
  stepToPreview?: SelectedStepType;
  selectedSteps?: Array<SelectedStepType>;
}

export const StepOptions = ({
  setSelectedSteps,
  setShowStepsModal,
  setIsChanging,
  isChanging,
  stepToPreview,
  selectedSteps,
}: StepOptionsProps): JSX.Element => {
  return (
    <Container>
      <SubHeading>Questions</SubHeading>
      <QuestionsContainer>
        {questionsArray.map((step, index) => (
          <StepTypeCard
            key={`step-card-${index}`}
            step={step}
            isChanging={isChanging}
            setIsChanging={setIsChanging}
            stepToPreview={stepToPreview}
            selectedSteps={selectedSteps}
            setSelectedSteps={setSelectedSteps}
            setShowStepsModal={setShowStepsModal}
          />
        ))}
      </QuestionsContainer>
      <SubHeading>Widgets</SubHeading>
      <WidgetContainer>
        {widgetArray.map((step, index) => (
          <StepTypeCard
            key={`step-card-${index}`}
            step={step}
            isChanging={isChanging}
            setIsChanging={setIsChanging}
            stepToPreview={stepToPreview}
            selectedSteps={selectedSteps}
            setSelectedSteps={setSelectedSteps}
            setShowStepsModal={setShowStepsModal}
          />
        ))}
      </WidgetContainer>
    </Container>
  );
};

const Container = styled.div`
  overflow-y: auto;
`;

const StepContainer = styled.div`
  // width: fit-content;
`;

const QuestionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  grid-auto-columns: minmax(1fr, 290px);
  margin: 0 1px;
  margin-bottom: 1.5em;
`;

const SubHeading = styled.span`
  font-size: 1em;
  color: ${props => props.theme.colors.grey100};
  font-weight: bold;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1em;
`;

const WidgetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  grid-auto-columns: auto 290px;
  margin: 0 1px;
  margin-bottom: 1.5em;
`;
