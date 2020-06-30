import * as React from "react";
import { HomeContainerBorders } from "../home/shared-components";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { Icon } from "../../shared/Icon";
import { baseTheme } from "../../../themes";
import { color } from "styled-system";
import { RoundButton } from "../../shared/Round-Button";
import { Flex, Box } from "rebass";
import { useMst } from "../../../setup/root";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { Text } from "../../shared/Text";

export const HeaderBar = (): JSX.Element => {
  const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
  const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
  const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
  const { sessionStore } = useMst();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCreateDropdown(false);
        setOpenLynchPynDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
        <SelectionContainer
          onClick={() => {
            setCreateIssueModalOpen(true);
            setOpenCreateDropdown(false);
          }}
        >
          <SelectionIconContainer>
            <SelectionIcon
              icon={"Alert"}
              size={20}
              iconColor={baseTheme.colors.white}
              disableFill={true}
            />
          </SelectionIconContainer>
          <SelectionText style={{ marginTop: 0, marginBottom: 0 }}>Add Issue</SelectionText>
        </SelectionContainer>
        <SelectionContainer
          onClick={() => {
            setCreateKeyActivityModalOpen(true);
            setOpenCreateDropdown(false);
          }}
        >
          <SelectionIconContainer>
            <SelectionIcon
              icon={"Tasks"}
              size={20}
              iconColor={baseTheme.colors.white}
              disableFill={true}
            />
          </SelectionIconContainer>
          <SelectionText style={{ marginTop: 0, marginBottom: 0 }}>Create Task</SelectionText>
        </SelectionContainer>

        <SelectionContainer>
          <SelectionIconContainer>
            <SelectionIcon
              icon={"New-User"}
              size={20}
              iconColor={baseTheme.colors.white}
              disableFill={true}
            />
          </SelectionIconContainer>
          <SelectionText style={{ marginTop: 0, marginBottom: 0 }}>Send Invite</SelectionText>
        </SelectionContainer>
      </DropdownContainer>
    );
  };

  return (
    <Container>
      <Flex>
        <ActionsContainer>
          <RefContainer ref={dropdownRef}>
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
          </RefContainer>
          <RoundButton
            style={{ marginLeft: "12px", zIndex: openLynchPynDropdown ? 2 : 0 }}
            backgroundColor={openLynchPynDropdown ? "white" : "primary100"}
            onClick={() => setOpenLynchPynDropdown(!openLynchPynDropdown)}
          >
            {renderHeaderIcon("Logo")}
          </RoundButton>
        </ActionsContainer>
        <Box mx="auto" />
        <button onClick={() => sessionStore.logoutRequest()}>Logout</button>
      </Flex>
      <CreateIssueModal
        createIssueModalOpen={createIssueModalOpen}
        setCreateIssueModalOpen={setCreateIssueModalOpen}
      />
      <CreateKeyActivityModal
        createKeyActivityModalOpen={createKeyActivityModalOpen}
        setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
      />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-top: 40px;
  height: 80px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
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
`;

const SelectionText = styled(Text)``;

const RefContainer = styled.div`
  display: flex;
`;

const SelectionIcon = styled(Icon)``;

const SelectionContainer = styled.div`
  ${color}
  display: flex;
  color: white;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 15px;
  &:hover {
    cursor: pointer;
    background-color: white;
    color: primary100;
  }

  &:hover ${SelectionText} {
    color: ${props => props.theme.colors.primary100};
  }

  &:hover ${SelectionIcon} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const SelectionIconContainer = styled.div`
  width: 30px;
`;
