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
import { space, SpaceProps, color, ColorProps } from "styled-system";

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
  descriptionText?: string;
}

//this displays all issues for the upcoming forum meeting that are highlighted to be discussed
export const ScheduledIssues = observer(
  ({ teamId, upcomingForumMeeting, descriptionText }: ScheduledIssuesProps): JSX.Element => {
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const {
      issueStore: { sortIssues, openMeetingScheduledTeamIssues, closedMeetingScheduledTeamIssues },
      companyStore,
    } = useMst();
    const { t } = useTranslation();
    const isForum = companyStore.company?.displayFormat == "Forum";

    const sortOptionsForCompany = [
      {
        label: "Sort by Upvotes",
        value: "by_upvotes",
      },
      {
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    const sortOptionsForForum = [
      {
        label: "Sort by Upvotes",
        value: "by_upvotes",
      },
      {
        label: "Sort by Due Date",
        value: "by_due_date",
      },
      {
        label: "Sort by Topic Type",
        value: "by_topic_type",
      },
    ];

    const sortMenuOptions = isForum ? sortOptionsForForum : sortOptionsForCompany;

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      sortIssues({
        sort: value,
        teamId: teamId,
        meetingId: upcomingForumMeeting.id,
        nested: true,
      });
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues
        ? openMeetingScheduledTeamIssues
        : closedMeetingScheduledTeamIssues;

      return issues.map((teamIssue, index) => (
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
                scheduledIssue={true}
              />
            </IssueContainer>
          )}
        </Draggable>
      ));
    };

    return (
      <>
        <StyledFilterContainer>
          <DescriptionText>
            {" "}
            {descriptionText || t("meetingForum.scheduledIssues.subTitle")}{" "}
          </DescriptionText>
          <FilterOptionsContainer>
            <FilterOptions
              onClick={() => setShowOpenIssues(true)}
              mr={"15px"}
              color={showOpenIssues ? "primary100" : "grey40"}
            >
              Open
            </FilterOptions>
            <FilterOptions
              onClick={() => setShowOpenIssues(false)}
              color={!showOpenIssues ? "primary100" : "grey40"}
            >
              Closed
            </FilterOptions>
            <WidgetHeaderSortButtonMenu
              onButtonClick={setSortOptionsOpen}
              onMenuItemClick={handleSortMenuItemClick}
              menuOpen={sortOptionsOpen}
              menuOptions={sortMenuOptions}
              ml={"15px"}
              mt={"-12px"}
            />
          </FilterOptionsContainer>
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
              <Icon icon={"Plus"} size={20} iconColor={"primary100"} />
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
  margin-left: 0;
  width: 70%;
`;

const StyledFilterContainer = styled(FilterContainer)`
  margin-left: 0;
`;

const FilterOptions = styled.p<ColorProps & SpaceProps>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 0;
`;

const FilterOptionsContainer = styled.div`
  display: flex;
`;
