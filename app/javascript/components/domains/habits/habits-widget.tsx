import * as React from "react";
import styled from "styled-components";
import { HabitsHeader, HabitsBody } from "./";
import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";

interface IHabitsProps {
  expanded: string;
  handleChange: any;
}

export const Habits = ({ expanded, handleChange }: IHabitsProps): JSX.Element => {
  return (
    <StyledOverviewAccordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      elevation={0}
    >
      <HabitsHeader expanded={expanded} />
      <HabitsBody />
    </StyledOverviewAccordion>
  );
};
