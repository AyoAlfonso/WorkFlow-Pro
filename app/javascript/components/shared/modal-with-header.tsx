import * as React from "react";
import Modal from "styled-react-modal";
import styled from "styled-components";
import { Heading } from "./heading";
import { Icon } from "./icon";

interface IModalWithHeaderProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
  centerHeader?: boolean;
  subHeaderText?: string;
  children: any;
  width?: string;
  height?: string;
  overflow?: string;
  padding?: string;
  boxSizing?: string;
  onCloseAction?: any;
  headerMarginTop?: string;
  headerMarginBottom?: string;
  onClose?: () => void;
}

export const ModalWithHeader = ({
  modalOpen,
  setModalOpen,
  headerText,
  centerHeader,
  children,
  overflow,
  padding,
  boxSizing,
  subHeaderText,
  onCloseAction,
  headerMarginTop,
  headerMarginBottom,
  onClose,
  width,
  height
}: IModalWithHeaderProps): JSX.Element => {
  return (
    <StyledModal
      isOpen={modalOpen}
      style={{
        width,
        overflow,
        padding,
        boxSizing,
        height
      }}
    >
      <HeaderContainer>
        <RowWrapper>
          <StyledHeading
            mt={headerMarginTop}
            mb={headerMarginBottom}
            type={"h3"}
            centerHeader={centerHeader}
            color={"black"}
            fontSize={"16px"}
          >
            {headerText}
          </StyledHeading>
          <CloseIconContainer
            centerHeader={centerHeader}
            onClick={() => {
              setModalOpen(false);
              onClose();
              if (onCloseAction) {
                onCloseAction();
              }
            }}
          >
            <StyledIcon icon={"Close"} size={18} />
          </CloseIconContainer>
        </RowWrapper>
        {subHeaderText && (
          <RowWrapper>
            <SubHeaderText>{subHeaderText}</SubHeaderText>
          </RowWrapper>
        )}
      </HeaderContainer>
      {children}
    </StyledModal>
  );
};

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey60};
`;

const StyledModal = Modal.styled`
  width: ${props => props.width || "30rem"};
  height: ${props => props.overflow || "auto"};
  min-height: 100px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.white};
  max-height: 660px;
  overflow: ${props => props.width || "auto"};
`;

const HeaderContainer = styled.div`
  border-bottom ${props => `1px solid ${props.theme.colors.grey20}`};
`;

type CloseIconContainerProps = {
  centerHeader?: boolean;
};

const CloseIconContainer = styled.div<CloseIconContainerProps>`
  margin-left: ${props => (props.centerHeader ? "0px" : "auto")};
  margin-right: 16px;
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
  &:hover ${StyledIcon} {
    color: ${props => props.theme.colors.greyActive};
  }
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 16px;
`;

const SubHeaderText = styled.p`
  color: ${props => props.theme.colors.grey100};
  font-size: 12px;
  margin-top: 0;
`;

type StyledHeadingProps = {
  centerHeader?: boolean;
  mt?: string;
  mb?: string;
};

const StyledHeading = styled(Heading)<StyledHeadingProps>`
  font-family: Lato;
  margin-top: ${props => props.mt || "16px"};
  margin-bottom: ${props => props.mb || "16px"};
  font-weight: bold;
  margin-left: ${props => (props.centerHeader ? "auto" : "0px")};
  margin-right: ${props => (props.centerHeader ? "auto" : "0px")};
`;
