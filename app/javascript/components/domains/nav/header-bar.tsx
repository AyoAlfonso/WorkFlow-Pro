import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "../../../setup/root";
import { baseTheme } from "../../../themes";
import { Avatar } from "../../shared/avatar";
import { Icon } from "../../shared/icon";
import { RoundButton } from "../../shared/round-button";
import { Text } from "../../shared/text";
import { HomeContainerBorders } from "../home/shared-components";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { InviteUserModal } from "~/components/shared/invite-user-modal";
import { toJS } from "mobx";

export const HeaderBar = observer(
  (): JSX.Element => {
    const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
    const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showAccountActions, setShowAccountActions] = useState<boolean>(false);
    const [inviteUserModalOpen, setInviteUserModalOpen] = useState<boolean>(false);
    const [showCompanyOptions, setShowCompanyOptions] = useState<boolean>(false);

    const { sessionStore, companyStore, meetingStore, userStore } = useMst();
    const dropdownRef = useRef(null);
    const lynchPynDropdownRef = useRef(null);
    const accountActionRef = useRef(null);

    const history = useHistory();
    const location = useLocation();

    const userCanInvite =
      sessionStore.profile.role == RoleAdministrator || sessionStore.profile.role == RoleCEO;

    useEffect(() => {
      const handleClickOutside = event => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpenCreateDropdown(false);
        }
        if (accountActionRef.current && !accountActionRef.current.contains(event.target)) {
          setShowAccountActions(false);
          setShowCompanyOptions(false);
        }
        if (lynchPynDropdownRef.current && !lynchPynDropdownRef.current.contains(event.target)) {
          setOpenLynchPynDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownRef, lynchPynDropdownRef]);
    const { t } = useTranslation();

    const parsedProfile = toJS(sessionStore.profile);

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
              setCreateKeyActivityModalOpen(true);
              setOpenCreateDropdown(false);
            }}
          >
            <SelectionIconContainer>
              <SelectionIcon icon={"Tasks"} size={20} disableFill={true} />
            </SelectionIconContainer>
            <SelectionText>Pyn</SelectionText>
          </SelectionContainer>

          <SelectionContainer
            onClick={() => {
              setCreateIssueModalOpen(true);
              setOpenCreateDropdown(false);
            }}
          >
            <SelectionIconContainer>
              <SelectionIcon icon={"Alert"} size={20} disableFill={true} />
            </SelectionIconContainer>
            <SelectionText>Issue</SelectionText>
          </SelectionContainer>

          <SelectionContainer
            disabled={!userCanInvite}
            onClick={() => {
              if (userCanInvite) {
                setInviteUserModalOpen(true);
                setOpenCreateDropdown(false);
              } else {
                showToast("You are not permitted to invite new users", ToastMessageConstants.ERROR);
              }
            }}
          >
            <SelectionIconContainer>
              <SelectionIcon icon={"New-User"} size={20} disableFill={true} />
            </SelectionIconContainer>
            <SelectionText>Invite</SelectionText>
          </SelectionContainer>
        </DropdownContainer>
      );
    };

    const renderLynchPynDropdownModal = () => {
      return (
        <DropdownContainer width={"230px"} height={"50px"}>
          <SelectionContainer
            paddingBottom={"10px"}
            disabled={false}
            onClick={() => {
              companyStore.company.displayFormat === "Company" ? (
                meetingStore.createPersonalMeeting().then(({ meeting }) => {
                  if (!R.isNil(meeting)) {
                    history.push(`/personal_planning/${meeting.id}`);
                  } else {
                    showToast("Failed to start meeting.", ToastMessageConstants.ERROR);
                  }
                })
              ) : (
                meetingStore.createPersonalMonthlyMeeting().then(({ meeting }) => {
                  if (!R.isNil(meeting)) {
                    history.push(`/personal_planning/${meeting.id}`);
                  } else {
                    showToast("Failed to start meeting.", ToastMessageConstants.ERROR);
                  }
                })
              )
            }}
          >
            <SelectionText>
              {
                companyStore.company.displayFormat === "Company" ? 
                  "Weekly Planning" : 
                  "Monthly Planning"
              }
              </SelectionText>
          </SelectionContainer>
        </DropdownContainer>
      );
    };

    const renderCompanyOptions = (): Array<JSX.Element> => {
      return parsedProfile.companyProfiles.map((company, index) => {
        return (
          <AccountOption
            key={index}
            onClick={() => {
              if (parsedProfile.defaultSelectedCompanyId != company.id) {
                userStore
                  .updateUser({ id: parsedProfile.id, defaultSelectedCompanyId: company.id })
                  .then(() => {
                    if (location.pathname !== "/") {
                      history.replace("/");
                    }
                    window.location.reload();
                  });
              } else {
                setShowAccountActions(false);
                setShowCompanyOptions(false);
                showToast(`You are already on ${company.name}`, ToastMessageConstants.INFO);
              }
            }}
          >
            <SwitchAccountContainer>
              <AccountOptionText>{company.name}</AccountOptionText>
            </SwitchAccountContainer>
          </AccountOption>
        );
      });
    };

    const renderSwitchCompanyOptions = (): JSX.Element => {
      if (parsedProfile.companyProfiles.length > 1) {
        return (
          <AccountOption>
            <AccountOptionText onClick={() => setShowCompanyOptions(!showCompanyOptions)}>
              {t("profile.switchCompanies")}
            </AccountOptionText>
          </AccountOption>
        );
      }
    };

    const renderActionDropdown = (): JSX.Element => {
      return showAccountActions ? (
        <ActionDropdownContainer>
          <AccountOption>
            <Link to="/account" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("profile.account")}</AccountOptionText>
            </Link>
          </AccountOption>
          <AccountOption>
            <Link to="/journals" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("journals.headerNavTitle")}</AccountOptionText>
            </Link>
          </AccountOption>
          <AccountOption>
            <Link to="/notes" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("notes.headerNavTitle")}</AccountOptionText>
            </Link>
          </AccountOption>
          {renderSwitchCompanyOptions()}
          <AccountOption>
            <AccountOptionText onClick={() => sessionStore.logoutRequest()}>
              {t("profile.logout")}
            </AccountOptionText>
          </AccountOption>
          {showCompanyOptions && (
            <CompanyDropdownContainer>{renderCompanyOptions()}</CompanyDropdownContainer>
          )}
        </ActionDropdownContainer>
      ) : (
        <></>
      );
    };

    return (
      <Wrapper>
        <Container>
          <HeaderItemsContainer>
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
              <RefContainer ref={lynchPynDropdownRef}>
                <RoundButton
                  style={{ marginLeft: "12px", zIndex: openLynchPynDropdown ? 2 : 0 }}
                  backgroundColor={openLynchPynDropdown ? "white" : "primary100"}
                  onClick={() => {
                    setOpenLynchPynDropdown(!openLynchPynDropdown);
                    setOpenCreateDropdown(false);
                  }}
                  rotate={openLynchPynDropdown}
                  rotation={60}
                >
                  {renderHeaderIcon("Plan")}
                </RoundButton>
                {openLynchPynDropdown && renderLynchPynDropdownModal()}
              </RefContainer>
            </ActionsContainer>
            <LogoContainer>
              {R.isNil(companyStore.company) ? (
                <></>
              ) : companyStore.company.logoUrl ? (
                <LogoImage src={`${companyStore.company.logoUrl}`} />
              ) : (
                <Text>{companyStore.company.name}</Text>
              )}
            </LogoContainer>
            <PersonalInfoContainer ref={accountActionRef}>
              <PersonalInfoDisplayContainer
                onClick={() => {
                  setShowAccountActions(!showAccountActions);
                  setShowCompanyOptions(false);
                }}
              >
                <Avatar
                  firstName={sessionStore.profile.firstName}
                  lastName={sessionStore.profile.lastName}
                  defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
                  avatarUrl={sessionStore.profile.avatarUrl}
                />
                <ProfileActionContainer>
                  <ProfileFirstName>{sessionStore.profile.firstName}</ProfileFirstName>
                  <IconContainer>
                    <ProfileDropdownIcon icon={"Chevron-Down"} size={15} />
                  </IconContainer>
                </ProfileActionContainer>
              </PersonalInfoDisplayContainer>
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
            defaultTypeAsWeekly={true}
          />
          {inviteUserModalOpen && (
            <InviteUserModal
              inviteUserModalOpen={inviteUserModalOpen}
              setInviteUserModalOpen={setInviteUserModalOpen}
            />
          )}
        </Container>
      </Wrapper>
    );
  },
);

