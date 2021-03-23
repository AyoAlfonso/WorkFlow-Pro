import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Avatar } from "../../shared/avatar";
import { Icon } from "../../shared/icon";
import { Heading, Text } from "../../shared";
import { CreateIssueModal } from "../issues/create-issue-modal";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { InviteUserModal } from "~/components/shared/invite-user-modal";
import * as moment from "moment";
import {
  emotionA,
  emotionB,
  emotionC,
  emotionD,
  emotionE,
} from "~/components/shared/pulse/pulse-icon";
import { AccountDropdownOptions } from "./top-nav/account-dropdown-options";
import { InviteYourTeamModal } from "../account/users/invite-your-team-modal";

declare global {
  interface Window {
    FreshworksWidget: any;
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

    const { sessionStore, companyStore, meetingStore, userStore, teamStore } = useMst();
    const accountActionRef = useRef(null);

    const location = useLocation();
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

          <InviteYourTeamModal
            modalOpen={inviteTeamModalOpen}
            setModalOpen={setInviteTeamModalOpen}
          />
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

const MoodSelectorContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
  color: ${props => props.theme.colors.grey60};
`;
