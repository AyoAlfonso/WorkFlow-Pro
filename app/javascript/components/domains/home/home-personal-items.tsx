import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { HabitsBody, HabitsHeader } from "../habits";
import { IssuesContainer } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { KeyActivitiesContainer } from "../key-activities/key-activities-container";
import { TodaysPrioritiesContainer } from "../todays-priorities/todays-priorities-container";
import { HomeContainerBorders } from "./shared-components";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export const HomePersonalItems = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string | false>(false);

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
      <HabitsAccordionContainer expanded={expanded === "panel1"} onChange={handleChange("panel1")} >
        <HabitsAccordionSummary>
          <HabitsHeader expanded={expanded} />
        </HabitsAccordionSummary>
        <HabitsAccordionDetails>
          <HabitsBody />
        </HabitsAccordionDetails>
      </HabitsAccordionContainer>
    );
  };

  const renderJournalContainer = () => {
    return (
      <Journal expanded={expanded} handleChange={handleChange} />
    );
  };

  const renderIssuesContainer = () => {
    return (
      <IssuesContainer expanded={expanded} handleChange={handleChange} />
    );
  };

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  };

  return (
    <Container>
      <TodaysContainer>
        {renderProritiesContainer()}
      </TodaysContainer>
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

const TodaysContainer = styled.div`
  display: flex;
  height: 420px;
  width: 75%;
`;

const ToolsContainer = styled.div`
  flex-direction: column;
  min-width: 25%;
  margin-right: 5px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;

const HabitsAccordionContainer = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`

const HabitsAccordionSummary = styled(AccordionSummary)`
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  min-width: 224px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HabitsAccordionDetails = styled(AccordionDetails)`
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  min-width: 224px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
