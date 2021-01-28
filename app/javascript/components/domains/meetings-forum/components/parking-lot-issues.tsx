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

interface ParkingLotIssuesProps {
  teamId: number | string;
  upcomingForumMeeting: any;
}

export const ParkingLotIssues = observer(
  (props: ParkingLotIssuesProps): JSX.Element => {
  const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
  const { teamId, upcomingForumMeeting } = props;
  const { issueStore } = useMst();
  const openTeamIssues = issueStore.openTeamIssues;
  const { t } = useTranslation();

  useEffect(() => {
    if (teamId) {
      issueStore.fetchTeamIssues(teamId);
    } else {
      issueStore.fetchIssues();
    }
  }, []);

  const sortMenuOptions = [
    {
      label: "Sort by Priority",
      value: "by_priority",
    },
  ];

  const handleSortMenuItemClick = value => {
    setSortOptionsOpen(false);
    issueStore.sortIssuesByPriority({ sort: value, teamId: teamId, meetingId: upcomingForumMeeting.id });
  };

  const renderIssuesList = (): Array<JSX.Element> => {
    return openTeamIssues.map((teamIssue, index) => (
      <Draggable
        draggableId={`issue-${teamIssue.id}_forumMeetingId-${upcomingForumMeeting.id}`}
        index={index}
        key={teamIssue["id"]}
        type={"issue"}
      >
        {provided => (
          <IssueContainer 
            key={teamIssue["id"]}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <IssueEntry 
              issue={teamIssue.issue} 
              meeting={true} 
              pageEnd={true} 
              meetingId={upcomingForumMeeting.id}
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
        />
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
          <AddNewIssueText> Add a Topic</AddNewIssueText>
        </AddNewIssueContainer>
        <Droppable droppableId="scheduled-issues" key={"issue"} >
          {(provided, snapshot) => (
            <IssuesContainer
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {renderIssuesList()}
              {provided.placeholder}
            </IssuesContainer>
          )}
        </Droppable>
      </Container>
    </>
  );
});

const HeaderContainer = styled.div`
  display: flex;
`;

const HeaderText = styled.h2`
  display: flex;
  justify-content: center;
  alignItems: center;
  font-size: 20px;
  font-weight: 600;
`;

const SubHeaderText = styled.h6`
  display: flex;
  justify-content: center;
  alignItems: center;
  font-size: 16px;
  color: ${props => props.theme.colors.grey60};
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  padding: 0px 0px 15px 0px;
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 5px;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewIssueContainer = styled(HomeContainerBorders)`
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

const IssuesContainer = styled.div<IssuesContainerType>`
  overflow-y: auto;
  background-color: ${props => 
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
`;

const IssueContainer = styled(HomeContainerBorders)`
  display: flex;
  margin: 8px 5px 8px 5px;
`;

type IssuesContainerType = {
  isDraggingOver?: any;
};
