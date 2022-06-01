import * as React from "react";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { Icon } from "~/components/shared";

interface TodoComponentSelectorModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoComponentSelectorModal = ({
  modalOpen,
  setModalOpen,
}: TodoComponentSelectorModalProps): JSX.Element => {
  const todoList = [
    "Today's Priorities",
    "Weekly List",
    "Weekly List + Key Results",
    "Weekly List + Master List",
    "Today's Priorities + Weekly List",
    "Outstanding ToDos",
  ];

  return (
    <StyledModal isOpen={modalOpen} onBackgroundClick={() => setModalOpen(false)}>
      <Container>
        <HeaderContainer>
          <HeaderText>Select a step type</HeaderText>
          <IconContainer onClick={() => setModalOpen(false)}>
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
          <ToDoComponentContainer key={`option-${index}`}>
            <TodosText>{todo}</TodosText>
          </ToDoComponentContainer>
        ))}
      </Container>
    </StyledModal>
  );
};

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
