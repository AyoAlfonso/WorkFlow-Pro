import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Questionnaire } from "~/components/shared/questionnaire/questionnaire";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { TeamPulseContainer } from "../shared/team-pulse-container";
import { Loading } from "~/components/shared/loading";
import { StatCard } from "~/components/shared/stat-card";
import { PersonalHabitSummary } from "~/components/domains/meetings/shared/personal-habit-summary";

import { useMst } from "~/setup/root";

export const WeeklyReflection = (props: {}): JSX.Element => {
  const {
    meetingStore: { currentPersonalPlanning: meeting },
  } = useMst();

  if (R.isNil(meeting)) {
    return <Loading />;
  }

  return (
    <Container>
      <RowContainer>
        {(meeting.statsForWeek || []).map((statObj, index) => (
          <StatCard key={index} {...statObj} />
        ))}
      </RowContainer>
      <RowContainer>
        <TeamPulseBorder>
          <TeamPulseContainer meeting={meeting} title={"Your Mood"} />
        </TeamPulseBorder>
        <PersonalHabitsContainer>
          <PersonalHabitSummary meeting={meeting} />
        </PersonalHabitsContainer>
      </RowContainer>
      <RowContainer>
        <Questionnaire variant={QuestionnaireTypeConstants.weeklyReflection} />
        <Placeholder />
      </RowContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: -5px;
`;

const TeamPulseBorder = styled(HomeContainerBorders)`
  min-width: 670px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 67%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  gap: 20px;
`;

const PersonalHabitsContainer = styled.div`
  width: 33%;
`;

const Placeholder = styled.div`
  width: 33%;
`;
