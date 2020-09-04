import { observer } from "mobx-react";
import * as React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared";
import { KeyActivityEntry } from "../key-activities/key-activity-entry";

export const TodaysPrioritiesBody = observer(
  (): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { todaysPriorities } = keyActivityStore;

    const renderTodaysPrioritiesList = (): any => {
      const { loading, loadingList } = keyActivityStore;
      if (loading && loadingList === "todays-priorities") {
        return <Loading />;
      } else {
        return todaysPriorities.map((keyActivity, index) => (
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
        ));
      }
    };

    return (
      <Container>
        <Droppable droppableId="todays-priorities" type={"keyActivity"}>
          {(provided, snapshot) => (
            <TodaysPriotitiesContainer
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {renderTodaysPrioritiesList()}
              {provided.placeholder}
            </TodaysPriotitiesContainer>
          )}
        </Droppable>
      </Container>
    );
  },
);

const Container = styled.div`
  ${color}
  padding: 0px 0px 6px 10px;
`;

const TodaysPriotitiesContainer = styled.div<TodaysPriotitiesContainerType>`
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
  overflow-y: auto;
  height: 260px;
`;

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type TodaysPriotitiesContainerType = {
  isDraggingOver?: any;
};

type KeyActivityContainerType = {
  borderBottom?: string;
};
