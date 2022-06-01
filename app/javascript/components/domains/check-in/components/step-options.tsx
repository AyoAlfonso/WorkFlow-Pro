import * as React from "react";
import styled from "styled-components";
import { questionsArray, widgetArray } from "../data/step-data";
import { StepTypeCard } from "./step-type-card";

interface StepOptionsProps {
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<any>>>;
  setShowStepsModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepOptions = ({
  setSelectedSteps,
  setShowStepsModal,
}: StepOptionsProps): JSX.Element => {
  return (
    <Container>
      <SubHeading>Questions</SubHeading>
      <QuestionsContainer>
        {questionsArray.map((step, index) => (
          <StepTypeCard
            key={`step-card-${index}`}
            iconColor={step.iconColor}
            iconName={step.iconName}
            stepType={step.stepName}
            description={step.description}
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
            iconColor={step.iconColor}
            iconName={step.iconName}
            stepType={step.stepName}
            description={step.description}
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

const QuestionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  grid-auto-columns: minmax(1fr, 290px);
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
  margin-bottom: 1.5em;
`;
