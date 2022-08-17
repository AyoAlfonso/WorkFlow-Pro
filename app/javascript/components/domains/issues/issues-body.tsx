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

interface IIssuesBodyProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
  meetingId?: number | string;
  noShadow?: boolean;
  disabled?: boolean;
}

export const IssuesBody = observer(
  ({
    showOpenIssues,
    setShowOpenIssues,
    meetingId,
    teamId,
    noShadow,
    disabled,
  }: IIssuesBodyProps): JSX.Element => {
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

    const isForum = company?.displayFormat == "Forum";

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
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    const sortMenuOptions = isForum ? sortOptionsForForum : sortOptionsForCompany;

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      issueStore.sortIssues({ sort: value, teamId: teamId, meetingId: meetingId, nested: false });
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return issues.filter(issue => issue.user.id === sessionStore.profile.id).map(
        (issue, index) => (
          <Draggable draggableId={`issue-${issue.id}`} index={index} key={issue.id} type={"issue"}>
            {provided => (
              <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
                <IssueEntry
                  issue={issue}
                  // dragHandleProps={...provided?.dragHandleProps}
                  leftShareContainer={true}
                />
              </IssueContainer>
            )}
          </Draggable>
        ),
      );
    };

    return (
      <Container disabled={disabled}>
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
      </Container>
    );
  },
);

type ContainerProps = {
  disabled?: boolean;
}

const Container = styled.div<ContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
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

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
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

const IssuesList = styled("div")``;
