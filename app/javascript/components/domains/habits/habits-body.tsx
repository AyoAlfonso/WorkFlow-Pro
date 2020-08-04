import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { HabitsHabitTracker } from "./habits-habit-tracker";
import { baseTheme } from "~/themes/base";

export const HabitsBody = observer(
  (): JSX.Element => {
    const {
      habitStore,
      habitStore: { habits },
    } = useMst();
    useEffect(() => {
      habitStore.fetchHabits();
    }, habitStore.habits);
    const renderHabits = () =>
      habits.map((habit, index) => (
        <HabitsTableRow key={`${habit.id}-${index}`}>
          <HabitsHabitTracker
            habit={habit}
            onUpdate={(habitId, logDate) => habitStore.updateHabitLog(habitId, logDate)}
          />
        </HabitsTableRow>
      ));
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"].map((dName, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index}>
        {dName}
      </HabitsTableHeaderCell>
    ));
    const dayDates = habits[0]?.weeklyLogs.map(({ logDate }, index) => (
      <HabitsTableHeaderCell key={index}>
        {logDate.substr(logDate.length - 2)}
      </HabitsTableHeaderCell>
    ));
    return (
      <HabitsTable>
        <HabitsTableHead>
          <HabitsTableRow>
            <HabitsTableHeaderCell />
            <HabitsTableHeaderCell />
            {dayNames}
          </HabitsTableRow>
          <HabitsTableRow>
            <HabitsTableHeaderCell />
            <HabitsTableHeaderCell />
            {dayDates}
          </HabitsTableRow>
        </HabitsTableHead>
        <HabitsTableBody>{renderHabits()}</HabitsTableBody>
      </HabitsTable>
    );
  },
);

const HabitsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const HabitsTableHead = styled.thead``;

const HabitsTableBody = styled.tbody``;

const HabitsTableRow = styled.tr``;

const HabitsTableHeaderCell = styled.th`
  color: ${baseTheme.colors.greyInactive};
  font-weight: ${props => props.fontWeight};
  height: 25px;
`;

export const HabitsTableDataCell = styled.td`
  font-weight: ${props => props.fontWeight};
  height: 35px;
  text-align: center;
  :hover {
    cursor: pointer;
  }
`;
