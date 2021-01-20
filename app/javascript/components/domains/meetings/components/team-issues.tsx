import * as React from "react";
import * as R from "ramda";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared";
import { color } from "styled-system";
import { Loading } from "~/components/shared/loading";
import { IssuesHeader } from "../../issues/issues-header";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { IssueEntry } from "../../issues/issue-entry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import MeetingTypes from "~/constants/meeting-types";

export const TeamIssues = observer(
  (props: {}): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const { meetingStore, issueStore } = useMst();

    const { team_id } = useParams();

    useEffect(() => {
      issueStore.fetchTeamIssues(team_id);
      issueStore.fetchIssuesForMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading || R.isNil(issueStore.teamIssues) || R.isNil(issueStore.issues)) {
      return <Loading />;
    }

    const openTeamIssues = issueStore.openTeamIssues;
    const closedTeamIssues = issueStore.closedTeamIssues;

    const renderIssuesList = (): Array<JSX.Element> => {
      const teamIssues = showOpenIssues ? openTeamIssues : closedTeamIssues;
      return teamIssues.map((teamIssue, index) => (
        <Draggable
          draggableId={`team_issue-${teamIssue.id}`}
          index={index}
          key={teamIssue["id"]}
          type={"team-issue"}
        >
          {provided => (
            <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
              <IssueEntry
                issue={teamIssue.issue}
                meetingId={meetingStore.currentMeeting.id}
                dragHandleProps={...provided.dragHandleProps}
                meeting={true}
                leftShareContainer={true}
              />
            </IssueContainer>
          )}
        </Draggable>
      ));
    };

    const renderIssuesBody = () => {
      return (
        <IssuesBodyContainer>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={meetingStore.currentMeeting.teamId}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewIssuePlus>
            <AddNewIssueText> Add a New { (meetingStore.currentMeeting.meetingType === MeetingTypes.FORUM_MONTHLY) ? "Topic" : "Issue"}</AddNewIssueText>
          </AddNewIssueContainer>
          <Droppable droppableId={"team-issues-container"} type={"team-issue"}>
            {(provided, snapshot) => (
              <IssuesContainer ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                {renderIssuesList()}
                {provided.placeholder}
              </IssuesContainer>
            )}
          </Droppable>
        </IssuesBodyContainer>
      );
    };

    return (
      <Container>
        <IssuesHeader
          showOpenIssues={showOpenIssues}
          setShowOpenIssues={setShowOpenIssues}
          issuesText={(meetingStore.currentMeeting.meetingType === MeetingTypes.FORUM_MONTHLY) ? "Parking Lot" : "Team's Issues"}
          teamId={team_id}
          meetingId={meetingStore.currentMeeting.id}
        />
        {renderIssuesBody()}
      </Container>
    );
  },
);

const Container = styled(HomeContainerBorders)`
  margin-left: 15px;
  margin-right: auto;
  min-width: 500px;
  width: 50%;
  margin-top: 0;
`;

const IssuesBodyContainer = styled.div`
  padding: 0px 0px 6px 10px;
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: -5px;
  padding-left: 4px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type IssuesContainerType = {
  isDraggingOver: boolean;
};

const IssuesContainer = styled.div<IssuesContainerType>`
  overflow-y: auto;
  height: 260px;
`;

const IssueContainer = styled.div<IssueContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type IssueContainerType = {
  borderBottom?: string;
};
