import * as React from "react";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/new-widget-header-sort-button-menu";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { Icon, Text } from "~/components/shared";
import { IssueEntry } from "../../issues/issue-entry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import {
  FilterContainer,
  CreateIssueContainer,
  AddNewIssuePlus,
  AddNewIssueText,
  AddNewIssueContainer,
  IssuesContainer,
  IssueContainer,
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
    const {
      issueStore: { sortIssuesByPriority, openMeetingScheduledTeamIssues },
    } = useMst();
    const { t } = useTranslation();

    const sortMenuOptions = [
      {
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      sortIssuesByPriority({
        sort: value,
        teamId: teamId,
        meetingId: upcomingForumMeeting.id,
      });
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      return openMeetingScheduledTeamIssues.map((teamIssue, index) => (
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
        <StyledFilterContainer>
          <DescriptionText> {t("meetingForum.scheduledIssues.subTitle")} </DescriptionText>
          <WidgetHeaderSortButtonMenu
            onButtonClick={setSortOptionsOpen}
            onMenuItemClick={handleSortMenuItemClick}
            menuOpen={sortOptionsOpen}
            menuOptions={sortMenuOptions}
            ml={"15px"}
            mt={"-12px"}
          />
        </StyledFilterContainer>
        <CreateIssueContainer>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={teamId}
            meetingId={upcomingForumMeeting.id}
            meetingEnabled={true}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={20} />
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
        </CreateIssueContainer>
      </>
    );
  },
);

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  font-size: 12px;
  margin-bottom: 25px;
  margin-left: 0;
`;

const StyledFilterContainer = styled(FilterContainer)`
  margin-left: 0;
`;
