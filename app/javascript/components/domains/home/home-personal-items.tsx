import * as React from "react";
import styled from "styled-components";
import { HabitsBody, HabitsHeader } from "../habits";
import { IssuesContainer } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesContainer } from "../todays-priorities/todays-priorities-container";
import { HomeContainerBorders } from "./shared-components";

export const HomePersonalItems = (): JSX.Element => {
  const renderProritiesContainer = () => {
    return (
      <PrioritiesContainer>
        <PrioritiesHeaderContainer>
          <TodaysPrioritiesContainer />
          <KeyActivitiesContainer />
        </PrioritiesHeaderContainer>
      </PrioritiesContainer>
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
  width: 39.2%;
  min-width: 448px;
  margin-right: 20px;
  margin-left: 5px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 19.6%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const NonPrioritiesContainer = styled(NonPrioritiesEndContainer)`
  margin-right: 20px;
  min-width: 244px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
