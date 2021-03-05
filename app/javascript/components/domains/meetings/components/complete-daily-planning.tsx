import * as React from "react";
import { useState, useEffect } from "react";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";

import styled from "styled-components";
import { SurveyBot } from "~/components/domains/journal/survey-bot";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

export const CompleteDailyPlanning = observer(
  (props: {}): JSX.Element => {
    const history = useHistory();

    const questionnaireVariant = QuestionnaireTypeConstants.createMyDay;
    const handleChatbotEnd = () => {
      // if (confirm(`Are you sure you want to exit planning?`)) {
      //   history.push(`/`);
      // }
    };
    return (
      <Container>
        <SideContainer>
          <HomeKeyActivities todayOnly={true} />
        </SideContainer>
        <SideContainer>
          <SurveyBot variant={questionnaireVariant} endFn={handleChatbotEnd} />
        </SideContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const SideContainer = styled.div`
  width: 50%;
`;
