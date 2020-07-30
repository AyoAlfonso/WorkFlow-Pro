import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { HabitsHabitTracker } from "./habits-habit-tracker";

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
        <HabitsHabitTracker
          key={`${habit.id}-${index}`}
          habit={habit}
          onUpdate={(habitId, logDate) => habitStore.updateHabitLog(habitId, logDate)}
        />
      ));
    return (
      <>
        <Container>{renderHabits()}</Container>
      </>
    );
  },
);

const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-right: 10px;
`;

const IconContainer = styled.div`
  padding-right: 10px;
`;

const HabitsText = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 20px;
  font-size: 14pt;
  font-weight: 400;
`;
