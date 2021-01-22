import * as React from "react";
import styled from "styled-components";
import { HabitsHeader, HabitsBody } from "./";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { withStyles } from '@material-ui/core/styles';

interface IHabitsProps {
  expanded: string | false;
  handleChange: any;
}

export const Habits = ({
  expanded,
  handleChange
}: IHabitsProps): JSX.Element => {

  return (
    <HabitsAccordionContainer expanded={expanded === "panel1"} onChange={handleChange("panel1")} >
      <HabitsAccordionSummary>
        <HabitsHeader expanded={expanded} />
      </HabitsAccordionSummary>
      <HabitsAccordionDetails>
        <HabitsBody />
      </HabitsAccordionDetails>
    </HabitsAccordionContainer>
  )

}

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
