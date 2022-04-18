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
import { Link } from 'react-router-dom';

import { FutureTeamMeetingsContainer } from "./shared/future-team-meetings-container";
import { TeamIssuesContainer } from "./shared/team-issues-container";
import { TeamPulsePanel } from "./shared/team-pulse-panel";

import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";
import { UserStatus } from "~/components/shared/user-status";

import { TeamDashboard } from "./team-dashboard";
import { Heading } from "~/components/shared";
import { Icon } from "~/components/shared/icon";
import { IconContainerWithPadding } from "~/components/shared/icon";

interface ITeamOverviewProps {}

export const DummyTeamOverview = observer(
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

    return (
      <Overlay>
        <Wrapper>
      <Upgradetextcontainer>
        <IconWrapper>
        <Icon icon={"Team"} size={160} iconColor={"#005FFE"} />
        </IconWrapper>
        <Boldtext>
          Get the information you need to drive success in your business
        </Boldtext>
        <Subtext>
          Upgrade to a higher tier to get access to Team
        </Subtext>
        {/* <Link to="http://go.lynchpyn.com/upgrade"> */}
        <Talktous
        // type="button"
        onClick={(e) => {
          e.preventDefault();
          window.location.href='http://go.lynchpyn.com/upgrade';
        }}>
          Talk to us
        </Talktous>
        {/* </Link> */}
      </Upgradetextcontainer>
      </Wrapper>
      <Container>
        <LeftContainer>
          <OverviewTabsContainer>
            <OverviewTabs>{t(`Team Snapshot`)}</OverviewTabs>
          </OverviewTabsContainer>
          <TableContainer>
            <TableHeaderContainer>
              <ColumnContainerParent>
                <TodayColumnContainer>
                  <ColumnSubHeaderContainer>
                    <TodayText type={"paragraph"}>September 1st</TodayText>
                  </ColumnSubHeaderContainer>
                </TodayColumnContainer>
                <ColumnContainer>
                  <ColumnSubHeaderContainer>
                    <Heading type={"h4"}>Today's Pyns</Heading>
                  </ColumnSubHeaderContainer>
                </ColumnContainer>
              </ColumnContainerParent>
            </TableHeaderContainer>
            <UserRecordContainer>
               <ColumnContainer>
                <TeamMemberInfoContainer>
                   <Avatar
                    defaultAvatarColor={"blue"}
                    firstName={"firstName"}
                    lastName={"lastname"}
                    size={45}
                    marginLeft={"0px"}
                  />
                  <TeamMemberName>
                {"firstName"} {"larstName"}
              </TeamMemberName>
                  {/* {renderUserStatus(user)} */}
                </TeamMemberInfoContainer>
              </ColumnContainer>
              {/* <ColumnContainer>{renderUserPriorities(prioritiesToRender)}</ColumnContainer> */}
            </UserRecordContainer>
            <UserRecordContainer>
               <ColumnContainer>
                <TeamMemberInfoContainer>
                   <Avatar
                    defaultAvatarColor={"green"}
                    firstName={"firstName"}
                    lastName={"lastname"}
                    size={45}
                    marginLeft={"0px"}
                  />
                  <TeamMemberName>
                {"first last"}
              </TeamMemberName>
                </TeamMemberInfoContainer>
              </ColumnContainer>
            </UserRecordContainer>
            <UserRecordContainer>
               <ColumnContainer>
                <TeamMemberInfoContainer>
                   <Avatar
                    defaultAvatarColor={"yellow"}
                    firstName={"firstName"}
                    lastName={"lastname"}
                    size={45}
                    marginLeft={"0px"}
                  />
                  <TeamMemberName>
                {"bob wright"}
              </TeamMemberName>
                </TeamMemberInfoContainer>
              </ColumnContainer>
            </UserRecordContainer>
            
            
          </TableContainer>
        </LeftContainer>
        <ToolsWrapper>
          <OverviewTabs>{t(`Tools`)}</OverviewTabs>
          <StyledOverviewAccordion expanded={false} elevation={1}>
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
            elevation={-100}
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
            elevation={100}
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
      </Overlay>
    );
  },
);

const Overlay = styled.div`
  position: relative;

`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
`;

const IconWrapper = styled.div`
  margin-top: 120px;
`;

const Boldtext = styled.div`
  font-family: exo;
  font-weight: bold;
  font-size: 36px;
  line-spacing: 48;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 32px;
  max-width: 720px;
  display: inline-block;
`;

const Subtext = styled.div`
  font-family: exo;
  font-weight: regular;
  font-size: 20px;
  line-spacing: 27;
  margin-bottom: 24px;
`;

const Talktous = styled.div`
  width: 120px;
  height: 28px;
  background: #005FFE 0% 0% no-repeat padding-box;
  border: 1px solid #005FFE;
  border-radius: 4px;
  opacity: 1;
  font-family: lato;
  font-weight: bold;
  font-size: 12px;
  color: #FFFFFF;
  display: inline-block;
  padding-top: 11px;
  line-spacing: 24;
 `;

const Container = styled.div`
  display: flex;
  filter: blur(10px);
  position: absolute;
  opacity: 0.35;
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
const UserRecordContainer = styled.div`
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: ${props => `1px solid ${props.theme.colors.grey40}`};
  min-width: 480px;
  width: 100%;
  align-items: stretch;
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
  //display: flex;
  display: inline-block;
  justify-self: left;
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

const TodayColumnContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  width: 50%;
  min-width: ${"240px"};
  margin-right: 20px;
`;

////
const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  margin-bottom: 15px;
`;

const OverviewTabs = styled.div`
  margin-bottom: 0;
  padding-bottom: 8px;
  margin-right: 20px;
  margin-left: 16px;
  color: black;
  font-family: Exo;
  font-size: 26px;
  line-height: 28px;
  font-weight: bold;
  &:visited {
    color: ${props => props.theme.colors.black};
  }
  text-decoration: none;
  border-bottom-width: 0px;
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
`;

const ColumnSubHeaderContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
  margin-top: auto;
  margin-bottom: auto;
`;

const ColumnContainerParent = styled.div`
  display: flex;
  min-width: 480px;
  width: 100%;
  align-items: stretch;
`;

const ColumnContainer = styled.div`
  width: 50%;
  min-width: ${"240px"};
  margin-right: 20px;
`;

const ToolsWrapper = styled.div`
  flex-direction: column;
  width: 25%;
  margin-left: 20px;
  margin-right: 5px;
  height: 100%;
`;

const ToolsHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 40px;
`;