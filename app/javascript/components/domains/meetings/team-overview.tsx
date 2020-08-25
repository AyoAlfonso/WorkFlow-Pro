import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "~/components/shared/button";
import { observer } from "mobx-react";
import { useParams, useHistory } from "react-router-dom";
import { useMst } from "../../../setup/root";
import { toJS } from "mobx";
import * as R from "ramda";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../home/shared-components";
import { homePersonalStatusOptions as options } from "../home/home-personal-status/home-personal-status-options";
import { HomePersonalStatusDropdownMenuItem } from "../home/home-personal-status/home-personal-status-dropdown-menu-item";
import { Checkbox, Label } from "@rebass/forms";
import { KeyActivityPriorityIcon } from "../key-activities/key-activity-priority-icon";
import { TeamPulseCard } from "./shared/team-pulse-card";
import { OverallTeamPulse } from "./shared/overall-team-pulse";
import { TeamIssuesContainer } from "./shared/team-issues-container";
import { Loading } from "~/components/shared/loading";
import MeetingTypes from "~/constants/meeting-types";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

interface ITeamOverviewProps {}

export const TeamOverview = observer(
  (props: ITeamOverviewProps): JSX.Element => {
    const { sessionStore, teamStore, meetingStore } = useMst();

    const { team_id } = useParams();

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
          .then(() => {
            history.push(
              `/team/${team_id}/meeting/${meetingStore.currentMeeting.id}`,
              // `/team/${id}/meeting/${meetingStore.currentMeeting.id}?meeting_type=${meetingTemplate.meetingType}`,
            );
          });
      } else {
        showToast("Meeting templates not set up properly.", ToastMessageConstants.ERROR);
      }
    };
    // use NavLink instead?

    const user = sessionStore.profile;
    const currentTeam = teamStore.teams.find(team => team.id === parseInt(team_id));

    if (R.isEmpty(teamStore.teams)) {
      return (
        <Container>
          <BodyContainer>
            <Loading />
          </BodyContainer>
        </Container>
      );
    }

    const teamPulseData = [
      { x: new Date("2020-08-15"), y: 4 },
      { x: new Date("2020-08-14"), y: 1 },
      { x: new Date("2020-08-13"), y: 2 },
      { x: new Date("2020-08-12"), y: 5 },
      { x: new Date("2020-08-11"), y: 1 },
      { x: new Date("2020-08-10"), y: 3 },
      { x: new Date("2020-08-09"), y: 5 },
    ];

    const renderCardSubHeader = (text: string): JSX.Element => {
      return (
        <SubHeaderTextContainer>
          <SubHeaderText>{text}</SubHeaderText>
        </SubHeaderTextContainer>
      );
    };

    const renderUserSnapshotTable = (): JSX.Element => {
      return (
        <TableContainer>
          <TableHeaderContainer>
            <TeamMemberContainer />
            <StatusContainer>Status</StatusContainer>
            <TodaysPrioritiesContainer>Today's Priorities</TodaysPrioritiesContainer>
          </TableHeaderContainer>
          {renderUserRecords()}
        </TableContainer>
      );
    };

    const renderUserPriorities = (): JSX.Element => {
      return (
        <>
          <PriorityContainer>
            <CheckboxContainer key={1}>
              <Checkbox
                key={1}
                checked={true}
                // onChange={e => {
                //   keyActivityStore.updateKeyActivityStatus(keyActivity, e.target.checked);
                // }}
              />
            </CheckboxContainer>
            <PriorityText>SEO Optimization</PriorityText>
            <PriorityIconContainer>
              <KeyActivityPriorityIcon priority={"medium"} />
            </PriorityIconContainer>
          </PriorityContainer>
          <PriorityContainer>
            <CheckboxContainer key={2}>
              <Checkbox
                key={2}
                checked={true}
                // onChange={e => {
                //   keyActivityStore.updateKeyActivityStatus(keyActivity, e.target.checked);
                // }}
              />
            </CheckboxContainer>
            <PriorityText>Feed the fish</PriorityText>
            <PriorityIconContainer>
              <KeyActivityPriorityIcon priority={"high"} />
            </PriorityIconContainer>
          </PriorityContainer>
        </>
      );
    };

    const renderUserRecords = () => {
      return (
        <UserRecordContainer>
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
          <StatusContainer>
            <HomePersonalStatusDropdownMenuItem
              style={{ width: "170px", borderRadius: "5px", marginTop: "5px" }}
              menuItem={options[user.currentDailyLog.workStatus]}
              onSelect={() => null}
            />
          </StatusContainer>
          <TodaysPrioritiesContainer>{renderUserPriorities()}</TodaysPrioritiesContainer>
        </UserRecordContainer>
      );
    };

    return (
      <Container>
        <HeaderContainer>
          <Title>{`${currentTeam.name} Overview`}</Title>
          <TeamMeetingButton
            small
            variant={"primary"}
            onClick={() => {
              handleMeetingClick();
            }}
          >
            <ButtonTextContainer>
              <Icon icon={"Team"} size={"20px"} />
              <TeamMeetingText>Team Meeting</TeamMeetingText>
            </ButtonTextContainer>
          </TeamMeetingButton>
        </HeaderContainer>
        <BodyContainer>
          <LeftContainer>
            <TeamSnapshotContainer>
              {renderCardSubHeader("Team Snapshot")}
              {renderUserSnapshotTable()}
            </TeamSnapshotContainer>
          </LeftContainer>
          <RightContainer>
            <TeamPulseContainer>
              {renderCardSubHeader("Team's Pulse")}
              <TeamPulseBody>
                <OverallTeamPulse value={3.4} />
                <TeamPulseCard data={teamPulseData} />
              </TeamPulseBody>
            </TeamPulseContainer>
            <TeamIssuesWrapper>
              <TeamIssuesContainer />
            </TeamIssuesWrapper>
          </RightContainer>
        </BodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  padding: 20px;
  padding-bottom: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const Title = styled(Text)`
  font-size: 36px;
`;

const TeamMeetingButton = styled(Button)`
  display: flex;
  width: 220px;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const TeamMeetingText = styled(Text)`
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 15px;
  justify-content: center;
  display: flex;
  align-items: center;
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

const ButtonTextContainer = styled.div`
  margin: auto;
  display: flex;
`;

const TeamSnapshotContainer = styled(HomeContainerBorders)``;

const TeamPulseContainer = styled(HomeContainerBorders)``;

const TeamIssuesWrapper = styled(HomeContainerBorders)``;

const SubHeaderTextContainer = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  border-bottom: ${props => `1px solid ${props.theme.colors.grey40}`};
`;

const SubHeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

const TeamMemberContainer = styled.div`
  width: 30%;
`;

const StatusContainer = styled.div`
  width: 30%;
  font-size: 20px;
`;

const TodaysPrioritiesContainer = styled.div`
  width: 40%;
  font-size: 20px;
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
