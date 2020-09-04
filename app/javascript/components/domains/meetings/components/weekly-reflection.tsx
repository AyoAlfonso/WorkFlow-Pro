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
        <PersonalHabitSummary meeting={meeting} />
      </RowContainer>
      <Questionnaire variant={QuestionnaireTypeConstants.weeklyReflection} />
    </Container>
  );
};

const Container = styled.div`
  margin-top: -5px;
`;

const TeamPulseBorder = styled(HomeContainerBorders)`
  min-width: 670px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;
