import React from "react";
import styled from "styled-components";
import { IHabit } from "~/models";
import { observer } from "mobx-react";

interface IHabitsHabitTrackerProps {
  habit: IHabit;
  onUpdate: any;
}
export const HabitsHabitTracker = observer(
  ({ habit, onUpdate }: IHabitsHabitTrackerProps): JSX.Element => {
    const renderHabitLogs = () =>
      habit.weeklyLogs.map((log, index) => (
        <HabitsDailyLog
          key={`${habit.id}-${log.logDate}`}
          onClick={() => {
            onUpdate(habit.id, log.logDate);
          }}
        >
          {log.id ? `T` : `X`}
        </HabitsDailyLog>
      ));

    return (
      <Container>
        <PieContainer />
        <NameContainer>{`${habit.name}`}</NameContainer>
        {renderHabitLogs()}
      </Container>
    );
  },
);

const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;
`;

const PieContainer = styled.div``;

const NameContainer = styled.div`
  width: 50px;
`;

const IconContainer = styled.div``;

const HabitsDailyLog = styled.div`
  padding: 0px 5px;
  :hover {
    cursor: pointer;
  }
`;
