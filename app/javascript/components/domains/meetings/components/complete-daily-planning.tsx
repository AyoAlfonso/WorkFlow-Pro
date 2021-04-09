import * as React from "react";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";

import styled from "styled-components";
import { SurveyBot } from "~/components/domains/journal/survey-bot";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { ColumnContainerParent, ColumnContainer } from "~/components/shared/styles/row-style";

export const CompleteDailyPlanning = observer(
  (props: {}): JSX.Element => {
    const questionnaireVariant = QuestionnaireTypeConstants.createMyDay;
    const handleChatbotEnd = () => {
      // if (confirm(`Are you sure you want to exit planning?`)) {
      //   history.push(`/`);
      // }
    };
    return (
      <ColumnContainerParent>
        <ColumnContainer>
          <HomeKeyActivities todayOnly={true} />
        </ColumnContainer>
        <ColumnContainer>
          <SurveyBot
            variant={questionnaireVariant}
            endFn={handleChatbotEnd}
            fromDailyPlanning={true}
          />
        </ColumnContainer>
      </ColumnContainerParent>
    );
  },
);
