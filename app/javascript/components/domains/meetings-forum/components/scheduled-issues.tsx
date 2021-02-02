import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/new-widget-header-sort-button-menu";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { Icon } from "~/components/shared";
import { IssueEntry } from "../../issues/issue-entry";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { ITeamIssue } from "~/models/team-issue";

import {
  HeaderContainer,
  HeaderText,
  SubHeaderText,
  FilterContainer,
  Container,
  AddNewIssuePlus,
  AddNewIssueText,
  AddNewIssueContainer,
  IssuesContainer,
  IssueContainer,
  IssuesContainerType,
  Count,
} from "./parking-lot-issues";
interface ScheduledIssuesProps {
  teamId: number | string;
  upcomingForumMeeting: any;
}

//this displays all issues for the upcoming forum meeting that are highlighted to be discussed
export const ScheduledIssues = observer(
  ({ teamId, upcomingForumMeeting }: ScheduledIssuesProps): JSX.Element => {
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const { issueStore } = useMst();
    const { t } = useTranslation();

    const sortMenuOptions = [
      {
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      issueStore.sortIssuesByPriority({
        sort: value,
        teamId: teamId,
        meetingId: upcomingForumMeeting.id,
      });
    };

    // const renderIssue = (teamIssue: ITeamIssue, index: number): JSX.Element => (
    //   <Draggable
    //     draggableId={`team_issue-${teamIssue.id}:meeting_id-${upcomingForumMeeting.id}`}
    //     index={index}
    //     key={teamIssue["id"]}
    //     type={"team-issue"}
    //   >
    //     {provided => (
    //       <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
    //         <IssueEntry
    //           issue={teamIssue.issue}
    //           meetingId={upcomingForumMeeting.id}
    //           dragHandleProps={...provided.dragHandleProps}
    //           pageEnd={true}
    //         />
    //       </IssueContainer>
    //     )}
    //   </Draggable>
    // );

    //sample
    // {issueStore.openMeetingScheduledTeamIssues.map((teamIssue, index) =>
    //   renderIssue(teamIssue, index),
    // )}

    const renderIssuesList = (): Array<JSX.Element> => {
      return issueStore.openMeetingScheduledTeamIssues.map((teamIssue, index) => (
        <Draggable
          draggableId={`team_issue-${teamIssue.id}:meeting_id-${upcomingForumMeeting.id}`}
          index={index}
          key={teamIssue["id"]}
          type={"team-issue"}
        >
          {provided => (
            <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
              <IssueEntry
                issue={teamIssue.issue}
                meetingId={upcomingForumMeeting.id}
                dragHandleProps={...provided.dragHandleProps}
                pageEnd={true}
              />
            </IssueContainer>
          )}
        </Draggable>
      ));
    };

    return (
      <>
        <HeaderContainer>
          <HeaderText> {t("meetingForum.scheduledIssues.title")} </HeaderText>
        </HeaderContainer>
        <FilterContainer>
          <SubHeaderText> {t("meetingForum.scheduledIssues.subTitle")} </SubHeaderText>
          <Count>{issueStore.openMeetingScheduledTeamIssues.length}</Count>
          <WidgetHeaderSortButtonMenu
            onButtonClick={setSortOptionsOpen}
            onMenuItemClick={handleSortMenuItemClick}
            menuOpen={sortOptionsOpen}
            menuOptions={sortMenuOptions}
            ml={"15px"}
          />
        </FilterContainer>
        <Container>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={teamId}
            meetingId={upcomingForumMeeting.id}
            meetingEnabled={true}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewIssuePlus>
            <AddNewIssueText> Add a Topic</AddNewIssueText>
          </AddNewIssueContainer>
          <Droppable droppableId="team-scheduled-issues" key={"issue"}>
            {(provided, snapshot) => (
              <IssuesContainer ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                {renderIssuesList()}
                {provided.placeholder}
              </IssuesContainer>
            )}
          </Droppable>
        </Container>
      </>
    );
  },
);
