import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared";
import { Icon } from "../../shared/icon";
import { CreateKeyActivityModal } from "./create-key-activity-modal";
import { useTranslation } from "react-i18next";
import { sortByPosition } from "~/utils/sorting";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { Teams } from "../account/teams";

interface IMobileKeyActivitiesBodyProps {}

export const MobileKeyActivitiesBody = observer(
  (props: IMobileKeyActivitiesBodyProps): JSX.Element => {
    const { keyActivityStore, sessionStore } = useMst();
    const { t } = useTranslation();

    const { scheduledGroups } = sessionStore;
    const teams = sessionStore.profile.currentCompanyUserTeams;

    const [listSelectorOpen, setListSelectorOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showCompletedItems, setShowCompletedItems] = useState<boolean>(false);
    const [currentList, setCurrentList] = useState<string>("Today");
    const [currentTeamId, setCurrentTeamId] = useState<number>(null);

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      showCompletedItems
        ? keyActivityStore.fetchCompleteKeyActivities()
        : keyActivityStore.fetchIncompleteKeyActivities();
    }, [showCompletedItems]);

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

    const selectedFilterGroupId = sessionStore.getScheduledGroupIdByName(currentList);

    const completedKeyActivities = keyActivityStore.completedActivities;

    const droppableId = currentList
      ? `scheduled-group-activities-${selectedFilterGroupId}`
      : `team-activities-${currentTeamId}`;
    const splittedDroppableId = droppableId.split("-");
    const updateId = splittedDroppableId[splittedDroppableId.length - 1];

    const filteredKeyActivities = () => {
      if (showCompletedItems) {
        return completedKeyActivities;
      } else if (currentList) {
        return keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(currentList);
      } else {
        return keyActivityStore.incompleteKeyActivitiesByTeamId(currentTeamId);
      }
    };

    const listName = currentTeamId
      ? teams.find(group => group.id == currentTeamId)?.name
      : showCompletedItems
      ? "Completed"
      : currentList === "Today"
      ? "Today's Priorities"
      : currentList;

    const renderListSelector = (): JSX.Element => {
      return (
        <ListSelectorContainer ref={listRef}>
          <IconContainer display="flex" onClick={() => setListSelectorOpen(!listSelectorOpen)}>
            <Icon icon={"List"} size={"16px"} iconColor={"primary100"} mr="12px" />
            <ListText>{listName}</ListText>
            <Icon icon={"Chevron-Down"} size={"16px"} iconColor={"primary100"} ml="8px" />
          </IconContainer>
          {listSelectorOpen && (
            <ListDropdownContainer>
              {renderFilterGroupOptions()}
              {renderFilterTeamOptions()}
              <ListOption
                onClick={() => {
                  setShowCompletedItems(true);
                  setListSelectorOpen(false);
                  setCurrentList("");
                  setCurrentTeamId(null);
                }}
              >
                Completed
              </ListOption>
            </ListDropdownContainer>
          )}
        </ListSelectorContainer>
      );
    };

    const renderFilterGroupOptions = (): Array<JSX.Element> => {
      return scheduledGroups.map((group, index) => {
        return (
          <ListOption
            key={group.id}
            onClick={() => {
              setCurrentList(group.name);
              setCurrentTeamId(null);
              setListSelectorOpen(false);
              setShowCompletedItems(false);
            }}
          >
            {group.name === "Today" ? "Today's Priorities" : group.name}
          </ListOption>
        );
      });
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
              setShowCompletedItems(false);
            }}
          >
            {team.name}
          </ListOption>
        );
      });
    };

    const keyActivities = filteredKeyActivities();

    const renderKeyActivitiesList = () => {
      return keyActivities.map((keyActivity, index) => {
        const draggableId = () => {
          if (isNaN(parseInt(updateId))) {
            return `keyActivity-${keyActivity.id}`;
          } else {
            return `keyActivity-${keyActivity.id}-${updateId}`;
          }
        };

        return (
          <Draggable
            draggableId={draggableId()}
            index={index}
            key={keyActivity["id"]}
            type={"keyActivity"}
          >
            {provided => (
              <KeyActivityContainer
                key={keyActivity["id"]}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <KeyActivityRecord
                  keyActivity={keyActivity}
                  dragHandleProps={...provided.dragHandleProps}
                />
              </KeyActivityContainer>
            )}
          </Draggable>
        );
      });
    };

    return (
      <Container>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultSelectedGroupId={sessionStore.getScheduledGroupIdByName(currentList)}
          defaultSelectedTeamId={currentTeamId}
        />
        {renderListSelector()}
        <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
          <AddNewKeyActivityPlus>
            <Icon icon={"Plus"} size={16} iconColor={"primary100"} />
          </AddNewKeyActivityPlus>
          <AddNewKeyActivityText> {t("keyActivities.addTitle")}</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>
        <Droppable droppableId={droppableId} key={"keyActivity"}>
          {(provided, snapshot) => (
            <KeyActivitiesContainer
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {renderKeyActivitiesList()}
              {provided.placeholder}
            </KeyActivitiesContainer>
          )}
        </Droppable>
      </Container>
    );
  },
);

const Container = styled.div`
  ${color}
  position: relative;
  padding: 0px 0px 6px 0px;
`;

type IconContainerProps = {
  ml?: string;
  display?: string;
  cursor?: string;
  mr?: string;
};

type KeyActivitiesContainerType = {
  isDraggingOver: any;
};

const KeyActivitiesContainer = styled.div<KeyActivitiesContainerType>`
  height: 100%;
`;

const ListDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  width: 10em;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000029;
  z-index: 5;
  padding: 1em 0;
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

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: -5px;
  margin-left: 8px;
  padding-left: 4px;
  &:hover ${AddNewKeyActivityText} {
    color: ${props => props.theme.colors.primary100};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  // border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
  // margin-bottom: 8px;
`;
