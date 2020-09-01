import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { IHabit } from "~/models";
import { RawIcon } from "~/components/shared";
import { HabitsTableDataCell } from "./habits-styles";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { baseTheme } from "~/themes";

interface IHabitsHabitTrackerProps {
  habit: IHabit;
  onUpdate: any;
  setShowIndividualHabit: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedHabitId: React.Dispatch<React.SetStateAction<number>>;
}

export const HabitsHabitTracker = observer(
  ({
    habit,
    onUpdate,
    setShowIndividualHabit,
    setSelectedHabitId,
  }: IHabitsHabitTrackerProps): JSX.Element => {
    const renderHabitLogs = () =>
      habit.recentLogsFiveDays.map(log => (
        <SelectionCell
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
        </SelectionCell>
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
        <HabitsTextContainer
          onClick={() => {
            setSelectedHabitId(habit.id);
            setShowIndividualHabit(true);
          }}
        >
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
  &: hover {
    cursor: pointer;
  }
`;

interface IHabitsTableCircularProgressBar {
  color: string;
  value: number;
}
export const HabitsTableCircularProgressBar = ({
  color,
  value,
}: IHabitsTableCircularProgressBar) => (
  <CircularProgressbar
    value={value}
    strokeWidth={36}
    styles={{
      root: {
        height: "16px",
        width: "16px",
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

const SelectionCell = styled(HabitsTableDataCell)`
  padding-right: 5px;
  padding-left: 5px;
  text-align: center;
`;
