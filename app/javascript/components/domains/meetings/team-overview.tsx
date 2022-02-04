import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { Avatar } from "~/components/shared/avatar";
import { Loading } from "~/components/shared/loading";
import { Text } from "~/components/shared/text";
import MeetingTypes from "~/constants/meeting-types";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import { useMst } from "~/setup/root";
import { LynchPynBadge } from "../meetings-forum/components/lynchpyn-badge";
import { KeyActivitiesListStyleContainer } from "~/components/domains/key-activities/key-activities-list";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";

import { today } from "~/lib/date-helpers";

import {
  ColumnContainer,
  ColumnSubHeaderContainer,
  ColumnContainerParent,
} from "~/components/shared/styles/row-style";

import { FutureTeamMeetingsContainer } from "./shared/future-team-meetings-container";
import { TeamIssuesContainer } from "./shared/team-issues-container";
import { TeamPulsePanel } from "./shared/team-pulse-panel";

import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";
import {
  ToolsWrapper,
  ToolsHeader,
  OverviewTabsContainer,
  OverviewTabs,
} from "~/components/shared/styles/overview-styles";
import { UserStatus } from "~/components/shared/user-status";

import { TeamDashboard } from "./team-dashboard";
import { Heading } from "~/components/shared";

interface ITeamOverviewProps {}

