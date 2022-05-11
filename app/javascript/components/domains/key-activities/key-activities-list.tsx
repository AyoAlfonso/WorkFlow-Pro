import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { IKeyActivity } from "~/models/key-activity";
import { ColumnContainer, ColumnSubHeaderContainer } from "~/components/shared/styles/row-style";
import { KeyActivityModalContent } from "./key-activity-modal-content";
import { sortByPosition } from "~/utils/sorting";
interface IKeyActivitiesListProps {
  keyActivities: Array<any>;
  droppableId: string;
  loading?: boolean;
}

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
  };
}
export const KeyActivitiesList = observer(
  ({ keyActivities, droppableId, loading }: IKeyActivitiesListProps): JSX.Element => {
    const splittedDroppableId = droppableId.split("-");
    const updateId = splittedDroppableId[splittedDroppableId.length - 1];

    const [keyActivityModalOpen, setKeyActivityModalOpen] = useState<boolean>(false);

    const { keyActivityStore } = useMst();

    if (loading && keyActivityStore.loading) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    const renderKeyActivitiesList = () => {
      return sortByPosition(keyActivities).map((keyActivity, index) => {
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
                {provided.placeholder}
              </KeyActivityContainer>
            )}
          </Draggable>
        );
      });
    };

    return (
      // <></>
      <KeyActivitiesListStyleContainer>
        <Droppable droppableId={droppableId} key={"keyActivity"}>
          {(provided, snapshot) => (
            <KeyActivitiesContainer
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              // style={getStyle(provided.draggableProps.style, snapshot)}
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
  // margin-top: 10px;
  height: 100%;
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  // border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
  // margin-bottom: 8px;
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
  transition-duration: 1s;
`;

//column stles and subheader styles match row-styles in overall,
export const KeyActivityColumnStyleListContainer = ColumnContainer;

export const KeyActivityListSubHeaderContainer = ColumnSubHeaderContainer;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
