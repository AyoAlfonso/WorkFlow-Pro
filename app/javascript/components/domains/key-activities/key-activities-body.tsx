import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared";
import { Icon } from "../../shared/icon";
import { CreateKeyActivityModal } from "./create-key-activity-modal";
import { KeyActivityEntry } from "./key-activity-entry";
import { useTranslation } from "react-i18next";
import { sortByPosition } from "~/utils/sorting";

interface IKeyActivitiesBodyProps {
  showAllKeyActivities: boolean;
  borderLeft?: string;
  disableDrag?: boolean;
}

export const KeyActivitiesBody = observer(
  (props: IKeyActivitiesBodyProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { t } = useTranslation();
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
        const completedMasterActivitiesPresent = completedMasterActivities.length > 0;
        const outstandingMasterActivitiesContainerHeight = outstandingMasterActivities.length * 54;
        return (
          <>
            <OutstandingMAsterActivitiesListContainer
              height={outstandingMasterActivitiesContainerHeight}
            >
              {renderOutstandingMasterActivitiesList()}
            </OutstandingMAsterActivitiesListContainer>

            <CompletedMasterActivitiesListContainer
              completedMasterActivitiesPresent={completedMasterActivitiesPresent}
            >
              {renderCompletedMasterActivitiesList()}
            </CompletedMasterActivitiesListContainer>
          </>
        );
      } else {
        return sortByPosition(weeklyKeyActivities).map((keyActivity, index) =>
          props.disableDrag ? (
            <KeyActivityContainer key={keyActivity["id"]}>
              <KeyActivityEntry keyActivity={keyActivity} />
            </KeyActivityContainer>
          ) : (
            <Draggable
              draggableId={`keyActivity-${keyActivity.id}`}
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
                  <KeyActivityEntry
                    keyActivity={keyActivity}
                    dragHandleProps={...provided.dragHandleProps}
                  />
                </KeyActivityContainer>
              )}
            </Draggable>
          ),
        );
      }
    };

    const renderOutstandingMasterActivitiesList = (): Array<JSX.Element> => {
      return sortByPosition(outstandingMasterActivities).map((keyActivity, index) => {
        return (
          <Draggable
            draggableId={`keyActivity-${keyActivity.id}`}
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
                <KeyActivityEntry
                  keyActivity={keyActivity}
                  dragHandleProps={...provided.dragHandleProps}
                />
              </KeyActivityContainer>
            )}
          </Draggable>
        );
      });
    };

    const renderCompletedMasterActivitiesList = (): Array<JSX.Element> => {
      return sortByPosition(completedMasterActivities).map((keyActivity, index) => (
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
          <AddNewKeyActivityText> {t("keyActivities.addTitle")}</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>

        <Droppable
          droppableId={showAllKeyActivities ? "master-activities" : "weekly-activities"}
          type={"keyActivity"}
        >
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

type CompletedMasterActivitiesListContainerType = {
  completedMasterActivitiesPresent: boolean;
};

const CompletedMasterActivitiesListContainer = styled.div<
  CompletedMasterActivitiesListContainerType
>`
  border-top: ${props =>
    props.completedMasterActivitiesPresent && `1px solid ${props.theme.colors.grey40}`};
`;

type OutstandingMAsterActivitiesListContainerType = {
  height: number;
};

const OutstandingMAsterActivitiesListContainer = styled.div<
  OutstandingMAsterActivitiesListContainerType
>`
  height: ${props => props.height}px;
`;
