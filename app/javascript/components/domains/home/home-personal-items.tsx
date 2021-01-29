import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Habits } from "../habits/habits-widget";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesContainer } from "../todays-priorities/todays-priorities-container";
import { HomeContainerBorders } from "./shared-components";

export const HomePersonalItems = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string>("");

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
  
  const renderJournalContainer = () => {
    return (
      <Journal expanded={expanded} handleChange={handleChange} />
    );
  };

  const renderHabitsContainer = () => {
    return (
      <Habits expanded={expanded} handleChange={handleChange} />
    );
  };

  const renderIssuesContainer = () => {
    return (
      <Issues expanded={expanded} handleChange={handleChange} />
    );
  };

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "")
  };

  return (
    <Container>
      <PrioritiesWrapper>
        {renderProritiesContainer()}
      </PrioritiesWrapper>
      <ToolsContainer>
        {renderJournalContainer()}
        {renderHabitsContainer()}
        {renderIssuesContainer()}
      </ToolsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 100%;
  min-width: 448px;
  margin-right: 20px;
  margin-left: 5px;
`;

const PrioritiesWrapper = styled.div`
  display: flex;
  height: 420px;
  width: 75%;
`;

const ToolsContainer = styled.div`
  flex-direction: column;
  width: 25%;
  margin-left: 50px;
  margin-right: 5px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
