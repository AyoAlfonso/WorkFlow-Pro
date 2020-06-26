import * as React from "react";
import Modal from "styled-react-modal";
import styled from "styled-components";
import { Heading } from "./Heading";
import { Icon } from "./Icon";

interface IModalWithHeaderProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
}

export const ModalWithHeader = (props: IModalWithHeaderProps): JSX.Element => {
  const { modalOpen, setModalOpen, headerText } = props;

  return (
    <StyledModal isOpen={modalOpen}>
      <HeaderContainer>
        <Heading type={"h4"} color={"primary100"} m={3} mb={2}>
          {headerText}
        </Heading>
        <CloseIconContainer onClick={() => setModalOpen(false)}>
          <Icon icon={"Close"} size={18} iconColor="grey60" />
        </CloseIconContainer>
      </HeaderContainer>
    </StyledModal>
  );
};

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.white};
`;

const HeaderContainer = styled.div`
  border-bottom ${props => `1px solid ${props.theme.colors.grey20}`};
  display: flex;
  flex-direction: row;
`;

const CloseIconContainer = styled.div`
  margin-left: auto;
  margin-right: 16px;
  margin-top: 14px;
  cursor: pointer;
`;
