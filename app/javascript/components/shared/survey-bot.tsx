import * as React from "react";
import * as R from "ramda";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "../../setup/root";
import styled from "styled-components";
import { Text } from "../shared/text";
import { toJS } from "mobx";
import { Loading } from "../shared/loading";

export interface ISurveyBotProps {
  variant: string;
  endFn?: Dispatch<SetStateAction<string>>;
}

const botAvatarPath = require("../../assets/images/LynchPyn-Logo-Blue_300x300.png");

export const SurveyBot = observer(
  (props: ISurveyBotProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);

    const { sessionStore, questionnaireStore } = useMst();

    useEffect(() => {
      questionnaireStore.load().then(() => {
        setLoading(false);
      });
    }, []);

    const questionnaireVariant = toJS(
      questionnaireStore.questionnaires.find(q => q.name === props.variant),
    );

    if (loading || R.isNil(questionnaireStore.questionnaires) || R.isNil(questionnaireVariant)) {
      return <Loading />;
    }
    const steps = R.clone(questionnaireVariant.steps);

    return (
      <ChatBot
        botAvatar={botAvatarPath}
        botDelay={1000}
        headerComponent={<SurveyHeader title={questionnaireVariant.name} />}
        steps={steps}
        width={"100%"}
        userAvatar={sessionStore.profile.avatarUrl || undefined}
        contentStyle={{ height: "206px" }}
        // header and footer are 120px total
        // these hard-coded values are required to make the chatbot fit inside the Journal widget :(
        style={{ height: "326px" }}
        enableSmoothScroll={true}
        userDelay={200}
        handleEnd={({ renderedSteps, steps, values }) => {
          // @TODO -> need some kind of util here that parses and maps answers to questions
          // and then makes an api call to persist to the database
          questionnaireStore.createQuestionnaireAttempt(questionnaireVariant.id, {
            renderedSteps,
            steps,
            values,
          });
          if (typeof props.endFn === "function") {
            setTimeout(() => {
              props.endFn("");
            }, 2000);
          }
        }}
      />
    );
  },
);

const userAvatarUrlForStorybook =
  "https://image.freepik.com/free-vector/woman-avatar-profile-round-icon_24640-14042.jpg";

const exampleSteps = [
  { id: 1, message: "Hello!", trigger: 2 },
  { id: 2, user: true, end: true },
];

export const SurveyBotNoMst = (props: ISurveyBotProps): JSX.Element => {
  return (
    <ChatBot
      botAvatar={botAvatarPath}
      userAvatar={userAvatarUrlForStorybook}
      botDelay={1000}
      headerComponent={<SurveyHeader title={"Survey"} />}
      steps={exampleSteps}
      width={"100%"}
      contentStyle={{ height: "300px" }}
      // header and footer are 120px total
      style={{ height: "420px" }}
      enableSmoothScroll={true}
      userDelay={200}
    />
  );
};

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const SurveyHeader = ({ title }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
    </HeaderDiv>
  );
};
