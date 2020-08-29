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
          <HabitsTableDataCell>
            {habit.percentageWeeklyLogsCompleted == 0 ? (
              <HabitsTableCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
            ) : (
              <HabitsTableCircularProgressBar
                color={habit.color}
                value={habit.percentageWeeklyLogsCompleted}
              />
            )}
          </HabitsTableDataCell>
          <HabitsTableDataCell>
            <HabitsTextContainer color={habit.color}>{`${habit.name}`}</HabitsTextContainer>
          </HabitsTableDataCell>
          <HabitsTableDataCell>
            <HabitsTextContainer color={habit.color}>
              {habit.percentageWeeklyLogsCompleted.toFixed(0)}%
            </HabitsTextContainer>
          </HabitsTableDataCell>
          <HabitsTableDataCell>
            <HabitsTextContainer color={habit.color}>
              {habit.weeklyLogsCompletionDifference >= 0 ? "+" : ""}
              {habit.weeklyLogsCompletionDifference.toFixed(0)}%
            </HabitsTextContainer>
          </HabitsTableDataCell>
          <HabitsTableDataCell>
            <HabitsTextContainer color={habit.color}>
              {habit.completedCount}/{habit.frequency}
            </HabitsTextContainer>
          </HabitsTableDataCell>
        </HabitsTableRow>
      ));

    const titleElements = ["Score", "Week", "Total"].map((title, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {title}
      </HabitsTableHeaderCell>
    ));

    const overallColor = baseTheme.colors.primary100;
    const renderOverall = (
      <HabitsTableRow key={`habit-overall}`}>
        <HabitsTableDataCell>
          {totalCompleted == 0 ? (
            <HabitsTableCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
          ) : (
            <HabitsTableCircularProgressBar color={overallColor} value={totalPercentageCompleted} />
          )}
        </HabitsTableDataCell>
        <HabitsTableDataCell>
          <HabitsTextContainer>Test</HabitsTextContainer>
        </HabitsTableDataCell>
        <HabitsTableDataCell>
          <HabitsTextContainer color={overallColor}>
            {totalCompleted}/{totalFrequency}
          </HabitsTextContainer>
        </HabitsTableDataCell>
        <HabitsTableDataCell></HabitsTableDataCell>
        <HabitsTableDataCell>
          <HabitsTextContainer color={overallColor}>
            {totalCompleted}/{totalFrequency}
          </HabitsTextContainer>
        </HabitsTableDataCell>
      </HabitsTableRow>
    );

    return (
      <HabitsTable>
        <HabitsTableHead>
          <HabitsTableRow>
            <HabitsTableHeaderCell />
            <HabitsTableHeaderCell />
            {titleElements}
          </HabitsTableRow>
        </HabitsTableHead>
        <HabitsTableBody>
          {renderHabits()}
          <Divider />
          {renderOverall}
        </HabitsTableBody>
      </HabitsTable>
    );
  },
);

export const HabitsTextContainer = styled.td`
  color: ${props => props.color};
  font-weight: 600;
  height: 35px;
  margin-left: 10px;
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
