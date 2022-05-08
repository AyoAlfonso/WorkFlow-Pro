import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { toJS } from "mobx";
import { baseTheme } from "~/themes";
import { useMst } from "~/setup/root";
import { Avatar, Heading, Icon, Text } from "~/components/shared";
import { homePersonalStatusOptions } from "~/components/domains/home/home-personal-status/home-personal-status-options";
import { UserStatus } from "~/components/shared/user-status";

interface IMobileAccountDropdownOptionsProps {
  accountActionRef: any;
  setShowAccountActions: any;
  setInviteTeamModalOpen: any;
  setShowProfileNav: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileAccountDropdownOptions = observer(
  ({
    accountActionRef,
    setShowAccountActions,
    setInviteTeamModalOpen,
    setShowProfileNav,
  }: IMobileAccountDropdownOptionsProps): JSX.Element => {
    const { sessionStore, companyStore, userStore } = useMst();

    const [showMobileCompanyOptions, setShowMobileCompanyOptions] = useState<boolean>(false);
    const [selectedUserStatus, setSelectedUserStatus] = useState<string>(
      R.path(["profile", "currentDailyLog", "workStatus"], sessionStore),
    );

    const history = useHistory();
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

    const parsedProfile = toJS(sessionStore.profile);

    const renderWorkspaceDisplay = () => {
      if (parsedProfile.companyProfiles.length > 1) {
        return (
          <WorkspaceContainer
            onClick={() => {
              setShowMobileCompanyOptions(!showMobileCompanyOptions);
            }}
          >
            <LeftWorkspaceContainer>
              <AccountOptionText>{t("profile.switchCompanies")}</AccountOptionText>
              <CompanyText type={"small"}>{R.path(["company", "name"], companyStore)}</CompanyText>
            </LeftWorkspaceContainer>
            <RightWorkspaceContainer>
              {!showMobileCompanyOptions ? (
                <ChevronUp icon={"Chevron-Down"} size={"15px"} iconColor={"grey80"} />
              ) : (
                <Icon icon={"Chevron-Down"} size={"15px"} iconColor={"grey80"} />
              )}
            </RightWorkspaceContainer>
          </WorkspaceContainer>
        );
      } else {
        return (
          <WorkspaceContainer>
            <AccountOptionText>{R.path(["company", "name"], companyStore)}</AccountOptionText>
          </WorkspaceContainer>
        );
      }
    };

    const renderCompanyOptions = (): Array<JSX.Element> => {
      return parsedProfile.companyProfiles.map((company, index) => {
        return (
          <SwitchAccountContainer
            key={index}
            onClick={() => {
              userStore.updateUserCompany(company.id).then(() => {
                if (location.pathname !== "/") {
                  history.replace("/");
                }
                window.location.reload();
              });
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

    return (
      <>
        <UserDetailsContainer>
          <UserDetailsAvatarContainer>{renderUserAvatar()}</UserDetailsAvatarContainer>
          <UserDetailsNameContainer>
            <Heading type={"h4"} mt={"0px"} mb={"8px"}>
              {`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}
            </Heading>
            {renderUserStatus()}
          </UserDetailsNameContainer>
        </UserDetailsContainer>
        <StyledDivider />
        <DropdownSectionContainer>
          {renderWorkspaceDisplay()}
          {showMobileCompanyOptions && (
            <CompanyDropdownContainer>
              <CompanyOptionsContainer>{renderCompanyOptions()}</CompanyOptionsContainer>
            </CompanyDropdownContainer>
          )}
        </DropdownSectionContainer>
        <StyledDivider />
        <DropdownSectionContainer>
          <AccountOptionText
            color={baseTheme.colors.finePine}
            onClick={() => {
              setInviteTeamModalOpen(true);
              setShowAccountActions(false);
              setShowProfileNav(false);
            }}
          >
            Invite Users
          </AccountOptionText>
        </DropdownSectionContainer>
        <StyledDivider />

        <DropdownSectionContainer>
          <AccountOptionText
            color={baseTheme.colors.warningRed}
            onClick={() =>
              sessionStore.logoutRequest().then(() => {
                history.push(`/`);
              })
            }
          >
            {t("profile.logout")}
          </AccountOptionText>
        </DropdownSectionContainer>
      </>
    );
  },
);

const UserDetailsContainer = styled.div`
  display: flex;
  padding: 0 16px;
`;

const Container = styled.div`
  position: absolute;
  width: 256px;
  padding-top: 16px;
  padding-bottom: 8px;
  margin-top: 60px;
  background-color: white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const UserDetailsAvatarContainer = styled.div`
  // margin-bottom: 8px;
`;

const UserDetailsNameContainer = styled.div`
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledDivider = styled.hr`
  margin-top: 8px;
  margin-bottom: 8px;
  border-top: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
`;

const DropdownSectionContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

const CompanyDropdownContainer = styled("div")`
  // margin-left: -264px;
  // margin-top: -16px;
  // margin-right: 0;
  // padding-top: 8px;
  // padding-bottom: 8px;
  // width: 256px;
`;

const SwitchAccountContainer = styled.div`
  display: flex;
`;

const CurrentCompanyCheckboxContainer = styled.div`
  width: 16px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
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

const DefaultTextContainer = styled.div`
  margin-left: auto;
`;

const DefaultText = styled(Text)`
  font-style: italic;
`;

const WorkspaceContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

const LeftWorkspaceContainer = styled.div``;

const CompanyText = styled(Text)`
  margin-top: auto;
  color: ${props => props.theme.colors.greyActive};
`;

const RightWorkspaceContainer = styled.div`
  transform: rotate(180deg);
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  pointer-events: none;
`;

const ChevronUp = styled(Icon)`
  transform: rotate(180deg);
`;

const CompanyOptionsContainer = styled.div``;
