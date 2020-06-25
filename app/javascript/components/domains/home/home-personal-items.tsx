import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";
import { IssuesContainer } from "../issues/issues-container";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesHeader } from "../todays-priorities/todays-priorities-header";

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
    return <NonPrioritiesContainer>Habits</NonPrioritiesContainer>;
  };

  const renderJournalContainer = () => {
    return <NonPrioritiesEndContainer>Journal</NonPrioritiesEndContainer>;
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
`;

const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 40%;
  margin-right: 20px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 20%;
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
