import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Questionnaire } from "~/components/shared/questionnaire/questionnaire";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { TeamPulseContainer } from "../../meetings/shared/team-pulse-container";
import { Loading } from "~/components/shared/loading";
import { StatCard } from "~/components/shared/stat-card";
import { PersonalHabitSummary } from "~/components/domains/meetings/shared/personal-habit-summary";
import { Card } from "~/components/shared/card";

import { useMst } from "~/setup/root";

export const MonthlyReflection = (props: {}): JSX.Element => {
  const {
    meetingStore: { currentPersonalPlanning: meeting },
  } = useMst();

  if (R.isNil(meeting)) {
    return <Loading />;
  }

  return (
    <Container>
      <RowContainer>
        {(meeting.statsForMonth || []).map((statObj, index) => (
          <StatCard key={index} {...statObj} />
        ))}
      </RowContainer>
      <RowContainer>
        <Card width={"67%"} alignment={"left"} my={"5px"} minWidth={"670px"}>
          <TeamPulseContainer meeting={meeting} title={"Your Mood"} />
        </Card>
        <PersonalHabitsContainer>
          <PersonalHabitSummary meeting={meeting} />
        </PersonalHabitsContainer>
      </RowContainer>
      <RowContainer>
        <Questionnaire variant={QuestionnaireTypeConstants.monthlyReflection} />
        <Placeholder />
      </RowContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: -5px;
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
