import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { StatCard } from "~/components/shared/stat-card";
import { PersonalHabitSummary } from "~/components/domains/meetings/shared/personal-habit-summary";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";

interface WeeklyReviewProps {
  disabled?: boolean;
}

export const WeeklyReview = observer(
  ({ disabled }: WeeklyReviewProps): JSX.Element => {
    const { sessionStore } = useMst();

    const profile = sessionStore.profile;

    return (
      <Container disabled={disabled}>
        <RowContainer>
          {(profile?.statsForWeek || []).map((statObj, index) => (
            <StatCard key={index} {...statObj} periodDesc={"week"} />
          ))}
        </RowContainer>
        <PersonalHabitSummary />
      </Container>
    );
  },
);

type ContainerProps = {
  disabled?: boolean;
};

const Container = styled.div<ContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  gap: 20px;
`;
