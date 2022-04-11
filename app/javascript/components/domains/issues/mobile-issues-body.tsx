import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps, color, ColorProps } from "styled-system";
import { useMst } from "../../../setup/root";
import { useEffect, useState, useRef } from "react";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { CreateIssueModal } from "./create-issue-modal";
import { IssueEntry } from "./issue-entry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Loading } from "../../shared";
import { sortByPosition } from "~/utils/sorting";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
import { HomeContainerBorders } from "../home/shared-components";
import { Issues } from "./issues-container";
import { toJS } from "mobx";
import { FilterContainer, FilterOptions } from "./issues-body";

interface IMobileIssuesBodyProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
  meetingId?: number | string;
  noShadow?: boolean;
}

export const MobileIssuesBody = observer(
  ({
    showOpenIssues,
    setShowOpenIssues,
    meetingId,
    teamId,
    noShadow,
  }: IMobileIssuesBodyProps): JSX.Element => {
    const {
      issueStore,
      sessionStore,
      companyStore: { company },
    } = useMst();

    const teams = sessionStore.profile.currentCompanyUserTeams;

    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
    const [currentList, setCurrentList] = useState<string>("My Issues");
    const [currentTeamId, setCurrentTeamId] = useState<number>(null);
    const [listSelectorOpen, setListSelectorOpen] = useState<boolean>(false);

    const listRef = useRef<HTMLDivElement>(null);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;
    const listName = currentTeamId
      ? teams.find(team => team.id == currentTeamId).name
      : "" || company.displayFormat == "Forum"
      ? "My Topics"
      : "My Issues";

    useEffect(() => {
      issueStore.fetchIssues();
    }, []);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!listSelectorOpen) return;

        const node = listRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setListSelectorOpen(false);
      };

      if (listSelectorOpen) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [listSelectorOpen]);

    if (R.isNil(issueStore.issues) || R.isNil(sessionStore.profile) || R.isNil(company)) {
      return <Loading />;
    }

    const filteredIssues = () => {
      if (!showOpenIssues) {
        return closedIssues;
      } else if (currentList) {
        return openIssues.filter(issue => issue.personal);
      } else {
        return openIssues.filter(issue => issue.teamId === currentTeamId);
      }
    };

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

    const renderFilterTeamOptions = (): Array<JSX.Element> => {
      return teams.map((team, index) => {
        return (
          <ListOption
            key={team.id}
            onClick={() => {
              setCurrentList("");
              setCurrentTeamId(team.id);
              setListSelectorOpen(false);
            }}
          >
            {team.name}
          </ListOption>
        );
      });
    };

    const renderListSelector = (): JSX.Element => {
      return (
        <ListSelectorContainer ref={listRef}>
          <IconContainer display="flex" onClick={() => setListSelectorOpen(!listSelectorOpen)}>
            <Icon icon={"List"} size={"16px"} iconColor={"primary100"} mr="12px" />
            <ListText>{listName}</ListText>
            {!listSelectorOpen ? (
              <Icon icon={"Chevron-Down"} size={"16px"} iconColor={"primary100"} ml="8px" />
            ) : (
              <ChevronUp icon={"Chevron-Down"} size={"16px"} iconColor={"primary100"} ml="8px" />
            )}
          </IconContainer>
          {listSelectorOpen && (
            <ListDropdownContainer>
              <ListOption
                onClick={() => {
                  setCurrentList("My Issues");
                  setCurrentTeamId(null);
                  setListSelectorOpen(false);
                }}
              >
                {company.displayFormat == "Forum" ? "My Topics" : "My Issues"}
              </ListOption>
              {renderFilterTeamOptions()}
            </ListDropdownContainer>
          )}
        </ListSelectorContainer>
      );
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = currentTeamId
        ? filteredIssues()
        : filteredIssues().filter(issue => issue.user.id === sessionStore.profile.id);
      return sortByPosition(issues).map((issue, index) => (
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
      ));
    };
    return (
      <>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        {renderListSelector()}
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

const IssueContainer = styled.div``;

const ListDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  width: 10em;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000029;
  z-index: 5;
  padding: 1em 0;
  margin-top: 5px;
`;

const ListOption = styled.span`
  display: block;
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  padding: 0.5em 1em;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const ListSelectorContainer = styled.div`
  position: relative;
  margin-top: 1.5em;
  margin-left: 1em;
  margin-bottom: 1em;
`;

type IconContainerProps = {
  ml?: string;
  display?: string;
  cursor?: string;
  mr?: string;
};

const IconContainer = styled.div<IconContainerProps>`
  margin-left: ${props => (props.ml ? props.ml : "none")};
  margin-right: ${props => (props.mr ? props.mr : "none")};
  display: ${props => (props.display ? props.display : "block")};
  align-items: center;
  cursor: ${props => (props.cursor ? props.cursor : "default")};
  position: relative;
`;

const ListText = styled.span`
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  font-family: Exo;
  font-weight: bold;
  margin-top: 3px;
`;

const IssuesList = styled("div")``;

const ChevronUp = styled(Icon)`
  transform: rotate(180deg);
`;
