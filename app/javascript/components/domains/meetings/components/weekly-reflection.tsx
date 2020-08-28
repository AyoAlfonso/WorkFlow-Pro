import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Questionnaire } from "~/components/shared/questionnaire/questionnaire";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { TeamPulseContainer } from "../shared/team-pulse-container";

import { useMst } from "~/setup/root";

export const WeeklyReflection = (props: {}): JSX.Element => {
  const {
    meetingStore: { currentPersonalPlanning: meeting },
  } = useMst();

  return (
    <>
      <Text>Todo: Stasks Cards</Text>
      <TeamPulseBorder>
        <TeamPulseContainer meeting={meeting} title={"Your Mood"} />
      </TeamPulseBorder>
      <HomeContainerBorders></HomeContainerBorders>
      <Questionnaire variant={QuestionnaireTypeConstants.weeklyReflection} />
    </>
  );
};

const TeamPulseBorder = styled(HomeContainerBorders)`
  width: 650px;
`;
