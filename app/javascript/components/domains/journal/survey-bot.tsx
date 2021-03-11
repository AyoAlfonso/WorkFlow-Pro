import * as React from "react";
import * as R from "ramda";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { Text } from "../../shared/text";
import { Loading } from "../../shared/loading";
import { MIPSelector } from "./mip-selector";
import { EmotionSelector } from "./emotion-selector";
import { baseTheme } from "~/themes/base";
import { SummaryDisplay } from "~/components/shared/questionnaire/summary-display";

export interface ISurveyBotProps {
  variant: string;
  endFn?: () => void | void;
  optionalActionsComponent?: JSX.Element;
  fromDailyPlanning?: boolean;
}

const botAvatarPath = require("../../../assets/images/LynchPyn-Logo-Blue_300x300.png");

export const SurveyBot = observer(
  (props: ISurveyBotProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);

    const {
      sessionStore,
      sessionStore: {
        profile: { currentDailyLog, firstName },
      },
      questionnaireStore,
      keyActivityStore,
    } = useMst();

    useEffect(() => {
      async function setUp() {
        await questionnaireStore.load();
        const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);
        await questionnaireStore.getQuestionnaireAttemptsSummaryForReflections(
          questionnaireVariant.id,
        );
        setLoading(false);
        window.closeWidget();
      }
      setUp();
    }, []);

    if (loading || R.isNil(keyActivityStore.todaysPriorities) || R.isNil(sessionStore.profile)) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);
    const summaryData = questionnaireStore.questionnaireAttemptsSummaryForReflections;

    const stringValidator = value => (value ? true : "Write just a little bit!");

    const steps = R.map(step => {
      if (R.hasPath(["metadata", "mipSelector"], step)) {
        return R.pipe(R.assoc("component", <MIPSelector />), R.dissoc("options"))(step);
      } else if (R.hasPath(["metadata", "emotionSelector"], step)) {
        return R.pipe(R.assoc("component", <EmotionSelector />), R.dissoc("options"))(step);
      } else if (R.hasPath(["metadata", "username"], step)) {
        return R.assoc("message", R.replace("{userName}", firstName, step.message))(step);
      } else if (R.hasPath(["metadata", "pynCount"], step)) {
        const completedPynCount = keyActivityStore.completedToday.length;
        const totalPynCount = keyActivityStore.todaysPriorities.length + completedPynCount;
        const newMessage = R.pipe(
          R.replace("{completedMIPCount}", `${completedPynCount < 0 ? 0 : completedPynCount}`),
          R.replace("{totalMIPCount}", `${totalPynCount}`),
        )(step.message);
        return R.assoc("message", newMessage)(step);
      } else if (R.hasPath(["metadata", "mipCheck"], step)) {
        const mipCheck =
          keyActivityStore.todaysPriorities.length > 0
            ? R.path(["metadata", "mipCheck", "hasMips"], step)
            : R.path(["metadata", "mipCheck", "noMips"], step);
        return R.assoc("message", R.replace("{mipCheck}", mipCheck, step.message))(step);
      } else if (R.hasPath(["metadata", "validatorType"], step)) {
        return R.assoc("validator", stringValidator, step);
      } else if (R.path(["metadata", "summary"], step) === "gratitude") {
        return R.pipe(
          R.assoc(
            "component",
            <>
              <SummaryDisplay
                summaryData={summaryData}
                variant={`${R.path(["metadata", "summary"], step)}Am`}
                title={R.path(["metadata", "message", "am"], step)}
              />
              <SummaryDisplay
                summaryData={summaryData}
                variant={`${R.path(["metadata", "summary"], step)}Pm`}
                title={R.path(["metadata", "message", "pm"], step)}
              />
            </>,
          ),
          R.dissoc("options"),
        )(step);
      } else if (R.hasPath(["metadata", "summary"], step)) {
        return R.pipe(
          R.assoc(
            "component",
            <SummaryDisplay
              summaryData={summaryData}
              variant={R.path(["metadata", "summary"], step)}
              title={R.path(["metadata", "message"], step)}
            />,
          ),
          R.dissoc("options"),
        )(step);
      } else {
        return step;
      }
    }, R.clone(questionnaireVariant.steps));

    if (R.isNil(steps)) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    return (
      <ChatBot
        botDelay={1000}
        bubbleOptionStyle={{
          backgroundColor: baseTheme.colors.primary100,
          color: "white",
          boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
        }}
        headerComponent={
          <SurveyHeader
            title={questionnaireVariant.title}
            optionalActionsComponent={props.optionalActionsComponent}
          />
        }
        steps={steps}
        width={"100%"}
        hideBotAvatar={true}
        hideUserAvatar={true}
        contentStyle={{
          height: props.fromDailyPlanning ? window.innerHeight - 250 : window.innerHeight - 120,
        }}
        // header and footer are 120px total
        // these hard-coded values are required to make the chatbot fit inside the Journal widget :(
        style={{ height: props.fromDailyPlanning ? window.innerHeight - 130 : window.innerHeight }}
        enableSmoothScroll={true}
        userDelay={200}
        zIndex={1}
        handleEnd={async ({ renderedSteps, steps, values: answers }) => {
          await questionnaireStore.createQuestionnaireAttempt(
            questionnaireVariant.id,
            {
              renderedSteps,
              steps,
              answers,
            },
            questionnaireVariant.title,
          );
          if (typeof props.endFn === "function") {
            setTimeout(() => {
              props.endFn();
            }, 2000);
          }
        }}
      />
    );
  },
);

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

export const SurveyHeader = ({ title, optionalActionsComponent = undefined }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
      {optionalActionsComponent ? optionalActionsComponent : <></>}
    </HeaderDiv>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 346px;
  justify-content: center;
  align-items: center;
`;

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
      headerComponent={
        <SurveyHeader title={"Survey"} optionalActionsComponent={props.optionalActionsComponent} />
      }
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
