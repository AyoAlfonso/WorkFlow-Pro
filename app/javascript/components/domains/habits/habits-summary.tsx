import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import * as moment from "moment";
import { EditHabit } from "./edit-habit";

import {
  HabitsTable,
  HabitsTableHead,
  HabitsTableBody,
  HabitsTableRow,
  HabitsTableHeaderCell,
  HabitsTableDataCell,
} from "./habits-styles";
import { HabitsTableCircularProgressBar } from "./habits-habit-tracker";
import { baseTheme } from "~/themes";

export const HabitsSummary = observer(
  (): JSX.Element => {
    const {
      habitStore,
      habitStore: { habits, totalFrequency, totalCompleted, totalPercentageCompleted },
    } = useMst();
    useEffect(() => {
      habitStore.fetchHabits();
    }, [habitStore.habits]);

    const renderHabits = () =>
      habits.map((habit, index) => (
        <HabitsTableRow key={`${habit.id}-${index}`}>
          <StyledHabitsTableCenterCell>
            {habit.percentageWeeklyLogsCompleted == 0 ? (
              <HabitsTableCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
            ) : (
              <HabitsTableCircularProgressBar
                color={habit.color}
                value={habit.percentageWeeklyLogsCompleted}
              />
            )}
          </StyledHabitsTableCenterCell>
          <StyledHabitsTableDataCell>
            <HabitsTextContainer color={habit.color}>{`${habit.name}`}</HabitsTextContainer>
          </StyledHabitsTableDataCell>
          <StyledHabitsTableCenterCell>
            <HabitsTextContainer color={habit.color}>
              {habit.percentageWeeklyLogsCompleted.toFixed(0)}%
            </HabitsTextContainer>
          </StyledHabitsTableCenterCell>
          <StyledHabitsTableCenterCell>
            <HabitsTextContainer color={habit.color}>
              {habit.weeklyLogsCompletionDifference >= 0 ? "+" : ""}
              {habit.weeklyLogsCompletionDifference.toFixed(0)}%
            </HabitsTextContainer>
          </StyledHabitsTableCenterCell>
          <StyledHabitsTableCenterCell>
            <HabitsTextContainer color={habit.color}>
              {habit.completedCount}/{habit.frequency}
            </HabitsTextContainer>
          </StyledHabitsTableCenterCell>
        </HabitsTableRow>
      ));

    const titleElements = ["Score", "Week", "Total"].map((title, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {title}
      </HabitsTableHeaderCell>
    ));

    return (
      <HabitsTable>
        <HabitsTableHead>
          <HabitsTableRow>
            <HabitsTableHeaderCell />
            <HabitsTableHeaderCellWide />
            {titleElements}
          </HabitsTableRow>
        </HabitsTableHead>
        <HabitsTableBody>{renderHabits()}</HabitsTableBody>
      </HabitsTable>
    );
  },
);

export const HabitsTextContainer = styled.p`
  color: ${props => props.color};
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  &: hover {
    cursor: pointer;
  }
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: lightgrey;
`;

const StyledHabitsTableDataCell = styled(HabitsTableDataCell)`
  padding-right: 5px;
`;

const StyledHabitsTableCenterCell = styled(StyledHabitsTableDataCell)`
  text-align: center;
`;

const HabitsTableHeaderCellWide = styled(HabitsTableHeaderCell)`
  width: 65%;
`;
