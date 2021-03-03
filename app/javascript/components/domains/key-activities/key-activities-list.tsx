import * as React from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";

interface IKeyActivitiesListProps {
  keyActivities: Array<any>;
}

export const KeyActivitiesList = ({ keyActivities }: IKeyActivitiesListProps): JSX.Element => {
  const renderKeyActivitiesList = () => {
    return keyActivities.map((keyActivity, index) => {
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
      <Droppable droppableId="team-parking-lot-issues" key={"issue"}>
        {(provided, snapshot) => (
          <KeyActivitiesContainer ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
            {renderKeyActivitiesList()}
            {provided.placeholder}
          </KeyActivitiesContainer>
        )}
      </Droppable>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 10px;
  height: inherit;
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

const KeyActivitiesContainer = styled.div``;
