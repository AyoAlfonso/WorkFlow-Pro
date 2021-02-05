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
import { Text } from "~/components/shared/text";
import MeetingTypes from "~/constants/meeting-types";
import { ToastMessageConstants } from "~/constants/toast-types";
import { baseTheme } from "~/themes";
import { showToast } from "~/utils/toast-message";
import { useMst } from "../../../setup/root";
import { HomePersonalStatusDropdownMenuItem } from "../home/home-personal-status/home-personal-status-dropdown-menu-item";
import { homePersonalStatusOptions as options } from "../home/home-personal-status/home-personal-status-options";
import { KeyActivityPriorityIcon } from "../key-activities/key-activity-priority-icon";
import { FutureTeamMeetingsContainer } from "./shared/future-team-meetings-container";
import { OverallTeamPulse } from "./shared/overall-team-pulse";
import { TeamIssuesContainer } from "./shared/team-issues-container";
import { TeamPulseCard } from "./shared/team-pulse-card";
import { CardLayout } from "~/components/layouts/card-layout";

interface ITeamOverviewProps {}

export const TeamOverview = observer(
  ({}: ITeamOverviewProps): JSX.Element => {
    const {
      companyStore: { company },
      teamStore,
      meetingStore,
    } = useMst();

    const { team_id } = useParams();
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      teamStore.getTeam(team_id).then(() => setLoading(false));
    }, [team_id]);

    const history = useHistory();
    const currentTeam = teamStore.currentTeam;

    if (
      R.isNil(company) ||
      !currentTeam ||
      loading ||
      R.isNil(meetingStore) ||
      R.isNil(R.isNil(meetingStore.meetingTemplates))
    ) {
      return (
        <Container>
          <BodyContainer>
            <Loading />
          </BodyContainer>
        </Container>
      );
    }
    const overviewType = company.accessForum ? "forum" : "teams";
    //based on

    const handleForumMeetingClick = () => {
      meetingStore.startNextMeeting(team_id, MeetingTypes.FORUM_MONTHLY).then(({ meeting }) => {
        if (!R.isNil(meeting)) {
          history.push(`/team/${team_id}/meeting/${meeting.id}`);
        }
      });
    };

    const handleMeetingClick = () => {
      meetingStore.createMeeting(team_id).then(({ meeting }) => {
        if (!R.isNil(meeting)) {
          history.push(`/team/${team_id}/meeting/${meeting.id}`);
        } else {
          showToast("Failed to start meeting.", ToastMessageConstants.ERROR);
        }
      });
    };

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
            <PriorityTextContainer>
              <PriorityText>{keyActivity.description}</PriorityText>
            </PriorityTextContainer>
            <PriorityIconContainer>
              <KeyActivityPriorityIcon priority={keyActivity.priority} />
            </PriorityIconContainer>
          </PriorityContainer>
        );
      });
    };

    const renderUserRecords = () => {
      return currentTeam.users.map((user, index) => {
        const prioritiesToRender = user.todaysPriorities.concat(user.todaysCompletedActivities);
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
            <StatusContainer fontSize={"16px"}>
              <HomePersonalStatusDropdownMenuItem
                style={{ height: "32px", width: "135px", borderRadius: "5px", marginTop: "5px" }}
                menuItem={options[user.currentDailyLog.workStatus]}
                onSelect={() => null}
              />
            </StatusContainer>
            <TodaysPrioritiesContainer fontSize={"16px"}>
              {renderUserPriorities(prioritiesToRender)}
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
            <CardLayout titleText={t(`${overviewType}.teamSnapshotTitle`)}>
              {renderUserSnapshotTable()}
            </CardLayout>
          </LeftContainer>
          <RightContainer>
            <TeamMeetingInfoContainer>
              <FutureTeamMeetingsWrapper>
                {overviewType === "teams" && (
                  <FutureTeamMeetingsContainer
                    titleText={t(`${overviewType}.teamMeetingsTitle`)}
                    buttonText={"Team Meeting"}
                    handleMeetingClick={handleMeetingClick}
                  />
                )}
                {overviewType === "forum" && (
                  <FutureTeamMeetingsContainer
                    titleText={t(`${overviewType}.teamMeetingsTitle`)}
                    buttonText={"Forum Meeting"}
                    handleMeetingClick={handleForumMeetingClick}
                  />
                )}
              </FutureTeamMeetingsWrapper>
              <TeamIssuesWrapper>
                <TeamIssuesContainer
                  teamId={team_id}
                  title={t(`${overviewType}.teamIssuesTitle`)}
                />
              </TeamIssuesWrapper>
            </TeamMeetingInfoContainer>

            <CardLayout titleText={t(`${overviewType}.teamsPulseTitle`)}>
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
            </CardLayout>
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
  width: 55%;
  margin-right: 10px;
  min-width: 555px;
`;

const RightContainer = styled.div`
  width: 45%;
  min-width: 610px;
  margin-left: 10px;
`;

const TeamIssuesWrapper = styled.div`
  width: 50%;
`;

const FutureTeamMeetingsWrapper = styled.div`
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

const PriorityTextContainer = styled.div`
  width: 100%;
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
  margin-bottom: 20px;
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
