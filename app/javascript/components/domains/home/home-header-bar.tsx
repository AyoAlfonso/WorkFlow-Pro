import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";

export const HomeHeaderBar = (): JSX.Element => {
  const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
  const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);

  const renderHeaderIcon = (iconName: string) => {
    const dropdownValue = iconName == "Plus" ? openCreateDropdown : openLynchPynDropdown;
    return (
      <Icon
        icon={iconName}
        size={20}
        color={dropdownValue ? baseTheme.colors.primary100 : baseTheme.colors.white}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      />
    );
  };

  const renderCreateDropdownModal = () => {
    return (
      <DropdownContainer>
        <SelectionContainer>
          <SelectionIconContainer></SelectionIconContainer>
          <SelectionTextContainer>Add Issue</SelectionTextContainer>
        </SelectionContainer>
        <SelectionContainer>Create Task</SelectionContainer>

        <SelectionContainer>Send Invite</SelectionContainer>
      </DropdownContainer>
    );
  };

  return (
    <Container>
      <ActionsContainer>
        <IconContainer
          backgroundColor={openCreateDropdown ? "white" : "primary100"}
          zIndex={openCreateDropdown ? 2 : 1}
          onClick={() => setOpenCreateDropdown(!openCreateDropdown)}
        >
          {renderHeaderIcon("Plus")}
        </IconContainer>
        {openCreateDropdown && renderCreateDropdownModal()}
        <IconContainer
          backgroundColor={openLynchPynDropdown ? "white" : "primary100"}
          onClick={() => setOpenLynchPynDropdown(!openLynchPynDropdown)}
        >
          {renderHeaderIcon("")}
        </IconContainer>
      </ActionsContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-top: 40px;
  height: 40px;
`;

type IconContainerType = {
  backgroundColor?: string;
  zIndex?: number;
};

const IconContainer = styled.div<IconContainerType>`
  ${color}
  height: 40px;
  width: 40px;
  border-radius: 50px;
  box-shadow: 0px 2px rgba(0, 0, 0, 0.2);
  margin-left: 12px;
  z-index: ${props => props.zIndex};
  &:hover {
    cursor: pointer;
  }
`;

const DropdownContainer = styled.div`
  ${color}
  width: 170px;
  height: 160px;
  background-color: ${props => props.theme.colors.primary100};
  z-index: 1;
  position: absolute;
  margin-top: -5px;
  margin-left: 5px;
  border-radius: 10px;
  border-top-left-radius: 25px;
  padding-top: 60px;
  padding-left: 15px;
`;

const SelectionContainer = styled.div`
  ${color}
  display: flex;
  color: white;
`;

const SelectionIconContainer = styled.div`
  width: 20px;
`;
const SelectionTextContainer = styled.div``;
