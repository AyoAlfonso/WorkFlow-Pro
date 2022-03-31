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
import Modal from "styled-react-modal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Loading } from "../../shared";
import { sortByPosition } from "~/utils/sorting";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
import { HomeContainerBorders } from "../home/shared-components";
import { IIssue } from "../../../models/issue";

import { List } from "@material-ui/core";
import { IssueModalContent } from "./issue-modal-content";

interface IIssuesBodyProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
  meetingId?: number | string;
  noShadow?: boolean;
}

export const IssuesBody = observer(
  ({
    showOpenIssues,
    setShowOpenIssues,
    meetingId,
    teamId,
    noShadow,
  }: IIssuesBodyProps): JSX.Element => {
    const {
      issueStore,
      sessionStore,
      companyStore: { company },
    } = useMst();
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);

    const [issueModalOpen, setIssueModalOpen] = useState<boolean>(false);
    const [currentIssue, setCurrentIssue] = useState<IIssue | any>({});

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
                  setIssueModalOpen={setIssueModalOpen}
                  setCurrentIssue={setCurrentIssue}
                  currentIssue={currentIssue}
                />
              </IssueContainer>
            )}
          </Draggable>
        ),
      );
    };

    return (
      <>
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
            <IssuesBodyContainer meeting={meetingId} noShadow={noShadow}>
              <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
                <AddNewIssuePlus>
                  <Icon icon={"Plus"} size={16} iconColor={"primary100"} />
                </AddNewIssuePlus>
                <AddNewIssueText>
                  {`Add ${company.displayFormat == "Forum" ? "Topic" : "Issue"}`}
                </AddNewIssueText>
              </AddNewIssueContainer>
              <IssuesContainer
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
                meeting={meetingId}
              >
                <IssuesList>{renderIssuesList()}</IssuesList>
                {provided.placeholder}
              </IssuesContainer>
            </IssuesBodyContainer>
          )}
        </Droppable>
        <StyledModal
          isOpen={issueModalOpen}
          onBackgroundClick={e => {
            setIssueModalOpen(false);
          }}
        >
          <IssueModalContent issue={currentIssue} setIssueModalOpen={setIssueModalOpen} />
        </StyledModal>
      </>
    );
  },
);

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
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.primary100};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type IssuesContainerType = {
  isDraggingOver?: any;
  meeting?: any;
};

const IssuesContainer = styled.div<IssuesContainerType>`
  margin-bottom: 8px;
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : !props.meeting && "white"};
`;

const IssueContainer = styled.div``;

type IssuesBodyContainerProps = {
  meeting?: any;
  noShadow?: boolean;
};

export const IssuesBodyContainer = styled(HomeContainerBorders)<IssuesBodyContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 224px;
  margin-right: 20px;
  box-shadow: ${props => (props.meeting || props.noShadow) && "none"};
`;

export const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: flex-end;
  align-items: center;
`;

export const FilterOptions = styled.p<ColorProps & SpaceProps>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;

const StyledModal = Modal.styled`
  width: 60rem;
  min-height: 6.25em;
  border-radius: 8px;
  height: 50em;
  max-height: 90%;
  overflow: auto;
  background-color: ${props => props.theme.colors.white};

  @media only screen and (max-width: 768px) {
    width: 23rem;
  }
`;

const IssuesList = styled("div")``;
