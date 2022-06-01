import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button, Icon, TextDiv } from "~/components/shared";
import { StepOptions } from "./components/step-options";
import { StepOptionsModal } from "./components/step-options-modal";
import { StepPreviewCard } from "./components/step-preview-card";
import { StepsPreview } from "./steps-preview";

export const StepsSelectorPage = (): JSX.Element => {
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showStepsModal, setShowStepsModal] = useState<boolean>(false);
  const [stepToPreview, setStepToPreview] = useState({});
  console.log(stepToPreview);

  const deleteStep = (step) => {
    setSelectedSteps(selectedSteps.filter(s => s.position !== step.position));
  }

  return (
    <Container>
      <StepsContainer>
        <SectionHeader>Steps</SectionHeader>
        <StepCardsContainer>
          {selectedSteps.map(step => (
            <StepCardContainer key={step.position} onClick={() => setStepToPreview(step)}>
              <StepPreviewCard
                deleteStep={() => deleteStep(step)}
                stepType={step.stepType}
                iconName={step.iconName}
                selected={stepToPreview === step}
              />
            </StepCardContainer>
          ))}
        </StepCardsContainer>
        <StyledButton small variant={"grey"} onClick={() => setShowStepsModal(true)}>
          <CircularIcon icon={"Plus"} size={"12px"} />
          <AddStepText> Add Step </AddStepText>
        </StyledButton>
      </StepsContainer>
      <PreviewContainer>
        <SectionHeader>Preview</SectionHeader>
        {!selectedSteps.length ? (
          <>
            <QuestionText>What step type do you want to start with?</QuestionText>
            <StepOptions setSelectedSteps={setSelectedSteps} />
          </>
        ) : (
          <StepsPreview step={stepToPreview} />
        )}
      </PreviewContainer>
      <StepOptionsModal
        setSelectedSteps={setSelectedSteps}
        setModalOpen={setShowStepsModal}
        modalOpen={showStepsModal}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 0 2em;
`;

const StepCardsContainer = styled.div``;

const StepCardContainer = styled.div`
  width: fit-content;
`;

const StepsContainer = styled.div`
  width: 40%;
  // padding-right: 1em;
  // max-width: 320px;
`;

const PreviewContainer = styled.div`
  width: 60%;
  // padding-left: 1em;
  // max-width: 640px;
`;

const SectionHeader = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
  display: inline-block;
  margin-bottom: 1em;
`;

const QuestionText = styled.span`
  font-size: 20px;
  color: ${props => props.theme.colors.black};
  display: block;
  margin-bottom: 1em;
  margin-top: 1em;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddStepText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
`;

const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;
