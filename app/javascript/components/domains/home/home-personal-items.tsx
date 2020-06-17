import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";
import { IssuesContainer } from "./issues/issues-container";

export const HomePersonalItems = (): JSX.Element => {
  const renderProritiesContainer = () => {
    return (
      <PrioritiesContainer>
        Today's Priorities / Key Activities
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
