import * as React from "react";
import * as R from "ramda";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { toJS } from "mobx";
import { Loading } from "~/components/shared/loading";
import { QuestionnaireTitle } from "./questionnaire-title";
import * as humps from "humps";

export interface IQuestionnaireProps {
  variant: string;
  endFn?: Dispatch<SetStateAction<string>>;
}

export const Questionnaire = (props: IQuestionnaireProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  const { meetingStore, questionnaireStore } = useMst();

  useEffect(() => {
    questionnaireStore.load().then(() => {
      setLoading(false);
    });
  }, []);

  const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);

  if (loading || R.isNil(questionnaireStore.questionnaires) || R.isNil(questionnaireVariant)) {
    return (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );
  }

  const steps = R.map(step => {
    console.log(step);
    if (R.hasPath(["metadata", "questionnaireTitle"], step)) {
      return R.pipe(
        R.assoc("component", <QuestionnaireTitle title={step.metadata.message} />),
        R.dissoc("options"),
      )(step);
      // } else if (R.hasPath(["metadata", "frogSelector"], step)) {
      //   return R.pipe(R.assoc("component", <FrogSelector />), R.dissoc("options"))(step);
      // } else if (R.hasPath(["metadata", "emotionSelector"], step)) {
      //   return R.pipe(R.assoc("component", <EmotionSelector />), R.dissoc("options"))(step);
    } else {
      return step;
    }
  }, R.clone(questionnaireVariant.steps));

  return (
    <ChatBot
      hideBotAvatar={true}
      hideUserAvatar={true}
      botDelay={1000}
      headerComponent={<SurveyHeader title={"Weekly Reflection"} />}
      steps={steps}
      width={"100%"}
      contentStyle={{ height: "400px" }}
      // header and footer are 120px total
      style={{ height: "520px" }}
      enableSmoothScroll={true}
      userDelay={200}
    />
  );
};

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 346px;
  justify-content: center;
  align-items: center;
`;

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

export const SurveyHeader = ({ title }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
    </HeaderDiv>
  );
};
