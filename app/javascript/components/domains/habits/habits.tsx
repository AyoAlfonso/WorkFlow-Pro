import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import {
  HabitsTableRow,
  HabitsTableDataCell,
} from "./habits-styles";
import { HabitsTableCircularProgressBar } from "./habits-habit-tracker";
import { baseTheme } from "~/themes";

export const Habits = observer(
  (): JSX.Element => {
    const {
      habitStore: { habits },
      companyStore,
    } = useMst();

    useEffect(() => {
      companyStore.load();
    }, [companyStore.company]);

    return (
      <>
        {habits.map((habit, index) => (
          <HabitsTableRow key={`${habit.id}-${index}`}>
            <StyledHabitsTableCenterCell>
              {habit.score == 0 ? (
                <HabitsTableCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
              ) : (
                <HabitsTableCircularProgressBar color={habit.color} value={habit.score} />
              )}
            </StyledHabitsTableCenterCell>
            <StyledHabitsTableDataCell>
              <HabitsTextContainer color={habit.color}>{`${habit.name}`}</HabitsTextContainer>
            </StyledHabitsTableDataCell>
            <StyledHabitsTableCenterCell>
              <HabitsTextContainer color={habit.color}>
                {habit.score ? habit.score.toFixed(0) : 0}%
              </HabitsTextContainer>
            </StyledHabitsTableCenterCell>
            <StyledHabitsTableCenterCell>
              <HabitsTextContainer color={habit.color}>
                {habit.weeklyScoreDifference >= 0 ? "+" : ""}
                {habit.weeklyScoreDifference ? habit.weeklyScoreDifference.toFixed(0) : 0}%
              </HabitsTextContainer>
            </StyledHabitsTableCenterCell>
            <StyledHabitsTableCenterCell>
              <HabitsTextContainer color={habit.color}>
                {habit.weeklyCompletionFraction}
              </HabitsTextContainer>
            </StyledHabitsTableCenterCell>
          </HabitsTableRow>
        ))}
      </>
    )
});

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

const StyledHabitsTableDataCell = styled(HabitsTableDataCell)`
  padding-right: 5px;
`;

const StyledHabitsTableCenterCell = styled(StyledHabitsTableDataCell)`
  text-align: center;
`;
