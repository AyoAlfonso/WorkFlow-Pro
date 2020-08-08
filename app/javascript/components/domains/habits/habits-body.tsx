import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { HabitsHabitTracker } from "./habits-habit-tracker";
import { baseTheme } from "~/themes/base";
import * as moment from "moment";

export const HabitsBody = observer(
  (): JSX.Element => {
    const {
      habitStore,
      habitStore: { habits, lastFourDays },
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
    const dayNames = lastFourDays.map((day, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {day.format("ddd")}
      </HabitsTableHeaderCell>
    ));
    const dayDates = lastFourDays.map((day, index) => (
      <HabitsTableHeaderCell key={index}>{day.format("DD")}</HabitsTableHeaderCell>
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

type HabitsTableHeaderCellType = {
  fontWeight?: string;
  width?: string;
};

const HabitsTableHeaderCell = styled.th<HabitsTableHeaderCellType>`
  color: ${baseTheme.colors.greyInactive};
  font-weight: ${props => props.fontWeight};
  height: 25px;
  width: ${props => props.width};
`;

export const HabitsTableDataCell = styled.td`
  font-weight: ${props => props.fontWeight};
  height: 35px;
  text-align: center;
  :hover {
    cursor: pointer;
  }
`;
