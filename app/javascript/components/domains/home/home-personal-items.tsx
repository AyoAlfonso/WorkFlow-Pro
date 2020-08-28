import * as React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { HabitsBody, HabitsHeader } from "../habits";
import { IssuesContainer } from "../issues/issues-container";
import { Journal } from "../journal/journal";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesContainer } from "../todays-priorities/todays-priorities-container";
import { HomeContainerBorders } from "./shared-components";

export const HomePersonalItems = (): JSX.Element => {
  const { keyActivityStore } = useMst();
  const onDragEnd = result => {
    const { destination, source } = result;
    if (!result.destination) {
      return;
    }

    let newPosition = destination.index;
    if (newPosition === source.index && destination.droppableId === source.droppableId) {
      return;
    }

    const keyActivityId = result.draggableId;
    keyActivityStore.updateKeyActivityState(keyActivityId, "position", newPosition + 1);
    if (destination.droppableId === "weekly-activities") {
      keyActivityStore.startLoading("weekly-activities");
      keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", true);
      keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
    } else if (destination.droppableId === "todays-priorities") {
      keyActivityStore.startLoading("todays-priorities");
      keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
      keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", true);
    }
    keyActivityStore.updateKeyActivity(keyActivityId);
  };

  const renderProritiesContainer = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <PrioritiesContainer>
          <PrioritiesHeaderContainer>
            <TodaysPrioritiesContainer />
            <KeyActivitiesContainer />
          </PrioritiesHeaderContainer>
        </PrioritiesContainer>
      </DragDropContext>
    );
  };

  const renderHabitsContainer = () => {
    return (
      <NonPrioritiesContainer>
        <HabitsHeader />
        <HabitsBody />
      </NonPrioritiesContainer>
    );
  };

  const renderJournalContainer = () => {
    return (
      <NonPrioritiesEndContainer>
        <Journal />
      </NonPrioritiesEndContainer>
    );
  };

  const renderIssuesContainer = () => {
    return (
      <NonPrioritiesContainer>
        <IssuesContainer />
      </NonPrioritiesContainer>
    );
  };

  return (
    <Container>
      {renderProritiesContainer()}
      {renderHabitsContainer()}
      {renderIssuesContainer()}
      {renderJournalContainer()}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 420px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 40%;
  min-width: 480px;
  margin-right: 20px;
  margin-left: 5px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 20%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const NonPrioritiesContainer = styled(NonPrioritiesEndContainer)`
  margin-right: 20px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
