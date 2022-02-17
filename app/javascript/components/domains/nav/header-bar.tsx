import { observer } from "mobx-react";
import * as R from "ramda";
import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../shared/avatar";
import { Icon } from "../../shared/icon";
import { Heading, Text } from "../../shared";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { IssuesBody } from "../issues/issues-body";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { InviteUserModal } from "~/components/shared/invite-user-modal";
import { AccountDropdownOptions } from "./top-nav/account-dropdown-options";
import { InviteYourTeamModal } from "../account/users/invite-your-team-modal";
import { PulseSelectorWrapper } from "./top-nav/pulse-selector-wrapper";
import { HeaderText } from "~/utils/header-text";

declare global {
  interface Window {
    FreshworksWidget: any;
    Productstash: {
      show: any;
    };
  }
}

export const HeaderBar = observer(
  (): JSX.Element => {
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showAccountActions, setShowAccountActions] = useState<boolean>(false);
    const [inviteUserModalOpen, setInviteUserModalOpen] = useState<boolean>(false);
    const [showCompanyOptions, setShowCompanyOptions] = useState<boolean>(false);
    const [inviteTeamModalOpen, setInviteTeamModalOpen] = useState<boolean>(false);
    const [showKeyActivities, setShowKeyActivities] = useState<boolean>(false);
    const [showIssues, setShowIssues] = useState<boolean>(false);
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

    const { sessionStore, companyStore } = useMst();
    const accountActionRef = useRef(null);
    useEffect(() => {
      companyStore.load();
    }, [companyStore.company]);
    const location = useLocation();
    const { t } = useTranslation();

    const renderUserAvatar = () => {
      return (
        <Avatar
          firstName={sessionStore.profile.firstName}
          lastName={sessionStore.profile.lastName}
          defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
          avatarUrl={sessionStore.profile.avatarUrl}
        />
      );
    };

    const renderActionDropdown = (): JSX.Element => {
      return (
        showAccountActions && (
          <AccountDropdownOptions
            accountActionRef={accountActionRef}
            setShowAccountActions={setShowAccountActions}
            showCompanyOptions={showCompanyOptions}
            setShowCompanyOptions={setShowCompanyOptions}
            setInviteTeamModalOpen={setInviteTeamModalOpen}
          />
        )
      );
    };

    const renderKeyActivitiesPopup = (): JSX.Element => {
      return (
        showKeyActivities && (
          <KeyActivitiesPopupContainer>
            <PopupHeaderContainer>
              <PopupHeaderText>Pyns</PopupHeaderText>
            </PopupHeaderContainer>
            <KeyActivitiesBody showAllKeyActivities={false} borderLeft={"none"} />
          </KeyActivitiesPopupContainer>
        )
      );
    };

    const renderIssuesPopup = (): JSX.Element => {
      return (
        showIssues && (
          <IssuesPopupContainer>
            <PopupHeaderContainer>
              <PopupHeaderText>Issues</PopupHeaderText>
            </PopupHeaderContainer>
            <IssuesBody
              showOpenIssues={showOpenIssues}
              setShowOpenIssues={setShowOpenIssues}
              noShadow
            />
          </IssuesPopupContainer>
        )
      );
    };
    return (
      <Wrapper>
        <Container>
          <HeaderItemsContainer>
            <LynchpynLogoContainer>
              <img src={"/assets/LynchPyn-Logo-Blue_300x300"} width="48"></img>
            </LynchpynLogoContainer>
            <ActionsContainer>
              <StyledHeading type={"h1"}>
                <HeaderText location={location} />
              </StyledHeading>
            </ActionsContainer>
            <PersonalInfoContainer ref={accountActionRef}>
              <KeyActivitiesButtonContainer>
                <KeyActivitiesButton
                  onClick={() => {
                    setShowKeyActivities(!showKeyActivities);
                    setShowIssues(false);
                    setShowAccountActions(false);
                    setShowCompanyOptions(false);
                    setCreateIssueModalOpen(false);
                    setCreateKeyActivityModalOpen(false);
                  }}
                >
                  Pyns
                </KeyActivitiesButton>
              </KeyActivitiesButtonContainer>
              <IssuesButtonContainer>
                <IssuesButton
                  onClick={() => {
                    setShowIssues(!showIssues);
                    setShowKeyActivities(false);
                    setShowAccountActions(false);
                    setShowCompanyOptions(false);
                    setCreateIssueModalOpen(false);
                    setCreateKeyActivityModalOpen(false);
                  }}
                >
                  {companyStore?.company?.displayFormat == "Forum"
                    ? t("issues.forumHub")
                    : t("issues.myHub")}
                </IssuesButton>
              </IssuesButtonContainer>
              <PulseSelectorWrapper
                onClick={() => {
                  setShowKeyActivities(false);
                  setShowIssues(false);
                  setShowAccountActions(false);
                  setShowCompanyOptions(false);
                  setCreateIssueModalOpen(false);
                  setCreateKeyActivityModalOpen(false);
                }}
              />
              <PersonalInfoDisplayContainer
                onClick={() => {
                  setShowAccountActions(!showAccountActions);
                  setShowKeyActivities(false);
                  setShowIssues(false);
                  setShowCompanyOptions(false);
                  setCreateIssueModalOpen(false);
                  setCreateKeyActivityModalOpen(false);
                }}
              >
                {renderUserAvatar()}
              </PersonalInfoDisplayContainer>
              {renderKeyActivitiesPopup()}
              {renderIssuesPopup()}
              {renderActionDropdown()}
            </PersonalInfoContainer>
          </HeaderItemsContainer>

          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
          />
          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            defaultSelectedGroupId={sessionStore.getScheduledGroupIdByName("Weekly List")}
          />
          {inviteUserModalOpen && (
            <InviteUserModal
              inviteUserModalOpen={inviteUserModalOpen}
              setInviteUserModalOpen={setInviteUserModalOpen}
            />
          )}

          <InviteYourTeamModal
            modalOpen={inviteTeamModalOpen}
            setModalOpen={setInviteTeamModalOpen}
          />
        </Container>
      </Wrapper>
    );
  },
);

