import { Checkbox, Label } from "@rebass/forms";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { typography, TypographyProps } from "styled-system";
import { Avatar } from "~/components/shared/avatar";
import { Heading } from "~/components/shared/heading";
import { Loading } from "~/components/shared/loading";
import { NoMoodRatings } from "~/components/shared/no-mood-ratings";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { Text } from "~/components/shared/text";
import MeetingTypes from "~/constants/meeting-types";
import { ToastMessageConstants } from "~/constants/toast-types";
import { baseTheme } from "~/themes";
import { showToast } from "~/utils/toast-message";
import { useMst } from "../../../setup/root";
import { HomePersonalStatusDropdownMenuItem } from "../home/home-personal-status/home-personal-status-dropdown-menu-item";
import { homePersonalStatusOptions as options } from "../home/home-personal-status/home-personal-status-options";
import { HomeContainerBorders } from "../home/shared-components";
import { KeyActivityPriorityIcon } from "../key-activities/key-activity-priority-icon";
import { FutureTeamMeetingsContainer } from "./shared/future-team-meetings-container";
import { OverallTeamPulse } from "./shared/overall-team-pulse";
import { TeamIssuesContainer } from "./shared/team-issues-container";
import { TeamPulseCard } from "./shared/team-pulse-card";

interface ITeamOverviewProps {}

