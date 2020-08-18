import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { IHabit } from "~/models";
import { RawIcon } from "~/components/shared";
import { HabitsTableDataCell } from "./habits-body";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { baseTheme } from "~/themes";

interface IHabitsHabitTrackerProps {
  habit: IHabit;
  onUpdate: any;
}
export const HabitsHabitTracker = observer(
  ({ habit, onUpdate }: IHabitsHabitTrackerProps): JSX.Element => {
    const renderHabitLogs = () =>
      habit.recentLogsFiveDays.map(log => (
        <HabitsTableDataCell
          key={`${habit.id}-${log.logDate}`}
          onClick={() => {
            onUpdate(habit.id, log.logDate);
          }}
        >
          {log.id ? (
            <RawIcon icon={"Checkmark"} color={habit.color} size={12} />
          ) : (
            <RawIcon icon={"Close"} color={baseTheme.colors.greyInactive} size={12} />
          )}
        </HabitsTableDataCell>
      ));

    return (
      <>
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
        <HabitsTextContainer>
          <NameContainer color={habit.color}>{`${habit.name}`}</NameContainer>
        </HabitsTextContainer>
        {renderHabitLogs()}
      </>
    );
  },
);

const NameContainer = styled.div`
  color: ${props => props.color};
`;

export const HabitsTextContainer = styled.td`
  font-weight: 600;
  height: 35px;
  margin-left: 10px;
`;

interface IHabitsTableCircularProgressBar {
  color: string;
  value: number;
}
const HabitsTableCircularProgressBar = ({ color, value }: IHabitsTableCircularProgressBar) => (
  <CircularProgressbar
    value={value}
    strokeWidth={18}
    styles={{
      root: {
        height: "25px",
        width: "25px",
      },
      path: {
        stroke: color,
        strokeLinecap: "butt",
      },
      trail: {
        stroke: "none",
      },
    }}
  />
);
