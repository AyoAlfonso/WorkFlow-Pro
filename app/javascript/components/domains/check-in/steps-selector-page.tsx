import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Icon, TextDiv } from "~/components/shared";
import { StepOptions } from "./components/step-options";
import { StepOptionsModal } from "./components/step-options-modal";
import { StepPreviewCard } from "./components/step-preview-card";
import { TodoComponentSelectorModal } from "./components/todo-component-selector-modal";
import { widgetArray } from "./data/step-data";
import { StepsPreview } from "./steps-preview";
import { Droppable, DragDropContext } from "react-beautiful-dnd";

export interface SelectedStepType {
  stepType: string;
  name: string;
  iconName: string;
  question?: string;
  instructions: string;
  orderIndex: number;
  componentToRender: string;
  variant?: string;
}

interface StepsSelectorPageProps {
  selectedSteps: Array<SelectedStepType>;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<SelectedStepType>>>;
  disabled?: boolean;
}

export const StepsSelectorPage = ({
  selectedSteps,
  setSelectedSteps,
  disabled,
}: StepsSelectorPageProps): JSX.Element => {
  const [showStepsModal, setShowStepsModal] = useState<boolean>(false);
  const [stepToPreview, setStepToPreview] = useState<SelectedStepType>({
    stepType: "",
    name: "",
    iconName: "",
    instructions: "",
    question: "",
    componentToRender: "",
    orderIndex: 0,
  });
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [todoModalOpen, setTodoModalOpen] = useState<boolean>(false);
  const todoStep = widgetArray.find(step => step.name === "ToDos");

  useEffect(() => {
    setStepToPreview(selectedSteps[selectedSteps.length - 1]);
  }, [selectedSteps.length]);

  const deleteStep = step => {
    if (disabled) return
    let orderIndex = 0;
    const filteredSteps = selectedSteps.filter(s => s.orderIndex !== step.orderIndex);
    const updatedSelectedSteps = filteredSteps.map(newStep => {
      orderIndex += 1;
      return {
        ...newStep,
        orderIndex,
      };
    });
    setSelectedSteps(updatedSelectedSteps);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result, selectedSteps, setSelectedSteps) => {
    let orderIndex = 0;
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    const items = reorder(selectedSteps, source.index, destination.index);
    const updatedSelectedSteps = items.map(newStep => {
      orderIndex += 1;
      return {
        ...(newStep as SelectedStepType),
        orderIndex,
      };
    });
    setSelectedSteps(updatedSelectedSteps);
  };

  return (
    <DragDropContext onDragEnd={result => onDragEnd(result, selectedSteps, setSelectedSteps)}>
      <Container>
        <StepsSection>
          <SectionHeader>Steps</SectionHeader>
          <StepsContainer>
            <Droppable droppableId="StepPreviewCardsContainer" type="StepPreviewCard">
              {provided => (
                <StepCardsContainer {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedSteps.map((step, index) => (
                    <StepPreviewCard
                      key={step.orderIndex}
                      deleteStep={() => deleteStep(step)}
                      step={step}
                      setShowStepsModal={setShowStepsModal}
                      setIsChanging={setIsChanging}
                      setSelectedSteps={setSelectedSteps}
                      selectedSteps={selectedSteps}
                      selected={
                        stepToPreview?.question === step.question &&
                        step.instructions == stepToPreview?.instructions
                      }
                      handleClick={() => setStepToPreview(step)}
                      index={index}
                      disabled={disabled}
                    />
                  ))}
                  {provided.placeholder}
                </StepCardsContainer>
              )}
            </Droppable>
            {!disabled && (
              <StyledButton small variant={"grey"} onClick={() => setShowStepsModal(true)}>
                <CircularIcon icon={"Plus"} size={"12px"} />
                <AddStepText> Add Step </AddStepText>
              </StyledButton>
            )}
          </StepsContainer>
        </StepsSection>
        <PreviewContainer>
          <SectionHeader>Preview</SectionHeader>
          {!selectedSteps.length ? (
            <>
              <QuestionText>What step type do you want to start with?</QuestionText>
              <StepOptions
                setTodoModalOpen={setTodoModalOpen}
                setSelectedSteps={setSelectedSteps}
              />
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
          setStepToPreview={setStepToPreview}
          setTodoModalOpen={setTodoModalOpen}
        />
        <TodoComponentSelectorModal
          step={todoStep}
          setSelectedSteps={setSelectedSteps}
          todoModalOpen={todoModalOpen}
          setTodoModalOpen={setTodoModalOpen}
          stepToPreview={stepToPreview}
          isChanging={isChanging}
          setIsChanging={setIsChanging}
          selectedSteps={selectedSteps}
        />
      </Container>
    </DragDropContext>
  );
};

const Container = styled.div`
  display: flex;
  gap: 0 2em;
`;

const StepCardsContainer = styled.div`
  margin: 0 1px;
`;

const StepsSection = styled.div`
  width: 40%;
  // padding-right: 1em;
  min-width: 320px;
  display: flex;
  flex-direction: column;
`;

const StepsContainer = styled.div`
  flex: 1;
  // overflow-y: scroll;
`

const PreviewContainer = styled.div`
  width: 60%;
  min-width: 500px;
  // padding-left: 1em;
  // max-width: 640px;
  // flex: 1;
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