export const TeamOverview = observer(
  (props: ITeamOverviewProps): JSX.Element => {
    const { sessionStore, teamStore, meetingStore } = useMst();

    const { team_id } = useParams();
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      teamStore.getTeam(team_id).then(() => setLoading(false));
    }, []);

    const history = useHistory();
    const handleMeetingClick = () => {
      const meetingTemplate = toJS(meetingStore.meetingTemplates).find(
        mt => mt.meetingType === MeetingTypes.TEAM_WEEKLY,
      );

      if (meetingTemplate) {
        meetingStore
          .createMeeting({
            teamId: team_id,
            // startTime: new Date().toUTCString(),
            hostName: `${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`,
            currentStep: 0,
            meetingTemplateId: meetingTemplate.id,
          })
          .then(({ meeting }) => {
            if (!R.isNil(meeting)) {
              history.push(`/team/${team_id}/meeting/${meeting.id}`);
            }
          });
      } else {
        showToast("Meeting templates not set up properly.", ToastMessageConstants.ERROR);
      }
    };
    // use NavLink instead?

    const currentTeam = teamStore.currentTeam;

    if (!currentTeam || loading) {
      return (
        <Container>
          <BodyContainer>
            <Loading />
          </BodyContainer>
        </Container>
      );
    }

    const renderUserSnapshotTable = (): JSX.Element => {
      return (
        <TableContainer>
          <TableHeaderContainer>
            <TeamMemberContainer />
            <StatusContainer fontSize={"16px"}>Status</StatusContainer>
            <TodaysPrioritiesContainer fontSize={"16px"}>
              {t("keyActivities.prioritiesTitle")}
            </TodaysPrioritiesContainer>
          </TableHeaderContainer>
          {renderUserRecords()}
        </TableContainer>
      );
    };

    const renderUserPriorities = (keyActivities): JSX.Element => {
      return keyActivities.map((keyActivity, index) => {
        return (
          <PriorityContainer key={index}>
            <CheckboxContainer>
              <Checkbox
                key={`checkbox-${index}`}
                checked={keyActivity.completedAt ? true : false}
                sx={{
                  color: baseTheme.colors.primary100,
                }}
              />
            </CheckboxContainer>
            <PriorityText>{keyActivity.description}</PriorityText>
            <PriorityIconContainer>
              <KeyActivityPriorityIcon priority={keyActivity.priority} />
            </PriorityIconContainer>
          </PriorityContainer>
        );
      });
    };

    const renderUserRecords = () => {
      return currentTeam.users.map((user, index) => {
        return (
          <UserRecordContainer key={index}>
            <TeamMemberContainer>
              <TeamMemberInfoContainer>
                <Avatar
                  defaultAvatarColor={user.defaultAvatarColor}
                  avatarUrl={user.avatarUrl}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size={45}
                  marginLeft={"0px"}
                />
                <TeamMemberName>
                  {user.firstName} {user.lastName}
                </TeamMemberName>
              </TeamMemberInfoContainer>
            </TeamMemberContainer>
            <StatusContainer fontSize={"20px"}>
              <HomePersonalStatusDropdownMenuItem
                style={{ width: "170px", borderRadius: "5px", marginTop: "5px" }}
                menuItem={options[user.currentDailyLog.workStatus]}
                onSelect={() => null}
              />
            </StatusContainer>
            <TodaysPrioritiesContainer fontSize={"20px"}>
              {renderUserPriorities(user.todaysPriorities)}
            </TodaysPrioritiesContainer>
          </UserRecordContainer>
        );
      });
    };

    return (
      <Container>
        <HeaderContainer>
          <Heading type={"h1"} fontSize={"24px"}>{`${currentTeam.name} Overview`}</Heading>
        </HeaderContainer>
        <BodyContainer>
          <LeftContainer>
            <TeamSnapshotContainer>
              <ContainerHeaderWithText text={t("teams.teamSnapshotTitle")} />
              {renderUserSnapshotTable()}
            </TeamSnapshotContainer>
          </LeftContainer>
          <RightContainer>
            <TeamMeetingInfoContainer>
              <FutureTeamMeetingsWrapper>
                <FutureTeamMeetingsContainer handleMeetingClick={handleMeetingClick} />
              </FutureTeamMeetingsWrapper>
              <TeamIssuesWrapper>
                <TeamIssuesContainer />
              </TeamIssuesWrapper>
            </TeamMeetingInfoContainer>

            <TeamPulseContainer>
              <ContainerHeaderWithText text={t("teams.teamsPulseTitle")} />
              {currentTeam.averageTeamEmotionScore > 0 ? (
                <TeamPulseBody>
                  <OverallTeamPulse value={currentTeam.averageTeamEmotionScore} />
                  <TeamPulseCard
                    data={toJS(currentTeam.formattedAverageWeeklyUserEmotions) || []}
                  />
                </TeamPulseBody>
              ) : (
                <NoMoodWrapper>
                  <NoMoodRatings />
                </NoMoodWrapper>
              )}
            </TeamPulseContainer>
          </RightContainer>
        </BodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  padding-bottom: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const BodyContainer = styled.div`
  display: flex;
`;

const LeftContainer = styled.div`
  width: 60%;
  margin-right: 10px;
  min-width: 715px;
`;

const RightContainer = styled.div`
  width: 40%;
  min-width: 610px;
  margin-left: 10px;
`;

const TeamSnapshotContainer = styled(HomeContainerBorders)``;

const TeamPulseContainer = styled(HomeContainerBorders)``;

const TeamIssuesWrapper = styled(HomeContainerBorders)`
  width: 50%;
`;

const FutureTeamMeetingsWrapper = styled(HomeContainerBorders)`
  width: 50%;
  margin-right: 20px;
`;

const TeamMemberContainer = styled.div`
  width: 30%;
`;

const StatusContainer = styled.div<TypographyProps>`
  ${typography}
  width: 30%;
`;

const TodaysPrioritiesContainer = styled.div<TypographyProps>`
  ${typography}
  width: 40%;
`;

const TableContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

const TableHeaderContainer = styled.div`
  display: flex;
  padding-left: 8px;
  padding-right: 8px;
  border-bottom: ${props => `1px solid ${props.theme.colors.grey40}`};
  padding-top: 16px;
  padding-bottom: 8px;
`;

//TODO: do not display border bottom if last record of users
const UserRecordContainer = styled.div`
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: ${props => `1px solid ${props.theme.colors.grey40}`};
`;

const TeamMemberInfoContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
`;

const TeamMemberName = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
`;

const PriorityContainer = styled.div`
  display: flex;
  margin-top: -10px;
`;

const PriorityText = styled(Text)``;

const PriorityIconContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const TeamPulseBody = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;

const TeamMeetingInfoContainer = styled.div`
  display: flex;
`;

const CheckboxContainer = props => (
  <Label
    {...props}
    sx={{
      width: "auto",
      marginTop: "auto",
      marginBottom: "auto",
    }}
  >
    {props.children}
  </Label>
);

const NoMoodWrapper = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
`;
