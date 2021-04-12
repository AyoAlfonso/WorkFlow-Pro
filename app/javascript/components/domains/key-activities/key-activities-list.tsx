import * as React from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { ColumnContainer, ColumnSubHeaderContainer } from "~/components/shared/styles/row-style";
interface IKeyActivitiesListProps {
  keyActivities: Array<any>;
  droppableId: string;
}

export const KeyActivitiesList = observer(
  ({ keyActivities, droppableId }: IKeyActivitiesListProps): JSX.Element => {
    const splittedDroppableId = droppableId.split("-");
    const updateId = splittedDroppableId[splittedDroppableId.length - 1];

    const { keyActivityStore } = useMst();

    if (keyActivityStore.loading) {
      return <Loading />;
    }

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
      <KeyActivitiesListStyleContainer>
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
      </KeyActivitiesListStyleContainer>
    );
  },
);

//used internally or just for styling export
export const KeyActivitiesListStyleContainer = styled.div`
  margin-top: 10px;
  height: 100%;
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type KeyActivitiesContainerType = {
  isDraggingOver: any;
};

const KeyActivitiesContainer = styled.div<KeyActivitiesContainerType>`
  height: 100%;
`;

///COMMON STYLING COMPONENTS FOR KEY ACTIVITIES
type ContainerProps = {
  width?: string;
};

export const KeyActivitiesWrapperContainer = styled.div<ContainerProps>`
  display: flex;
  width: ${props => props.width || "75%"};
`;

export const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;

//column stles and subheader styles match row-styles in overall,
export const KeyActivityColumnStyleListContainer = ColumnContainer;

export const KeyActivityListSubHeaderContainer = ColumnSubHeaderContainer;
