import * as React from "react";
import { Text } from "~/components/shared/text";
import { Questionnaire } from "~/components/shared/questionnaire/questionnaire";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";
export const WeeklyReflection = (props: {}): JSX.Element => {
  return (
    <>
      <Text>Todo: Stasks Cards</Text>
      <Questionnaire variant={QuestionnaireTypeConstants.weeklyReflection} />
    </>
  );
};
