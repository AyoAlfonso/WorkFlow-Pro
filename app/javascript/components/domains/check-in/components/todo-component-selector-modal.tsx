import * as React from "react";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Icon } from "~/components/shared";
import { StepCardProps } from "../data/step-data";
import { SelectedStepType } from "../steps-selector-page";

interface TodoComponentSelectorModalProps {
  todoModalOpen: boolean;
  setTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  step?: StepCardProps;
  setSelectedSteps?: React.Dispatch<React.SetStateAction<Array<SelectedStepType>>>;
  stepToPreview?: SelectedStepType;
  setIsChanging?: React.Dispatch<React.SetStateAction<boolean>>;
  isChanging?: boolean;
  selectedSteps?: Array<SelectedStepType>;
}

export const TodoComponentSelectorModal = observer(({
  todoModalOpen,
  setTodoModalOpen,
  step,
  setSelectedSteps,
  stepToPreview,
  setIsChanging,
  isChanging,
  selectedSteps,
}: TodoComponentSelectorModalProps): JSX.Element => {
  const { companyStore } = useMst();
  const isKeyResults = companyStore.company?.objectivesKeyType === "KeyResults";

  const todoList = [
    "Today's Priorities",
    "Weekly List",
    `Weekly List + ${isKeyResults ? "Key Results" : "Milestones"}`,
    "Weekly List + Master List",
    "Today's Priorities + Weekly List",
    "Outstanding ToDos",
  ];

  return (
    <StyledModal isOpen={todoModalOpen} onBackgroundClick={() => setTodoModalOpen(false)}>
      <Container>
        <HeaderContainer>
          <HeaderText>Select a step type</HeaderText>
          <IconContainer onClick={() => setTodoModalOpen(false)}>
            <Icon icon={"Close"} size={"14px"} iconColor={"grey80"} />
          </IconContainer>
        </HeaderContainer>
        <DescriptionContainer>
          <Icon icon={"Tasks"} mr="0.5em" size={"64px"} iconColor={"primary100"} />
          <DescriptionTextContainer>
            <TodosText>ToDos</TodosText>
            <DescriptionText>
              Pick from any of the ToDo components to play your day/week
            </DescriptionText>
          </DescriptionTextContainer>
        </DescriptionContainer>
        {todoList.map((todo, index) => (
          <ToDoComponentContainer
            onClick={() => {
              if (isChanging) {
                const steps = selectedSteps;
                const stepIndex = steps.findIndex(step => step.orderIndex == stepToPreview.orderIndex);
                steps[stepIndex].stepType = step.stepName;
                steps[stepIndex].iconName = step.iconName;
                steps[stepIndex].variant = todo;
                setSelectedSteps(steps);
                setIsChanging(false);
                setTodoModalOpen(false);
              } else {
                setSelectedSteps(steps => [
                  ...steps,
                  {
                    stepType: step.stepName,
                    iconName: step.iconName,
                    variant: todo,
                    orderIndex: steps.length + 1,
                  },
                ]);
                setTodoModalOpen(false);
              }
            }}
            key={`option-${index}`}
          >
            <TodosText>{todo}</TodosText>
          </ToDoComponentContainer>
        ))}
      </Container>
    </StyledModal>
  );
});

const StyledModal = Modal.styled`
  width: 700px;
  border-radius: 16px;
  overflow: auto;
  background-color: ${props => props.theme.colors.white};
`;

const Container = styled.div`
  padding: 1em;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const HeaderText = styled.span`
  font-size: 20px;
  color: ${props => props.theme.colors.black};
  font-weight: bold;
  font-family: Exo;
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const DescriptionContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
`;

const DescriptionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TodosText = styled.span`
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  color: ${props => props.theme.colors.black};
`;

const DescriptionText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.black};
  margin-top: 0.5em;
`;

const ToDoComponentContainer = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0px 3px 6px #00000029;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGrey};
  }
`;
