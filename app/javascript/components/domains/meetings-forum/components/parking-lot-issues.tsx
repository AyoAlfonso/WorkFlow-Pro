import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/new-widget-header-sort-button-menu";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { Icon, Text } from "~/components/shared";
import { IssueEntry } from "../../issues/issue-entry";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { space, SpaceProps, color, ColorProps } from "styled-system";

interface ParkingLotIssuesProps {
  teamId: number | string;
  upcomingForumMeeting: any;
  descriptionText?: string;
}

export const ParkingLotIssues = observer(
  ({ teamId, upcomingForumMeeting, descriptionText }: ParkingLotIssuesProps): JSX.Element => {
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const {
      issueStore: {
        openMeetingScheduledTeamIssues,
        closedMeetingParkingLotTeamIssues,
        openMeetingParkingLotTeamIssues,
        closedMeetingScheduledTeamIssues,
        sortIssuesByPriority,
      },
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
      const issues = showOpenIssues
        ? openMeetingParkingLotTeamIssues
        : closedMeetingParkingLotTeamIssues;
      const startIndex = showOpenIssues
        ? openMeetingScheduledTeamIssues.length
        : closedMeetingScheduledTeamIssues.length;

      return issues.map((teamIssue, index) => (
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
        <StyledFilterContainer>
          <DescriptionText>
            {" "}
            {descriptionText || t("meetingForum.parkingLotIssues.subTitle")}{" "}
          </DescriptionText>
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
        </StyledFilterContainer>
        <CreateIssueContainer>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={teamId}
            meetingId={upcomingForumMeeting.id}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={20} />
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

export const SubHeaderText = styled.div`
  display: flex;
  justify-content: center;
  alignitems: center;
  font-size: 12px;
  color: ${props => props.theme.colors.grey60};
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
  margin-left: 5px;
`;

export const CreateIssueContainer = styled.div`
  padding: 0px 0px 15px 0px;
`;

export const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
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

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  font-size: 12px;
  margin-bottom: 25px;
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
