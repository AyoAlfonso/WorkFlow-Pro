import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";
import { IssuesContainer } from "../issues/issues-container";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesHeader } from "../todays-priorities/todays-priorities-header";
import { Journal } from "../journal/journal";
import { HabitsHeader } from "../habits";

export const HomePersonalItems = (): JSX.Element => {
  const renderProritiesContainer = () => {
    return (
      <PrioritiesContainer>
        <PrioritiesHeaderContainer>
          <TodayPrioritiesHeaderContainer>
            <TodaysPrioritiesHeader />
          </TodayPrioritiesHeaderContainer>
          <KeyActivitiesContainer />
        </PrioritiesHeaderContainer>
      </PrioritiesContainer>
    );
  };

  const renderHabitsContainer = () => {
    return (
      <NonPrioritiesContainer>
        <HabitsHeader />
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
  height: 400px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 40%;
  min-width: 480px;
  margin-right: 20px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 20%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
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
