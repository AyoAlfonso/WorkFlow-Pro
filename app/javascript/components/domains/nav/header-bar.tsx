import * as React from "react";
import { HomeContainerBorders } from "../home/shared-components";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { Icon } from "../../shared/icon";
import { baseTheme } from "../../../themes";
import { color } from "styled-system";
import { RoundButton } from "../../shared/round-button";
import { Flex } from "rebass";
import { Avatar } from "../../shared/avatar";
import { useMst } from "../../../setup/root";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { Text } from "../../shared/text";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const HeaderBar = (): JSX.Element => {
  const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
  const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
  const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
  const [showAccountActions, setShowAccountActions] = useState<boolean>(false);

  const { sessionStore } = useMst();
  const dropdownRef = useRef(null);
  const accountActionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCreateDropdown(false);
        setOpenLynchPynDropdown(false);
      }
      if (accountActionRef.current && !accountActionRef.current.contains(event.target)) {
        setShowAccountActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  const { t } = useTranslation();

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

  const renderActionDropdown = (): JSX.Element => {
    return showAccountActions ? (
      <ActionDropdownContainer>
        <AccountOption>
          <Link to="/account" style={{ textDecoration: "none" }}>
            <AccountOptionText>{t("profile.account")}</AccountOptionText>
          </Link>
        </AccountOption>
        <AccountOption>
          <AccountOptionText onClick={() => sessionStore.logoutRequest()}>
            {t("profile.logout")}
          </AccountOptionText>
        </AccountOption>
      </ActionDropdownContainer>
    ) : (
      <></>
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
              rotate={openCreateDropdown}
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

        <PersonalInfoContainer ref={accountActionRef}>
          <PersonalInfoDisplayContainer onClick={() => setShowAccountActions(!showAccountActions)}>
            <Avatar
              firstName={sessionStore.profile.firstName}
              lastName={sessionStore.profile.lastName}
              avatarUrl={sessionStore.profile.avatarUrl}
            />
            <ProfileActionContainer>
              <ProfileFirstName>{sessionStore.profile.firstName}</ProfileFirstName>
              <IconContainer>
                <ProfileDropdownIcon
                  icon={"Chevron-Down"}
                  size={15}
                  iconColor={baseTheme.colors.primary100}
                />
              </IconContainer>
            </ProfileActionContainer>
          </PersonalInfoDisplayContainer>
          {renderActionDropdown()}
        </PersonalInfoContainer>
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
  width: 85%;
  margin-left: 168px;
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

const ProfileFirstName = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  font-size: 16px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
`;

const IconContainer = styled.div`
  margin-left: 12px;
  margin-top: 2px;
`;

const ProfileDropdownIcon = styled(Icon)``;

const ProfileActionContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.backgroundBlue};
  padding-left: 24px;
  padding-right: 16px;
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
  margin-left: -10px;
  z-index: -1;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 15px;
    border-radius: 0 50% 50% 0;
    background-color: white;
  }
`;

const PersonalInfoDisplayContainer = styled.div`
  display: flex;
  cursor: pointer;
  &:hover ${ProfileActionContainer} {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${ProfileFirstName} {
    color: ${props => props.theme.colors.white};
  }
  &:hover ${ProfileDropdownIcon} {
    color: ${props => props.theme.colors.white};
  }
`;

const PersonalInfoContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 24px;
`;

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.backgroundBlue};
  width: 120px;
  margin-left: 50px;
  margin-top: -5px;
`;

const AccountOptionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const AccountOption = styled.div`
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${AccountOptionText} {
    color: white;
  }
`;
