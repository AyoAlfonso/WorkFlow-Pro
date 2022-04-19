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
import { Checkbox, Label } from "@rebass/forms";
import { baseTheme } from "~/themes/base";
import ContentEditable from "react-contenteditable";

interface ITeamOverviewProps {}

export const DummyTeamOverview = observer(
  ({}: ITeamOverviewProps): JSX.Element => {
    const {
    } = useMst();

    const { team_id } = useParams();
    const inDashboard = useRouteMatch("/team/:team_id/dashboard");
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<string>("");
    
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
        <Talktous
        onClick={(e) => {
          e.preventDefault();
          window.location.href='http://go.lynchpyn.com/upgrade';
        }}>
          Talk to us
        </Talktous>
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
                </TeamMemberInfoContainer>
              </ColumnContainer>
              <ColumnContainer>
              <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"Example PYN"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
                  <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"My Pyns to do"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
              </ColumnContainer>
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
              <ColumnContainer>
              <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"Must get done tomorrow"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
                  <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"Must get done example important task"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
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
              <ColumnContainer>
              <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"Next weeks example task"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
                  <PynContainer>
                    <Label
                      sx={{
                        width: "auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      <Checkbox
                        checked={false}
                        onChange={e => {
                        }}
                        sx={{
                          color: baseTheme.colors.primary100,
                        }}
                      />
                    </Label>
                    <StyledContentEditable
                      html={"todays to do"}
                      onChange={e => {
                      }}
                      style={{ cursor: "text" }}
                      onKeyDown={key => {}}
                      placeholder={"New pyn..."}
                    />
                  </PynContainer>
              </ColumnContainer>
            </UserRecordContainer>
            
            
          </TableContainer>
        </LeftContainer>
        <ToolsWrapper>
          <OverviewTabs>{t(`Tools`)}</OverviewTabs>
          <StyledOverviewAccordion expanded={false} elevation={1}>
            {(
              <FutureTeamMeetingsContainer
                titleText={t(`teamMeetingsTitle`)}
                buttonText={"Team Meeting"}
                handleMeetingClick={0}
              />
            )}
            {(
              <FutureTeamMeetingsContainer
                titleText={t(`teamMeetingsTitle`)}
                buttonText={t("forumMeeting")}
                handleMeetingClick={0}
              />
            )}
          </StyledOverviewAccordion>

          <StyledOverviewAccordion
            expanded={false}
            elevation={-100}
          >
            <TeamIssuesContainer
              teamId={team_id}
              title={t(`teamIssuesTitle`)}
              expanded={"t"}
              handleChange={0}
            />
          </StyledOverviewAccordion>
          <StyledOverviewAccordion
            expanded={false}
            elevation={-100}
          >
            <TeamIssuesContainer
              teamId={team_id}
              title={t(`teamIssuesTitle`)}
              expanded={"t"}
              handleChange={0}
            />
          </StyledOverviewAccordion>
        </ToolsWrapper>
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

const PynContainer = styled.div`
  height: 58px;
  width: 95%;
  border-radius: 10px;
  box-shadow: 0px 3px 6px ${baseTheme.colors.grayShadow};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  margin-top: 16px;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  min-width: 105px;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  word-break: break-word;
`;