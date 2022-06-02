import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button, Icon, TextDiv } from "~/components/shared";
import { StepOptions } from "./components/step-options";
import { StepOptionsModal } from "./components/step-options-modal";
import { StepPreviewCard } from "./components/step-preview-card";
import { StepsPreview } from "./steps-preview";

export interface SelectedStepType {
  stepType: string;
  iconName: string;
  question?: string;
  position: number;
}

export const StepsSelectorPage = (): JSX.Element => {
  const [selectedSteps, setSelectedSteps] = useState<Array<SelectedStepType>>([]);
  const [showStepsModal, setShowStepsModal] = useState<boolean>(false);
  const [stepToPreview, setStepToPreview] = useState<SelectedStepType>();
  const [isChanging, setIsChanging] = useState<boolean>(false);

  const deleteStep = step => {
    let position = 0;
    const filteredSteps = selectedSteps.filter(s => s.position !== step.position);
    const updatedSelectedSteps = filteredSteps.map(newStep => {
      position += 1;
      return {
        ...newStep,
        position,
      };
    });
    setSelectedSteps(updatedSelectedSteps);
  };

  return (
    <Container>
      <StepsContainer>
        <SectionHeader>Steps</SectionHeader>
        <StepCardsContainer>
          {selectedSteps.map(step => (
            <StepCardContainer key={step.position} onClick={() => setStepToPreview(step)}>
              <StepPreviewCard
                deleteStep={() => deleteStep(step)}
                step={step}
                setShowStepsModal={setShowStepsModal}
                setIsChanging={setIsChanging}
                setSelectedSteps={setSelectedSteps}
                selectedSteps={selectedSteps}
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
        isChanging={isChanging}
        setIsChanging={setIsChanging}
        stepToPreview={stepToPreview}
        selectedSteps={selectedSteps}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 0 2em;
`;

const StepCardsContainer = styled.div`
  margin: 0 1px;
`;

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