export const TeamOverview = observer(
  ({}: ITeamOverviewProps): JSX.Element => {
    const {
      companyStore: { company },
      teamStore,
      meetingStore,
      issueStore,
      forumStore,
    } = useMst();

    const { team_id } = useParams();
    const inDashboard = useRouteMatch("/team/:team_id/dashboard");
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<string>("");
    const handleToolsChange = (panel: string) => (
      event: React.ChangeEvent<{}>,
      isExpanded: boolean,
    ) => {
      setExpanded(isExpanded ? panel : "");
    };

    useEffect(() => {
      teamStore
        .getTeam(team_id)
        .then(() => issueStore.fetchTeamIssues(team_id).then(() => setLoading(false)));
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
          <Loading />
        </Container>
      );
    }
    const overviewType = company && company.accessForum ? "forum" : "teams";
    //based on
    const forumType =
      company?.forumType == "Organisation"
        ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
        : MeetingTypes.FORUM_MONTHLY;

    const handleForumMeetingClick = () => {
      meetingStore.startNextMeeting(team_id, forumType).then(({ meeting }) => {
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
            <ColumnContainerParent>
              <TodayColumnContainer>
                <ColumnSubHeaderContainer>
                  <TodayText type={"paragraph"}>{today}</TodayText>
                </ColumnSubHeaderContainer>
              </TodayColumnContainer>
              <ColumnContainer>
                <ColumnSubHeaderContainer>
                  <Heading type={"h4"}>Today's Pyns</Heading>
                </ColumnSubHeaderContainer>
              </ColumnContainer>
            </ColumnContainerParent>
          </TableHeaderContainer>
          {renderUserRecords()}
        </TableContainer>
      );
    };

    const renderUserPriorities = (keyActivities): JSX.Element => {
      return (
        <KeyActivitiesListStyleContainer>
          {keyActivities.map(keyActivity => {
            return <KeyActivityRecord key={keyActivity.id} keyActivity={keyActivity} />;
          })}
        </KeyActivitiesListStyleContainer>
      );
    };

    const renderUserStatus = user => {
      if (user.userPulseForDisplay) {
        return (
          <TeamMemberRightContainer>
            <InfoRow>
              <TeamMemberName>
                {user.firstName} {user.lastName}
              </TeamMemberName>

              <UserStatusContainer>
                <UserStatus selectedUserStatus={user.currentDailyLog.workStatus} />
              </UserStatusContainer>
            </InfoRow>
            <InfoRow>
              <EmotionText>{user.userPulseForDisplay.feeling}!</EmotionText>
            </InfoRow>
          </TeamMemberRightContainer>
        );
      } else {
        return (
          <>
            <TeamMemberName>
              {user.firstName} {user.lastName}
            </TeamMemberName>

            <UserStatusContainer>
              <UserStatus selectedUserStatus={user.currentDailyLog.workStatus} />
            </UserStatusContainer>
          </>
        );
      }
    };

    const renderUserRecords = () => {
      return currentTeam.users
        .slice()
        .sort((a, b) => {
          if (!a.firstName || !b.firstName) {
            return 0;
          } else {
            return a.firstName.localeCompare(b.firstName);
          }
        })
        .map((user, index) => {
          const prioritiesToRender = user.todaysPriorities.concat(user.todaysCompletedActivities);
          return (
            <UserRecordContainer key={index}>
              <ColumnContainer>
                <TeamMemberInfoContainer>
                  <Avatar
                    defaultAvatarColor={user.defaultAvatarColor}
                    avatarUrl={user.avatarUrl}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size={45}
                    marginLeft={"0px"}
                  />
                  {renderUserStatus(user)}
                </TeamMemberInfoContainer>
              </ColumnContainer>
              <ColumnContainer>{renderUserPriorities(prioritiesToRender)}</ColumnContainer>
            </UserRecordContainer>
          );
        });
    };

    return (
      <Container>
        <LeftContainer>
          <OverviewTabsContainer>
            <OverviewTabs
              exact={true}
              to={`/team/${team_id}`}
              activeStyle={{
                borderBottomWidth: "1px",
              }}
            >
              {t(`${overviewType}.teamSnapshotTitle`)}
            </OverviewTabs>
            {overviewType == "teams" && currentTeam.customScorecard ? (
              <OverviewTabs
                to={`/team/${team_id}/dashboard`}
                activeStyle={{
                  borderBottomWidth: "1px",
                }}
              >
                {t(`${overviewType}.customScorecard`)}
              </OverviewTabs>
            ) : (
              <></>
            )}
          </OverviewTabsContainer>

          {inDashboard && overviewType == "teams" ? (
            <TeamDashboard team={currentTeam} />
          ) : (
            renderUserSnapshotTable()
          )}
        </LeftContainer>
        <ToolsWrapper>
          <ToolsHeader type={"h2"}>{t("tools.title")}</ToolsHeader>
          <StyledOverviewAccordion expanded={false} onChange={handleToolsChange("")} elevation={0}>
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
                buttonText={t("forum.forumMeeting")}
                handleMeetingClick={handleForumMeetingClick}
              />
            )}
          </StyledOverviewAccordion>

          <StyledOverviewAccordion
            expanded={expanded == "team-issues-panel"}
            onChange={handleToolsChange("team-issues-panel")}
            elevation={0}
          >
            <TeamIssuesContainer
              teamId={team_id}
              title={t(`${overviewType}.teamIssuesTitle`)}
              expanded={expanded}
              handleChange={handleToolsChange}
            />
          </StyledOverviewAccordion>

          <StyledOverviewAccordion
            expanded={expanded == "team-pulse-panel"}
            onChange={handleToolsChange("team-pulse-panel")}
            elevation={0}
          >
            <TeamPulsePanel
              team={currentTeam}
              title={t(`${overviewType}.teamsPulseTitle`)}
              expanded={expanded}
              handleChange={handleToolsChange}
            />
          </StyledOverviewAccordion>
        </ToolsWrapper>
        {overviewType === "forum" && <LynchPynBadge />}
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
`;

const LeftContainer = styled.div`
  display: flex;
  width: 75%;
  min-width: 480px;
  flex-direction: column;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const TableHeaderContainer = styled.div`
  display: flex;
  padding-top: 16px;
  padding-bottom: 8px;
`;

//TODO: do not display border bottom if last record of users
const UserRecordContainer = styled(ColumnContainerParent)`
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

const UserStatusContainer = styled.div`
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: auto;
`;

const TeamMemberRightContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const InfoRow = styled.div`
  display: flex;
`;

const EmotionText = styled(Text)`
  margin-left: 16px;
  color: ${props => props.theme.colors.greyActive};
  font-size: 12px;
  font-style: italic;
  margin-top: 8px;
  margin-bottom: 0px;
`;

const TodayText = styled(Text)`
  margin-top: 0;
  margin-bottom: 0;
  color: ${props => props.theme.colors.greyActive};
`;

const TodayColumnContainer = styled(ColumnContainer)`
  margin-top: auto;
  margin-bottom: auto;
`;
