import { observer } from "mobx-react";
import * as R from "ramda";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../shared/avatar";
import { Icon } from "../../shared/icon";
import { Heading, Text } from "../../shared";
import { Button } from "~/components/shared/button";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { IssuesBody } from "../issues/issues-body";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { InviteUserModal } from "~/components/shared/invite-user-modal";
import { AccountDropdownOptions } from "./top-nav/account-dropdown-options";
import { InviteYourTeamModal } from "../account/users/invite-your-team-modal";
import { PulseSelectorWrapper } from "./top-nav/pulse-selector-wrapper";
import { HeaderText } from "~/utils/header-text";
import { baseTheme } from "~/themes";
import { getWeekOf } from "~/utils/date-time";
import { MobileAccountDropdownOptions } from "./top-nav/mobile-account-dropdown-options";

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
    const [showSideNav, setShowSideNav] = useState<boolean>(false);
    const [showProfileNav, setShowProfileNav] = useState<boolean>(false);

    const { sessionStore, companyStore } = useMst();
    const accountActionRef = useRef(null);
    const { t } = useTranslation();
    const history = useHistory();

    const mobileNavMenuRef = useRef(null);
    const profileNavRef = useRef(null);

    const userId = sessionStore.profile.id;
    const issuesTitle =
      companyStore?.company?.displayFormat === "Forum" ? t("issues.myHub") : t("issues.issues");

    const location = useLocation();

    useEffect(() => {
      companyStore.load();
    }, [companyStore.company]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showSideNav) return;

        const node = mobileNavMenuRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowSideNav(false);
      };

      if (showSideNav) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showSideNav]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showProfileNav) return;

        const node = profileNavRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowProfileNav(false);
      };

      if (showProfileNav) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showProfileNav]);

    const locationPath = location.pathname.split("/");

    const renderUserAvatar = (size = 48) => {
      return (
        <Avatar
          firstName={sessionStore.profile.firstName}
          lastName={sessionStore.profile.lastName}
          defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
          avatarUrl={sessionStore.profile.avatarUrl}
          size={size}
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
              <PopupHeaderText>ToDos</PopupHeaderText>
              <CloseIconContainer onClick={() => setShowKeyActivities(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey60"} />
              </CloseIconContainer>
            </PopupHeaderContainer>
            <KeyActivitiesContainer>
              <KeyActivitiesBody showAllKeyActivities={false} borderLeft={"none"} />
            </KeyActivitiesContainer>
          </KeyActivitiesPopupContainer>
        )
      );
    };

    const renderIssuesPopup = (): JSX.Element => {
      return (
        showIssues && (
          <IssuesPopupContainer>
            <PopupHeaderContainer>
              <PopupHeaderText> {issuesTitle}</PopupHeaderText>
              <CloseIconContainer onClick={() => setShowIssues(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey60"} />
              </CloseIconContainer>
            </PopupHeaderContainer>
            <IssuesContainer>
              <IssuesBody
                showOpenIssues={showOpenIssues}
                setShowOpenIssues={setShowOpenIssues}
                noShadow
              />
            </IssuesContainer>
          </IssuesPopupContainer>
        )
      );
    };

    return (
      <Wrapper>
        <Container>
          <ContentWrapper>
            <HeaderItemsContainer>
              <MobileLeftContainer>
                <BurgerIconContainer
                  showBackground={showSideNav}
                  onClick={() => {
                    setShowProfileNav(false);
                    setShowSideNav(!showSideNav);
                  }}
                >
                  {" "}
                  <Icon icon={showSideNav ? "Close" : "Burger"} size={"24px"} iconColor={"white"} />
                </BurgerIconContainer>
                <LynchpynLogoContainer onClick={() => history.push("/")}>
                  <img color="white" src={"/assets/LynchPyn-Logo_Favicon_White"} width="32"></img>
                </LynchpynLogoContainer>
              </MobileLeftContainer>
              <ActionsContainer>
                <StyledHeading type={"h1"}>
                  <HeaderText location={location} />
                </StyledHeading>
                {locationPath[1] === "check-in" && locationPath[2] !== "insights" && (
                  <CheckInButtonContainer>
                    <Button
                      variant="primary"
                      style={{ display: "flex" }}
                      onClick={() => history.push("/check-in/templates")}
                      width="max-content"
                      small
                    >
                      <Icon icon={"Plus"} size={"16px"} iconColor={"white"} mr="0.5em" />
                      New Check-in
                    </Button>
                  </CheckInButtonContainer>
                )}
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
                    {`${t<string>("keyActivities.name")}s`}
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
                    {issuesTitle}
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
                  <DesktopAvatar>{renderUserAvatar(48)}</DesktopAvatar>
                </PersonalInfoDisplayContainer>
                {renderKeyActivitiesPopup()}
                {renderIssuesPopup()}
                {renderActionDropdown()}
              </PersonalInfoContainer>

              <MobileAvatar
                onClick={() => {
                  setShowSideNav(false);
                  setShowProfileNav(!showProfileNav);
                }}
              >
                {renderUserAvatar(32)}
              </MobileAvatar>
            </HeaderItemsContainer>
            {/* {showSideNav && ( */}
            <MobileNavMenu showSideNav={showSideNav} ref={mobileNavMenuRef}>
              <MobileMenuOption
                showSideNav={showSideNav}
                onClick={() => {
                  history.push("/");
                  setShowSideNav(false);
                }}
              >
                <Icon
                  icon={"Planner"}
                  mr="1em"
                  size={"24px"}
                  iconColor={baseTheme.colors.primary100}
                />
                Planner
              </MobileMenuOption>
              <MobileMenuOption
                showSideNav={showSideNav}
                onClick={() => {
                  history.push(`/goals`);

                  setShowSideNav(false);
                }}
              >
                <Icon
                  icon={"New-Goals"}
                  mr="1em"
                  size={"24px"}
                  iconColor={baseTheme.colors.primary100}
                />
                Objectives
              </MobileMenuOption>
              <MobileMenuOption
                showSideNav={showSideNav}
                onClick={() => {
                  history.push(`/weekly-check-in/${userId}/${getWeekOf()}`);

                  setShowSideNav(false);
                }}
              >
                <Icon
                  icon={"Check-in-page"}
                  mr="1em"
                  size={"24px"}
                  iconColor={baseTheme.colors.primary100}
                />
                Check-In
              </MobileMenuOption>
            </MobileNavMenu>
            <MobileProfileNav showProfileNav={showProfileNav} ref={profileNavRef}>
              <MobileAccountDropdownOptions
                accountActionRef={accountActionRef}
                setShowAccountActions={setShowAccountActions}
                setInviteTeamModalOpen={setInviteTeamModalOpen}
                setShowProfileNav={setShowProfileNav}
              />
            </MobileProfileNav>

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
          </ContentWrapper>
        </Container>
      </Wrapper>
    );
  },
);

const StyledHeading = styled(Heading)`
  margin-top: auto;
  margin-bottom: auto;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
    color: white;
    margin-left: 1em;
    margin-right: 1em;
    width: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

type MobileNavMenuProps = {
  showSideNav: boolean;
};

const MobileNavMenu = styled.div<MobileNavMenuProps>`
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.white};
  z-index: 2;
  width: ${props => (props.showSideNav ? "85vw" : "0")};
  position: fixed;
  padding-top: 40px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  left: 0;
  display: none;
  margin-top: 5px;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