const LogoContainer = styled.div`
  display: flex;
  margin: auto;
`;

const LogoImage = styled.img`
  width: auto;
  height: auto;
  max-height: 70px;
`;

const HeaderItemsContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled(HomeContainerBorders)`
  height: 80px;
`;

const Wrapper = styled.div`
  background-color: white;
  padding-top: 16px;
  margin-left: 136px;
  margin-top: -20px;
  height: 90px;
  position: fixed;
  z-index: 3;
  width: -webkit-fill-available;
  padding-right: 38px;
`;

const ActionsContainer = styled.div`
  display: flex;
  padding-left: 10px;
`;

type DropdownContainerType = {
  width?: string;
  height?: string;
};

const DropdownContainer = styled.div<DropdownContainerType>`
  ${color}
  width: ${props => props.width || "170px"};
  height: ${props => props.height || "120px"};
  background-color: ${props => props.theme.colors.primary100};
  z-index: 1;
  position: absolute;
  margin-top: -5px;
  margin-left: 5px;
  border-radius: 10px;
  border-top-left-radius: 25px;
  padding-top: 60px;
`;

const SelectionText = styled(Text)`
  margin-left: 8px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const RefContainer = styled.div`
  display: flex;
`;

const SelectionIcon = styled(Icon)`
  color: white;
`;

type SelectionContainerType = {
  paddingBottom?: string;
  disabled?: boolean;
};

const SelectionContainer = styled.div<SelectionContainerType>`
  ${color}
  display: flex;
  padding-top: 10px;
  padding-bottom: ${props => props.paddingBottom || "5px"};
  padding-left: 15px;

  color: ${props => (props.disabled ? props.theme.colors.grey40 : "white")};
  &:hover {
    cursor: pointer;
    background-color: white;
    color: primary100;
  }

  &:hover ${SelectionText} {
    color: ${props => (props.disabled ? props.theme.colors.grey40 : props.theme.colors.primary100)};
  }

  &:hover ${SelectionIcon} {
    color: ${props => (props.disabled ? props.theme.colors.grey40 : props.theme.colors.primary100)};
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

const PersonalInfoContainer = styled.div`
  padding-right: 24px;
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
  display: flex;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${AccountOptionText} {
    color: white;
  }
`;

const CompanyDropdownContainer = styled(ActionDropdownContainer)`
  margin-left: -120px;
  margin-top: -80px;
  margin-right: 0;
`;

const SwitchAccountContainer = styled.div``;
