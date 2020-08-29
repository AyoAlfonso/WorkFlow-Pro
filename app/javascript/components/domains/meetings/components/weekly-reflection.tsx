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
    <>
      <RowContainer>
        {(meeting.statsForWeek || []).map(statObj => (
          <StatCard {...statObj} />
        ))}
      </RowContainer>
      <RowContainer>
        <TeamPulseBorder>
          <TeamPulseContainer meeting={meeting} title={"Your Mood"} />
        </TeamPulseBorder>
        <PersonalHabitSummary />
      </RowContainer>
      <Questionnaire variant={QuestionnaireTypeConstants.weeklyReflection} />
    </>
  );
};

const TeamPulseBorder = styled(HomeContainerBorders)`
  width: 650px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
