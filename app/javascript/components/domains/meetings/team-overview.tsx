import { Checkbox, Label } from "@rebass/forms";
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
import { Text } from "~/components/shared/text";
import MeetingTypes from "~/constants/meeting-types";
import { ToastMessageConstants } from "~/constants/toast-types";
import { baseTheme } from "~/themes";
import { showToast } from "~/utils/toast-message";
import { useMst } from "../../../setup/root";

import { StatusView } from "~/components/domains/home/home-personal-status/status-view";
import { KeyActivitiesListStyleContainer } from "~/components/domains/key-activities/key-activities-list";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";

import { today } from "~/lib/date-helpers";

//TODO: REMOVE THESE OLD ITEMS ONCE WE KNOW HOW STATUS IS SET
// import { HomePersonalStatusDropdownMenuItem } from "../home/home-personal-status/home-personal-status-dropdown-menu-item";
// import { homePersonalStatusOptions as options } from "../home/home-personal-status/home-personal-status-options";

import { KeyActivityPriorityIcon } from "../key-activities/key-activity-priority-icon";

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
  SnapshotHeading,
} from "~/components/shared/styles/overview-styles";

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
            <ColumnContainerParent>
              <ColumnContainer>
                <ColumnSubHeaderContainer>{today}</ColumnSubHeaderContainer>
              </ColumnContainer>
              <ColumnContainer>
                <ColumnSubHeaderContainer>{"Today's Pyns"}</ColumnSubHeaderContainer>
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

    // const renderUserPriorities = (keyActivities): JSX.Element => {
    //   return keyActivities.map((keyActivity, index) => {
    //     return (
    //       <PriorityContainer key={index}>
    //         <CheckboxContainer>
    //           <Checkbox
    //             key={`checkbox-${index}`}
    //             checked={keyActivity.completedAt ? true : false}
    //             sx={{
    //               color: baseTheme.colors.primary100,
    //             }}
    //           />
    //         </CheckboxContainer>
    //         <PriorityTextContainer>
    //           <PriorityText>{keyActivity.description}</PriorityText>
    //         </PriorityTextContainer>
    //         <PriorityIconContainer>
    //           <KeyActivityPriorityIcon priority={keyActivity.priority} />
    //         </PriorityIconContainer>
    //       </PriorityContainer>
    //     );
    //   });
    // };

    const renderUserRecords = () => {
      return currentTeam.users.map((user, index) => {
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
                <TeamMemberName>
                  {user.firstName} {user.lastName}
                </TeamMemberName>
                <StatusView status={user.currentDailyLog.workStatus} />
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
          <SnapshotHeading type={"h2"}>{t(`${overviewType}.teamSnapshotTitle`)}</SnapshotHeading>
          {renderUserSnapshotTable()}
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
                buttonText={"Forum Meeting"}
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
