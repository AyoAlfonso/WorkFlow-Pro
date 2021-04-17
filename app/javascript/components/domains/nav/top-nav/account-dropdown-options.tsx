import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { toJS } from "mobx";
import { baseTheme } from "~/themes";
import { useMst } from "~/setup/root";
import { Avatar, Heading, Icon, Text } from "~/components/shared";
import { homePersonalStatusOptions } from "~/components/domains/home/home-personal-status/home-personal-status-options";
import { UserStatus } from "~/components/shared/user-status";

interface IAccountDropdownOptionsProps {
  accountActionRef: any;
  setShowAccountActions: any;
  showCompanyOptions: boolean;
  setShowCompanyOptions: any;
  setInviteTeamModalOpen: any;
}

export const AccountDropdownOptions = observer(
  ({
    accountActionRef,
    setShowAccountActions,
    showCompanyOptions,
    setShowCompanyOptions,
    setInviteTeamModalOpen,
  }: IAccountDropdownOptionsProps): JSX.Element => {
    const { sessionStore, companyStore, meetingStore, userStore, teamStore } = useMst();
    const { onboardingCompany } = companyStore;

    const [showCompanyCreationSelector, setShowCompanyCreationSelector] = useState<boolean>(false);
    const [selectedUserStatus, setSelectedUserStatus] = useState<string>(
      R.path(["profile", "currentDailyLog", "workStatus"], sessionStore),
    );

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
      const handleClickOutside = event => {
        if (accountActionRef.current && !accountActionRef.current.contains(event.target)) {
          setShowAccountActions(false);
          setShowCompanyOptions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const { t } = useTranslation();

    const parsedProfile = toJS(sessionStore.profile);

    const renderCompanyOptions = (): Array<JSX.Element> => {
      return parsedProfile.companyProfiles.map((company, index) => {
        return (
          <SwitchAccountContainer
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
            <CurrentCompanyCheckboxContainer>
              {companyStore.company.id == company.id && (
                <Icon icon={"Checkmark"} size={"15px"} iconColor={"primary100"} />
              )}
            </CurrentCompanyCheckboxContainer>
            <AccountOptionText>{company.name}</AccountOptionText>
            {company.id == sessionStore.profile.defaultSelectedCompanyId && (
              <DefaultTextContainer>
                <DefaultText type={"small"}> Default </DefaultText>
              </DefaultTextContainer>
            )}
          </SwitchAccountContainer>
        );
      });
    };

    const updateStatus = async status => {
      setSelectedUserStatus(status);
      await sessionStore.updateUser(
        {
          dailyLogsAttributes: [
            {
              ...R.path(["profile", "currentDailyLog"], sessionStore),
              workStatus: status,
            },
          ],
        },
        `You successfully changed your status to ${R.path(
          [status, "label"],
          homePersonalStatusOptions,
        )}`,
      );
    };

    const renderUserStatus = (): JSX.Element => {
      return <UserStatus selectedUserStatus={selectedUserStatus} onStatusUpdate={updateStatus} />;
    };

    const renderSwitchCompanyOptions = (): JSX.Element => {
      if (parsedProfile.companyProfiles.length > 1) {
        return <AccountOptionText>{t("profile.switchCompanies")}</AccountOptionText>;
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

    return (
      <Container>
        <DropdownSectionContainer>
          <UserDetailsContainer>
            <UserDetailsAvatarContainer>{renderUserAvatar()}</UserDetailsAvatarContainer>
            <UserDetailsNameContainer>
              <Heading type={"h4"} mt={"0px"} mb={"8px"}>
                {`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}
              </Heading>
              {renderUserStatus()}
            </UserDetailsNameContainer>
          </UserDetailsContainer>
        </DropdownSectionContainer>

        <StyledDivider />

        <DropdownSectionContainer>
          <Link to="/account" style={{ textDecoration: "none", padding: "0" }}>
            <AccountOptionText
              color={baseTheme.colors.primary100}
              onClick={() => setShowAccountActions(false)}
            >
              {t("profile.growthPlan")}
            </AccountOptionText>
          </Link>
          <Link to="/account" style={{ textDecoration: "none", padding: "0" }}>
            <AccountOptionText onClick={() => setShowAccountActions(false)}>
              {t("profile.accountSettings")}
            </AccountOptionText>
          </Link>
        </DropdownSectionContainer>

        <StyledDivider />

        <DropdownSectionContainer>
          <WorkspaceContainer
            onClick={() => {
              setShowCompanyOptions(!showCompanyOptions);
            }}
          >
            <LeftWorkspaceContainer>
              {renderSwitchCompanyOptions()}
              <CompanyText type={"small"}>
                {" "}
                {R.path(["name", "company"], companyStore)}{" "}
              </CompanyText>
            </LeftWorkspaceContainer>
            <RightWorkspaceContainer>
              <Icon icon={"Chevron-Left"} size={"15px"} iconColor={"grey80"} />
            </RightWorkspaceContainer>
          </WorkspaceContainer>
          {showCompanyOptions && (
            <CompanyDropdownContainer>
              <DropdownSectionContainer>{renderCompanyOptions()}</DropdownSectionContainer>
            </CompanyDropdownContainer>
          )}
        </DropdownSectionContainer>

        <StyledDivider />

        <DropdownSectionContainer>
          <Link to="/journals" style={{ textDecoration: "none", padding: "0" }}>
            <AccountOptionText onClick={() => setShowAccountActions(false)}>
              {t("journals.headerNavTitle")}
            </AccountOptionText>
          </Link>
          <Link to="/notes" style={{ textDecoration: "none", padding: "0" }}>
            <AccountOptionText onClick={() => setShowAccountActions(false)}>
              {t("notes.headerNavTitle")}
            </AccountOptionText>
          </Link>
        </DropdownSectionContainer>

        <StyledDivider />

        <DropdownSectionContainer>
          <AccountOptionText
            color={baseTheme.colors.finePine}
            onClick={() => {
              setInviteTeamModalOpen(true);
              setShowAccountActions(false);
            }}
          >
            Invite Users
          </AccountOptionText>
          <AccountOptionText id="lynchpyn-whats-new">What's New? </AccountOptionText>
          {renderShowHelpdesk()}
        </DropdownSectionContainer>

        <StyledDivider />

        <DropdownSectionContainer>
          <AccountOptionText
            onClick={() => {
              setShowCompanyCreationSelector(!showCompanyCreationSelector);
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
      </Container>
    );
  },
);

const Container = styled.div`
  position: absolute;
  width: 256px;
  padding-top: 16px;
  padding-bottom: 8px;
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

const CreationSelectionText = styled(Text)`
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const CreationOption = styled.div`
  display: flex;
`;

const CompanyDropdownContainer = styled(Container)`
  margin-left: -264px;
  margin-top: -16px;
  margin-right: 0;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 256px;
`;

const SwitchAccountContainer = styled.div`
  display: flex;
`;

const CompanyCreationSelectionContainer = styled(Container)`
  margin-left: -264px;
  margin-top: -16px;
  margin-right: 0;
  padding-top: 8px;
  padding-bottom: 8px;
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
  &: hover {
    cursor: pointer;
  }
`;

type StatusColorBlockProps = {
  color: string;
};

const StatusColorBlock = styled.div<StatusColorBlockProps>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const UserDetailsNameContainer = styled.div`
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: auto;
`;

const StatusText = styled(Text)`
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
  margin-top: auto;
  color: ${props => props.theme.colors.greyActive};
`;

const WorkspaceContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

const LeftWorkspaceContainer = styled.div``;

const RightWorkspaceContainer = styled.div`
  transform: rotate(180deg);
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const CurrentCompanyCheckboxContainer = styled.div`
  width: 16px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
`;

const DefaultTextContainer = styled.div`
  margin-left: auto;
`;

const DefaultText = styled(Text)`
  font-style: italic;
`;
