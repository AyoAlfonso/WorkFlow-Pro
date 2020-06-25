import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";
import { useState } from "react";
import Icon from "../../shared/Icon";
import { baseTheme } from "../../../themes";
import { color } from "styled-system";
import { RoundButton } from "../../shared/Round-Button";

export const HomeHeaderBar = (): JSX.Element => {
  const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
  const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);

  const renderHeaderIcon = (iconName: string) => {
    const dropdownValue = iconName == "Plus" ? openCreateDropdown : openLynchPynDropdown;
    return (
      <Icon
        icon={iconName}
        size={20}
        iconColor={dropdownValue ? baseTheme.colors.primary100 : baseTheme.colors.white}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      />
    );
  };

  const renderCreateDropdownModal = () => {
    return (
      <DropdownContainer>
        <SelectionContainer>
          <SelectionIconContainer>
            <Icon icon={"Alert"} size={20} iconColor={baseTheme.colors.white} disableFill={true} />
          </SelectionIconContainer>
          <SelectionTextContainer>Add Issue</SelectionTextContainer>
        </SelectionContainer>
        <SelectionContainer>
          <SelectionIconContainer>
            <Icon icon={"Tasks"} size={20} iconColor={baseTheme.colors.white} disableFill={true} />
          </SelectionIconContainer>
          Create Task
        </SelectionContainer>

        <SelectionContainer>
          <SelectionIconContainer>
            <Icon
              icon={"New-User"}
              size={20}
              iconColor={baseTheme.colors.white}
              disableFill={true}
            />
          </SelectionIconContainer>
          Send Invite
        </SelectionContainer>
      </DropdownContainer>
    );
  };

  return (
    <Container>
      <ActionsContainer>
        <RoundButton
          style={{ marginLeft: "12px", zIndex: openCreateDropdown ? 2 : 0 }}
          backgroundColor={openCreateDropdown ? "white" : "primary100"}
          onClick={() => {
            setOpenLynchPynDropdown(false);
            setOpenCreateDropdown(!openCreateDropdown);
          }}
        >
          {renderHeaderIcon("Plus")}
        </RoundButton>
        {openCreateDropdown && renderCreateDropdownModal()}
        <RoundButton
          style={{ marginLeft: "12px", zIndex: openLynchPynDropdown ? 2 : 0 }}
          backgroundColor={openLynchPynDropdown ? "white" : "primary100"}
          onClick={() => setOpenLynchPynDropdown(!openLynchPynDropdown)}
        >
          {renderHeaderIcon("Logo")}
        </RoundButton>
      </ActionsContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-top: 40px;
  height: 80px;
`;

const ActionsContainer = styled.div`
  margin: 20px;
  display: flex;
`;

const DropdownContainer = styled.div`
  ${color}
  width: 170px;
  height: 120px;
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
  margin-top: 10px;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const SelectionIconContainer = styled.div`
  width: 30px;
`;
const SelectionTextContainer = styled.div``;
