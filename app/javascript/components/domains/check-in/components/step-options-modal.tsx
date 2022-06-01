import * as React from "react";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { Icon } from "~/components/shared";
import { StepOptions } from "./step-options";

interface StepOptionsModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<any>>>;
}

export const StepOptionsModal = ({
  modalOpen,
  setModalOpen,
  setSelectedSteps,
}: StepOptionsModalProps): JSX.Element => {
  return (
    <StyledModal isOpen={modalOpen} onBackgroundClick={() => setModalOpen(false)}>
      <Container>
        <HeaderContainer>
          <HeaderText>Select a step type</HeaderText>
          <IconContainer onClick={() => setModalOpen(false)}>
            <Icon icon={"Close"} size={"14px"} iconColor={"grey80"} />
          </IconContainer>
        </HeaderContainer>
        <StepOptions setShowStepsModal={setModalOpen} setSelectedSteps={setSelectedSteps} />
      </Container>
    </StyledModal>
  );
};

const StyledModal = Modal.styled`
  width: 700px;
  border-radius: 16px;
  height: 95%;
  overflow: auto;
  background-color: ${props => props.theme.colors.white};
`;

const Container = styled.div`
  padding: 1em;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
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