type MobileProfileNavProps = {
  showProfileNav: boolean;
};

const MobileProfileNav = styled.div<MobileProfileNavProps>`
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.white};
  z-index: 2;
  width: ${props => (props.showProfileNav ? "85vw" : "0")};
  position: fixed;
  padding-top: 40px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  right: 0;
  display: none;
  margin-top: 10px;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuOption = styled.div<MobileNavMenuProps>`
  font-size: 14px;
  align-items: center;
  padding: 5px 30px;
  margin-bottom: 0.5em;
  top: 0;
  left: 0;
  display: ${props => (props.showSideNav ? "flex" : "none")};
  width: 70vw;
  transition: 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

type BurgerIconContainerProps = {
  showBackground: boolean;
};

const BurgerIconContainer = styled.div<BurgerIconContainerProps>`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
    background: ${props => (props.showBackground ? "#41639c" : "")};
    padding: 0.3125em;
    border-radius: 4px;
  }
`;

const LynchpynLogoContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
  @media only screen and (max-width: 360px) {
    left: 2.6em;
  }
`;

const DesktopAvatar = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileAvatar = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
    width: 20%;
  }
`;

const HeaderItemsContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 768px) {
    padding: 0 1em;
  }
`;

const Container = styled.div`
  height: 64px;
  width: 100%;
  border-bottom: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  @media only screen and (max-width: 768px) {
    height: 40px;
    border-bottom: 0px;
  }
`;

const ContentWrapper = styled.div`
  padding-top: 0.5em;
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
    height: 60px;
    align-items: center;
    background-color: ${props => props.theme.colors.mipBlue};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  margin-left: 40px;
  @media only screen and (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    max-width: 60%;
    display: flex;
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
  width: 320px;
  height: 438px;
  padding: 16px;
  padding-top: 0px;
  margin-left: -160px;
  margin-top: 60px;
  background: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const IssuesCon = styled.div``;

const PopupHeaderContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 10px;
  padding-right: 10px;
  height: 65px;
  align-items: center;
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
  width: 320px;
  height: 438px;
  padding: 16px;
  padding-top: 0px;
  margin-top: 60px;
  margin-left: -240px;
  background-color: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
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

const KeyActivitiesContainer = styled.div`
  overflow-y: auto;
  height: 380px;
  overflow-x: hidden;
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
    display: none;
    pointer-events: none;
  }
`;

const CloseIconContainer = styled.div`
  margin-left: auto;
  cursor: pointer;
`;

const IssuesContainer = styled.div`
  overflow-y: auto;
  height: 380px;
  overflow-x: hidden;
`;

const MobileLeftContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    width: 20%;
    display: flex;
  }
`;

const CheckInButtonContainer = styled.div`
  margin-left: 32px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
