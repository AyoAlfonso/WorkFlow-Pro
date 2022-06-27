import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { PersonalHabitSummary } from "~/components/domains/meetings/shared/personal-habit-summary";

interface WeeklyReviewProps {
  disabled?: boolean;
}

export const WeeklyReview = ({ disabled }: WeeklyReviewProps): JSX.Element => {
  return (
    <Container disabled={disabled}>
      <PersonalHabitSummary />
    </Container>
  );
};

type ContainerProps = {
  disabled?: boolean;
};

const Container = styled.div<ContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;
