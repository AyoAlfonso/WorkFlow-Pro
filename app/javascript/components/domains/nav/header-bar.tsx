import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Avatar } from "../../shared/avatar";
import { Icon } from "../../shared/icon";
import { Heading, Text } from "../../shared";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { InviteUserModal } from "~/components/shared/invite-user-modal";
import { toJS } from "mobx";
import * as moment from "moment";
import {
  emotionA,
  emotionB,
  emotionC,
  emotionD,
  emotionE,
} from "~/components/shared/pulse/pulse-icon";
import { baseTheme } from "~/themes";

declare global {
  interface Window {
    FreshworksWidget: any;
  }
}

export const HeaderBar = observer(
  (): JSX.Element => {
    const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
    const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showAccountActions, setShowAccountActions] = useState<boolean>(false);
    const [inviteUserModalOpen, setInviteUserModalOpen] = useState<boolean>(false);
    const [showCompanyOptions, setShowCompanyOptions] = useState<boolean>(false);
    const [showCompanyCreationSelector, setShowCompanyCreationSelector] = useState<boolean>(false);

    const { sessionStore, companyStore, meetingStore, userStore, teamStore } = useMst();
    const dropdownRef = useRef(null);
    const lynchPynDropdownRef = useRef(null);
    const accountActionRef = useRef(null);

    const history = useHistory();
    const location = useLocation();

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
    const { onboardingCompany } = companyStore;

    console.log("location", location);

    console.log("location pathname splitte", location.pathname.split("/"));

    const locationPath = location.pathname.split("/");
    const subPath = locationPath[2];

    const getGreetingTime = currentTime => {
      const splitAfternoon = 12; // 24hr time to split the afternoon
      const splitEvening = 18; // 24hr time to split the evening
      const currentHour = parseFloat(currentTime.format("HH"));
      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        return "Good Afternoon";
      } else if (currentHour >= splitEvening) {
        return "Good Evening";
      }
      return "Good Morning";
    };

    const renderHeaderTitle = () => {
      console.log("location ");

      switch (locationPath[1]) {
        case "team":
        case "forum":
          return `${teamStore.currentTeam.name} Overview`;
        case "company":
          if (subPath == "accountability") {
            return "Accountability Matrix";
          } else if (subPath == "strategic_plan") {
            return `The ${companyStore.company.name} Plan`;
          }
          return "";
        case "meetings":
          switch (subPath) {
            case "section_1":
              return "Annual Hub";
            case "section_2":
              return "Upcoming Hub";
            case "agenda":
              return "Meeting Management";
            default:
              return "";
          }
        case "goals":
          return "Goals";
        case "account":
          return "Account Settings";
        case "notes":
          return "Notes";
        case "journals":
          return "Journal Entries";
        default:
          return `${getGreetingTime(moment())} ${sessionStore.profile.firstName}`;
      }
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
          <AccountOptionText onClick={() => setShowCompanyOptions(!showCompanyOptions)}>
            {t("profile.switchCompanies")}
          </AccountOptionText>
        );
      }
    };

    const renderShowHelpdesk = (): JSX.Element => {
      return (
        <AccountOptionText
          onClick={() => {
            window.FreshworksWidget("open");
            setShowAccountActions(false);
          }}
        >
          Help
        </AccountOptionText>
      );
    };

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

    const renderCompanyCreationSelector = (): JSX.Element => {
      const displayFormat = R.path(["displayFormat"], onboardingCompany);
      return (
        showCompanyCreationSelector && (
          <CompanyCreationSelectionContainer>
            {!displayFormat ? (
              <>
                <CreationOption onClick={() => companyStore.openOnboardingModal("Company")}>
                  <CreationSelectionText>{t("company.newCompany")}</CreationSelectionText>
                </CreationOption>
                <CreationOption onClick={() => companyStore.openOnboardingModal("Forum")}>
                  <CreationSelectionText>{t("company.newForum")}</CreationSelectionText>
                </CreationOption>
              </>
            ) : displayFormat === "Company" ? (
              <CreationOption onClick={() => companyStore.openOnboardingModal("Company")}>
                <CreationSelectionText>{t("company.newCompany")}</CreationSelectionText>
              </CreationOption>
            ) : (
              <CreationOption onClick={() => companyStore.openOnboardingModal("Forum")}>
                <CreationSelectionText>{t("company.newForum")}</CreationSelectionText>
              </CreationOption>
            )}
          </CompanyCreationSelectionContainer>
        )
      );
    };

    const renderActionDropdown = (): JSX.Element => {
      return showAccountActions ? (
        <ActionDropdownContainer>
          <DropdownSectionContainer>
            <UserDetailsContainer>
              <UserDetailsAvatarContainer>{renderUserAvatar()}</UserDetailsAvatarContainer>
              <UserDetailsNameContainer>
                <Heading type={"h4"} mt={"0px"} mb={"8px"}>
                  {`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}
                </Heading>
                <StatusContainer>
                  <StatusColorBlock />
                  <StatusText> Active </StatusText>
                </StatusContainer>
              </UserDetailsNameContainer>
            </UserDetailsContainer>
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <Link to="/account" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText color={baseTheme.colors.primary100}>
                {t("profile.growthPlan")}
              </AccountOptionText>
            </Link>
            <Link to="/account" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("profile.accountSettings")}</AccountOptionText>
            </Link>
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <WorkspaceContainer>
              <LeftWorkspaceContainer>
                {renderSwitchCompanyOptions()}
                <CompanyText> {companyStore.company.name} </CompanyText>
              </LeftWorkspaceContainer>
              <RightWorkspaceContainer>
                <Icon icon={"Chevron-Left"} size={"15px"} iconColor={"grey80"} />
              </RightWorkspaceContainer>
            </WorkspaceContainer>
            {showCompanyOptions && (
              <CompanyDropdownContainer>{renderCompanyOptions()}</CompanyDropdownContainer>
            )}
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <Link to="/journals" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("journals.headerNavTitle")}</AccountOptionText>
            </Link>
            <Link to="/notes" style={{ textDecoration: "none", padding: "0" }}>
              <AccountOptionText>{t("notes.headerNavTitle")}</AccountOptionText>
            </Link>
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <AccountOptionText color={baseTheme.colors.finePine}> Invite Users </AccountOptionText>
            <AccountOptionText id="lynchpyn-whats-new">What's New? </AccountOptionText>
            {renderShowHelpdesk()}
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <AccountOptionText
              onMouseEnter={() => {
                setShowCompanyCreationSelector(true);
              }}
              onMouseLeave={() => {
                setShowCompanyCreationSelector(false);
              }}
            >
              {!R.isNil(onboardingCompany) ? t("company.edit") : t("company.create")}
            </AccountOptionText>
            {renderCompanyCreationSelector()}
          </DropdownSectionContainer>

          <StyledDivider />

          <DropdownSectionContainer>
            <AccountOptionText
              color={baseTheme.colors.warningRed}
              onClick={() => sessionStore.logoutRequest()}
            >
              {t("profile.logout")}
            </AccountOptionText>
          </DropdownSectionContainer>
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
              <StyledHeading type={"h1"}>{renderHeaderTitle()}</StyledHeading>
            </ActionsContainer>
            <LogoContainer>
              {R.isNil(companyStore.company) ? (
                <></>
              ) : companyStore.company.logoUrl ? (
                <>
                  <LogoImage src={`${companyStore.company.logoUrl}`} />
                </>
              ) : (
                <StyledHeading type={"h1"}>{companyStore.company.name}</StyledHeading>
              )}
            </LogoContainer>
            <PersonalInfoContainer ref={accountActionRef}>
              <MoodSelectorContainer>{emotionC()}</MoodSelectorContainer>
              <PersonalInfoDisplayContainer
                onClick={() => {
                  setShowAccountActions(!showAccountActions);
                  setShowCompanyOptions(false);
                }}
              >
                {renderUserAvatar()}
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
  max-height: 60px;
`;

const StyledHeading = styled(Heading)`
  margin-top: auto;
  margin-bottom: auto;
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
`;

const Wrapper = styled.div`
  background-color: white;
  height: 64px;
  margin-left: 96px;
  position: fixed;
  z-index: 3;
  width: -webkit-fill-available;
`;

const ActionsContainer = styled.div`
  display: flex;
  padding-left: 16px;
  position: fixed;
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

const PersonalInfoContainer = styled.div`
  padding-right: 24px;
  position: fixed;
  display: flex;
  right: 0;
`;

const ActionDropdownContainer = styled.div`
  position: absolute;
  width: 256px;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-left: -160px;
  margin-top: 60px;
  background-color: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

type AccountOptionTextProps = {
  color?: string;
};

const AccountOptionText = styled(Text)<AccountOptionTextProps>`
  color: ${props => props.color || "black"};
  font-size: 14px;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 8px;
  padding-bottom: 8px;
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

const CreationSelectionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  &:hover {
    color: white;
  }
`;

const CreationOption = styled.div`
  display: flex;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${CreationSelectionText} {
    color: white;
  }
`;

const CompanyDropdownContainer = styled(ActionDropdownContainer)`
  margin-left: -130px;
  margin-top: -180px;
  margin-right: 0;
`;

const SwitchAccountContainer = styled.div``;

const CompanyCreationSelectionContainer = styled.div`
  position: absolute;
  right: 130px;
  top: 0;
  width: 130px;
  color: ${({ theme: { colors } }) => colors.primary100};
  background-color: ${({ theme: { colors } }) => colors.backgroundBlue};
`;

const MoodSelectorContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
`;

const DropdownSectionContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

const UserDetailsContainer = styled.div`
  display: flex;
`;

const UserDetailsAvatarContainer = styled.div`
  margin-bottom: 8px;
`;

const StatusContainer = styled.div`
  display: flex;
`;

const StatusColorBlock = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.finePine};
`;

const UserDetailsNameContainer = styled.div`
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: auto;
`;

const StatusText = styled(Text)`
  font-size: 11px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.greyActive};
  margin-left: 8px;
`;

const StyledDivider = styled.hr`
  margin-top: 8px;
  margin-bottom: 8px;
  border-top: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
`;

const CompanyText = styled(Text)`
  font-size: 11px;
  margin-top: auto;
  color: ${props => props.theme.colors.greyActive};
`;

const WorkspaceContainer = styled.div`
  display: flex;
`;

const LeftWorkspaceContainer = styled.div``;

const RightWorkspaceContainer = styled.div`
  transform: rotate(180deg);
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;
