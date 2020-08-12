import * as React from "react";
import * as R from "ramda";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { Text } from "../../shared/text";
import { toJS } from "mobx";
import { Loading } from "../../shared/loading";
import { FrogSelector } from "./frog-selector";
import { EmotionSelector } from "./emotion-selector";
import * as humps from "humps";

export interface ISurveyBotProps {
  variant: string;
  endFn?: Dispatch<SetStateAction<string>>;
}

const botAvatarPath = require("../../../assets/images/LynchPyn-Logo-Blue_300x300.png");

export const SurveyBot = observer(
  (props: ISurveyBotProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);

    const {
      sessionStore,
      sessionStore: {
        profile: { currentDailyLog },
      },
      questionnaireStore,
    } = useMst();

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

    const steps = R.map(step => {
      if (R.hasPath(["metadata", "frogSelector"], step)) {
        return R.pipe(R.assoc("component", <FrogSelector />), R.dissoc("options"))(step);
      } else if (R.hasPath(["metadata", "emotionSelector"], step)) {
        return R.pipe(R.assoc("component", <EmotionSelector />), R.dissoc("options"))(step);
      } else {
        return step;
      }
    }, R.clone(questionnaireVariant.steps));

    return (
      <ChatBot
        botAvatar={botAvatarPath}
        botDelay={1000}
        headerComponent={<SurveyHeader title={questionnaireVariant.name} />}
        steps={steps}
        width={"100%"}
        userAvatar={sessionStore.profile.avatarUrl || undefined}
        contentStyle={{ height: "226px" }}
        // header and footer are 120px total
        // these hard-coded values are required to make the chatbot fit inside the Journal widget :(
        style={{ height: "346px" }}
        enableSmoothScroll={true}
        userDelay={200}
        handleEnd={async ({ renderedSteps, steps, values }) => {
          await questionnaireStore.createQuestionnaireAttempt(questionnaireVariant.id, {
            renderedSteps,
            steps,
            values,
          });
          if (
            questionnaireVariant.name === "Create My Day" ||
            questionnaireVariant.name === "Evening Reflection"
          ) {
            await sessionStore.updateUser({
              dailyLogsAttributes: [
                {
                  ...currentDailyLog,
                  [`${humps.camelize(questionnaireVariant.name)}`]: true,
                },
              ],
            });
          }

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
  { id: 1, message: "I'm the Chat Bot and I'm talking to you!", trigger: 2 },
  { id: 2, user: true, trigger: 1 },
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

export const SurveyHeader = ({ title }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
    </HeaderDiv>
  );
};