const StyledHeading = styled(Heading)`
  margin-top: auto;
  margin-bottom: auto;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const LynchpynLogoContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
    margin-left: 16px;
  }
`;

const HeaderItemsContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  height: 64px;
  border-bottom: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: white;
  height: 64px;
  margin-left: 96px;
  position: fixed;
  z-index: 3;
  width: -moz-available;
  width: -webkit-fill-available;
  width: fill-available;
  @media only screen and (max-width: 768px) {
    margin-left: 0px;
    display: flex;
    align-items: center;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  margin-left: 40px;
  @media only screen and (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ProfileFirstName = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  font-size: 16px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
`;

const ProfileDropdownIcon = styled(Icon)`
  color: ${props => props.theme.colors.primary100};
`;

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

const IssuesButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 24px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const IssuesPopupContainer = styled.div`
  position: absolute;
  width: 268px;
  height: 438px;
  padding: 16px;
  padding-top: 0px;
  margin-left: -160px;
  margin-top: 60px;
  background: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const PopupHeaderContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 10px;
  padding-right: 10px;
  height: 65px;
`;

const PopupHeaderText = styled.h4`
  margin-bottom: auto;
  margin-top: auto;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
`;

const KeyActivitiesPopupContainer = styled.div`
  position: absolute;
  width: 268px;
  height: 438px;
  padding: 16px;
  padding-top: 0px;
  margin-top: 60px;
  margin-left: -240px;
  background-color: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;
const KeyActivitiesButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 24px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const KeyActivitiesButton = styled.div`
  color: ${props => props.theme.colors.primary100};
  font-weight: bold;
  display: flex;
  padding: 4px;
  border-radius: 5px;
  &:hover {
    background: ${props => props.theme.colors.primary20};
    cursor: pointer;
  }
`;

const IssuesButton = styled.div`
  color: ${props => props.theme.colors.primary100};
  font-weight: bold;
  display: flex;
  padding: 4px;
  border-radius: 5px;
  &:hover {
    background: ${props => props.theme.colors.primary20};
    cursor: pointer;
  }
`;

const PersonalInfoContainer = styled.div`
  padding-right: 24px;
  display: flex;
  right: 0;
  @media only screen and (max-width: 768px) {
    padding-right: 0px;
    margin-right: 16px;
    pointer-events: none;
  }
`;
