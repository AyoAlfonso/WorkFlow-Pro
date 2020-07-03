import * as React from "react";
import Modal from "styled-react-modal";
import styled from "styled-components";
import { Heading } from "./heading";
import { Icon } from "./icon";

interface IModalWithHeaderProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
  children: any;
  width?: string;
}

export const ModalWithHeader = (props: IModalWithHeaderProps): JSX.Element => {
  const { modalOpen, setModalOpen, headerText, children, width } = props;

  return (
    <StyledModal isOpen={modalOpen} style={{ width: width || "30rem" }}>
      <HeaderContainer>
        <Heading type={"h4"} color={"primary100"} m={3} mb={2}>
          {headerText}
        </Heading>
        <CloseIconContainer onClick={() => setModalOpen(false)}>
          <Icon icon={"Close"} size={18} iconColor="grey60" />
        </CloseIconContainer>
      </HeaderContainer>
      {...children}
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
