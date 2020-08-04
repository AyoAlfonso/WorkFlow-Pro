import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { IHabit } from "~/models";
import { RawIcon } from "~/components/shared";
import { HabitsTableDataCell } from "./habits-body";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface IHabitsHabitTrackerProps {
  habit: IHabit;
  onUpdate: any;
}
export const HabitsHabitTracker = observer(
  ({ habit, onUpdate }: IHabitsHabitTrackerProps): JSX.Element => {
    const renderHabitLogs = () =>
      habit.recentLogs.map(log => (
        <HabitsTableDataCell
          key={`${habit.id}-${log.logDate}`}
          onClick={() => {
            onUpdate(habit.id, log.logDate);
          }}
        >
          {log.id ? (
            <RawIcon icon={"Tasks"} color={habit.color} size={16} />
          ) : (
            <RawIcon icon={"Close"} color={habit.color} size={16} />
          )}
        </HabitsTableDataCell>
      ));

    return (
      <>
        <HabitsTableDataCell>
          <HabitsTableCircularProgressBar
            color={habit.color}
            value={habit.percentageWeeklyLogsCompleted}
          />
        </HabitsTableDataCell>
        <HabitsTableDataCell fontWeight={600}>
          <NameContainer color={habit.color}>{`${habit.name}`}</NameContainer>
        </HabitsTableDataCell>
        {renderHabitLogs()}
      </>
    );
  },
);

const NameContainer = styled.div`
  color: ${props => props.color};
`;

interface IHabitsTableCircularProgressBar {
  color: string;
  value: number;
}
const HabitsTableCircularProgressBar = ({ color, value }: IHabitsTableCircularProgressBar) => (
  <CircularProgressbar
    value={value}
    strokeWidth={25}
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
