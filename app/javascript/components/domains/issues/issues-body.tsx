import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps, color, ColorProps } from "styled-system";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { CreateIssueModal } from "./create-issue-modal";
import { IssueEntry } from "./issue-entry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Loading } from "../../shared";
import { sortByPosition } from "~/utils/sorting";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
import { HomeContainerBorders } from "../home/shared-components";
import { AccordionDetails } from "~/components/shared/accordion-components";

interface IIssuesBodyProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
  meetingId?: number | string;
}

export const IssuesBody = observer(
  ({ showOpenIssues, setShowOpenIssues, meetingId, teamId }: IIssuesBodyProps): JSX.Element => {
    const {
      issueStore,
      sessionStore,
      companyStore: { company },
    } = useMst();
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    useEffect(() => {
      issueStore.fetchIssues();
    }, []);

    if (R.isNil(issueStore.issues) || R.isNil(sessionStore.profile) || R.isNil(company)) {
      return <Loading />;
    }

    const sortMenuOptions = [
      {
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      issueStore.sortIssuesByPriority({ sort: value, teamId: teamId, meetingId: meetingId });
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return sortByPosition(issues.filter(issue => issue.user.id === sessionStore.profile.id)).map(
        (issue, index) => (
          <Draggable draggableId={`issue-${issue.id}`} index={index} key={issue.id} type={"issue"}>
            {provided => (
              <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
                <IssueEntry
                  issue={issue}
                  dragHandleProps={...provided.dragHandleProps}
                  leftShareContainer={true}
                />
              </IssueContainer>
            )}
          </Draggable>
        ),
      );
    };

    return (
      <AccordionDetailsContainer>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        <FilterContainer>
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
          />
        </FilterContainer>
        <Droppable droppableId={"issues-container"} type={"issue"}>
          {(provided, snapshot) => (
            <IssuesBodyContainer>
              <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
                <AddNewIssuePlus>
                  <Icon icon={"Plus"} size={16} />
                </AddNewIssuePlus>
                <AddNewIssueText>
                  {`Add a New ${company.displayFormat == "Forum" ? "Parking Lot" : "Issue"}`}
                </AddNewIssueText>
              </AddNewIssueContainer>
              <IssuesContainer ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                {renderIssuesList()}
                {provided.placeholder}
              </IssuesContainer>
            </IssuesBodyContainer>
          )}
        </Droppable>
      </AccordionDetailsContainer>
    );
  },
);

const AccordionDetailsContainer = styled(AccordionDetails)`
  padding: 0px 0px 15px 0px;
  display: flex;
  flex-direction: column;
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
  margin-right: 8px;
  padding-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type TIssuesContainerType = {
  isDraggingOver?: any;
};

const IssuesContainer = styled.div<TIssuesContainerType>`
  overflow-y: auto;
  margin-bottom: 8px;
  height: 260px;
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
`;

const IssueContainer = styled.div``;

const IssuesBodyContainer = styled(HomeContainerBorders)`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 224px;
  margin-right: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: flex-end;
  align-items: center;
`;

const FilterOptions = styled.p<ColorProps & SpaceProps>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;
