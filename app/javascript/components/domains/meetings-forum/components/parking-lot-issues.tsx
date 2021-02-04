import * as React from "react";
import { useState } from "react";
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

interface ParkingLotIssuesProps {
  teamId: number | string;
  upcomingForumMeeting: any;
}

export const ParkingLotIssues = observer(
  ({ teamId, upcomingForumMeeting }: ParkingLotIssuesProps): JSX.Element => {
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

    const renderIssuesList = (): Array<JSX.Element> => {
      const startIndex = issueStore.openMeetingScheduledTeamIssues.length;
      return issueStore.openMeetingParkingLotTeamIssues.map((teamIssue, index) => (
        <Draggable
          draggableId={`team_issue-${teamIssue.id}:meeting_id-${upcomingForumMeeting.id}`}
          index={startIndex + index}
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
          <HeaderText> {t("meetingForum.parkingLotIssues.title")} </HeaderText>
        </HeaderContainer>
        <FilterContainer>
          <SubHeaderText> {t("meetingForum.parkingLotIssues.subTitle")} </SubHeaderText>
          <Count>{issueStore.openMeetingParkingLotTeamIssues.length}</Count>
          <WidgetHeaderSortButtonMenu
            onButtonClick={setSortOptionsOpen}
            onMenuItemClick={handleSortMenuItemClick}
            menuOpen={sortOptionsOpen}
            menuOptions={sortMenuOptions}
            ml={"15px"}
          />
        </FilterContainer>
        <CreateIssueContainer>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={teamId}
            meetingId={upcomingForumMeeting.id}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewIssuePlus>
            <AddNewIssueText> Add a Topic</AddNewIssueText>
          </AddNewIssueContainer>
          <Droppable droppableId="team-parking-lot-issues" key={"issue"}>
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

export const HeaderContainer = styled.div`
  display: flex;
`;

export const HeaderText = styled.h2`
  display: flex;
  justify-content: center;
  alignitems: center;
  font-size: 20px;
  font-weight: 600;
`;

export const SubHeaderText = styled.h6`
  display: flex;
  justify-content: center;
  alignitems: center;
  font-size: 16px;
  color: ${props => props.theme.colors.grey60};
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CreateIssueContainer = styled.div`
  padding: 0px 0px 15px 0px;
`;

export const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 5px;
  color: ${props => props.theme.colors.grey80};
`;

export const AddNewIssueText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

export const AddNewIssueContainer = styled(HomeContainerBorders)`
  display: flex;
  margin: 8px 5px 8px 5px;
  cursor: pointer;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

export const IssuesContainer = styled.div<IssuesContainerType>`
  overflow-y: auto;
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
  min-height: 320px;
`;

export const IssueContainer = styled(HomeContainerBorders)`
  display: flex;
  margin: 8px 5px 8px 5px;
`;

export type IssuesContainerType = {
  isDraggingOver?: any;
};

//currently count is a hack to get MST to rerender on changes to the open / scheduled filter
export const Count = styled.div`
  display: none;
`;
