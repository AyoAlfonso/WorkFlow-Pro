import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Questionnaire } from "~/components/shared/questionnaire/questionnaire";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { TeamPulseContainer } from "../../meetings/shared/team-pulse-container";
import { Loading } from "~/components/shared/loading";
import { StatCard } from "~/components/shared/stat-card";
import { PersonalHabitSummary } from "~/components/domains/meetings/shared/personal-habit-summary";
import { ColumnContainerParent, ColumnContainer } from "~/components/shared/styles/row-style";

import { useMst } from "~/setup/root";

export const MonthlyReflection = (props: {}): JSX.Element => {
  const {
    meetingStore: { currentPersonalPlanning: meeting },
  } = useMst();

  if (R.isNil(meeting)) {
    return <Loading />;
  }

  return (
    <ColumnContainerParent minWidth={"650px"}>
      <ColumnContainer minWidth={"325px"}>
        <RowContainer>
          {(meeting.statsForMonth || []).map((statObj, index) => (
            <StatCard key={index} {...statObj} periodDesc={"month"} />
          ))}
        </RowContainer>
        <RowContainer>
          <PersonalHabitSummary meeting={meeting} />
        </RowContainer>
        <RowContainer>
          <TeamPulseContainer meeting={meeting} title={"Your Mood"} />
        </RowContainer>
      </ColumnContainer>
      <ColumnContainer minWidth={"325px"}>
        <Questionnaire
          variant={QuestionnaireTypeConstants.monthlyReflection}
          fromDailyPlanning={true}
        />
      </ColumnContainer>
    </ColumnContainerParent>
  );
};

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  gap: 20px;
`;
