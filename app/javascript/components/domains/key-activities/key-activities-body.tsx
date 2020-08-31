import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "~/themes";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared";
import { Icon } from "../../shared/icon";
import { CreateKeyActivityModal } from "./create-key-activity-modal";
import { KeyActivityEntry } from "./key-activity-entry";

interface IKeyActivitiesBodyProps {
  showAllKeyActivities: boolean;
  borderLeft?: string;
}

export const KeyActivitiesBody = observer(
  (props: IKeyActivitiesBodyProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { showAllKeyActivities, borderLeft } = props;
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    const outstandingMasterActivities = masterKeyActivities.filter(
      keyActivity => !keyActivity.completedAt,
    );
    const completedMasterActivities = masterKeyActivities.filter(
      keyActivity => keyActivity.completedAt,
    );

    useEffect(() => {
      keyActivityStore.fetchKeyActivities();
    }, []);

    const renderKeyActivitiesList = (): any => {
      const { loading, loadingList } = keyActivityStore;
      if (loading && loadingList === "weekly-activities") {
        return <Loading />;
      } else if (showAllKeyActivities) {
        return (
          <>
            {renderOutstandingMasterActivitiesList()}
            {renderCompletedMasterActivitiesList()}
          </>
        );
      } else {
        return weeklyKeyActivities.map((keyActivity, index) => (
          <Draggable
            draggableId={keyActivity["id"].toString()}
            index={index}
            key={keyActivity["id"]}
          >
            {provided => (
              <KeyActivityContainer
                key={keyActivity["id"]}
                ref={provided.innerRef}
                {...provided.draggableProps}
              >
                <KeyActivityEntry
                  keyActivity={keyActivity}
                  dragHandleProps={...provided.dragHandleProps}
                />
              </KeyActivityContainer>
            )}
          </Draggable>
        ));
      }
    };

    const renderOutstandingMasterActivitiesList = (): Array<JSX.Element> => {
      const completedMasterActivitiesPresent = completedMasterActivities.length > 0;
      return outstandingMasterActivities.map((keyActivity, index) => {
        const lastElement = index == outstandingMasterActivities.length - 1;

        return (
          <KeyActivityContainer
            key={keyActivity["id"]}
            borderBottom={
              completedMasterActivitiesPresent &&
              lastElement &&
              `1px solid ${baseTheme.colors.grey40}`
            }
          >
            <KeyActivityEntry keyActivity={keyActivity} />
          </KeyActivityContainer>
        );
      });
    };

    const renderCompletedMasterActivitiesList = (): Array<JSX.Element> => {
      return completedMasterActivities.map((keyActivity, index) => (
        <KeyActivityContainer key={keyActivity["id"]}>
          <KeyActivityEntry keyActivity={keyActivity} />
        </KeyActivityContainer>
      ));
    };

    return (
      <Container borderLeft={borderLeft}>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultTypeAsWeekly={!showAllKeyActivities}
        />
        <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
          <AddNewKeyActivityPlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewKeyActivityPlus>
          <AddNewKeyActivityText> Add New Pyn</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>
        <Droppable droppableId="weekly-activities">
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

type ContainerProps = {
  borderLeft?: string;
};

const Container = styled.div<ContainerProps>`
  ${color}
  padding: 0px 0px 6px 0px;
  border-left: ${props => props.borderLeft || `1px solid ${props.theme.colors.grey40}`};
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 14pt;
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
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const KeyActivitiesContainer = styled.div<KeyActivitiesContainerType>`
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
  overflow-y: auto;
  height: 260px;
`;

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type KeyActivitiesContainerType = {
  isDraggingOver?: any;
};

type KeyActivityContainerType = {
  borderBottom?: string;
};
