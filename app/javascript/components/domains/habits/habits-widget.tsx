import * as React from "react";
import styled from "styled-components";
import { HabitsHeader, HabitsBody } from "./";
import { Accordion } from '~/components/shared/accordion';

interface IHabitsProps {
  expanded: string | false;
  handleChange: any;
}

export const Habits = ({
  expanded,
  handleChange
}: IHabitsProps): JSX.Element => {

  return (
    <HabitsAccordion 
      expanded={expanded === "panel1"} 
      onChange={handleChange("panel1")} 
      elevation={0}
    >
      <HabitsHeader expanded={expanded} />
      <HabitsBody />
    </HabitsAccordion>
  )

}

const HabitsAccordion = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;
