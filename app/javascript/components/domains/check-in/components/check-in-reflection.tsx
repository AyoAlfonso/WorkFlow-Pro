import * as React from "react";
import * as R from "ramda";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { baseTheme } from "~/themes/base";
import { SummaryDisplay } from "~/components/shared/questionnaire/summary-display";
import "~/stylesheets/modules/chatbot.css";
import styled from "styled-components";
import { Loading } from "~/components/shared";
import { MIPSelector } from "../../journal/mip-selector";
import { EmotionSelector } from "../../journal/emotion-selector";
import { SurveyHeader } from "../../journal/survey-bot";
import { toJS } from "mobx";

// const botAvatarPath = require("../../../../assets/images/LynchPyn-Logo-Blue_300x300.png");

interface ICheckinReflection {
  variant: string;
  disabled?: boolean;
}

export const CheckinReflection = (props: ICheckinReflection): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  const {
    sessionStore,
    sessionStore: {
      profile: { firstName },
      selectedDailyLog,
    },
    questionnaireStore,
    keyActivityStore,
    companyStore,
    checkInTemplateStore,
  } = useMst();

  const { currentCheckInArtifact, updateCheckinArtifact } = checkInTemplateStore;

  useEffect(() => {
    async function setUp() {
      setLoading(true);
      await questionnaireStore.load();
      const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);
      await questionnaireStore.getQuestionnaireAttemptsSummaryForReflections(
        questionnaireVariant.id,
      );
      setLoading(false);
      window.closeWidget && window.closeWidget();
    }
    setUp();
  }, [props.variant]);

  if (loading || R.isNil(sessionStore.profile)) {
    return (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );
  }

  const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);
  const summaryData = questionnaireStore.questionnaireAttemptsSummaryForReflections;

  const stringValidator = value => (value ? true : "Write just a little bit!");

  const formatSteps = steps => {
    const formattedSteps = steps.map(step => {
      if (!step.metadata || !step.message) {
        return { ...step, message: "", metadata: {} };
      } else {
        return step;
      }
    });
    return formattedSteps;
  };

  // Customized Steps
  const steps = R.pipe(
    R.clone,
    R.map(step => {
      if (R.path(["metadata", "forumOverrideTrigger"], step) && companyStore.company.accessForum) {
        return R.assoc("trigger", R.path(["metadata", "forumOverrideTrigger"], step))(step);
      } else {
        return step;
      }
    }),
    R.map(step => {
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
                questionnaireVariant={props.variant}
                timeOfDay={"am"}
              />
              <SummaryDisplay
                summaryData={summaryData}
                variant={`${R.path(["metadata", "summary"], step)}Pm`}
                title={R.path(["metadata", "message", "pm"], step)}
                questionnaireVariant={props.variant}
                timeOfDay={"pm"}
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
              questionnaireVariant={props.variant}
            />,
          ),
          R.dissoc("options"),
        )(step);
      } else {
        return step;
      }
    }),
  )(questionnaireVariant?.steps);
  // End of Customized Steps

  if (R.isNil(steps)) {
    return (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );
  }

  const submitCheckinResponse = id => {
    const isCheckInArtifactLogsEmpty = R.isEmpty(currentCheckInArtifact.checkInArtifactLogs);
    const isJournalLogsEmpty = R.isEmpty(
      currentCheckInArtifact.checkInArtifactLogs[0]?.journalLogs,
    );
    const journalLogIdArray = toJS(currentCheckInArtifact).checkInArtifactLogs[0]?.journalLogs;
    const item = {
      journalLogIds:
        !isCheckInArtifactLogsEmpty && !isJournalLogsEmpty ? [...journalLogIdArray, id] : [id],
    };
    updateCheckinArtifact(currentCheckInArtifact.id, item);
  };

  return (
    <ChatBotContainer disabled={props.disabled}>
      <ChatBot
        botDelay={1000}
        bubbleOptionStyle={{
          backgroundColor: baseTheme.colors.primary100,
          color: "white",
          boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
        }}
        headerComponent={<SurveyHeader title={questionnaireVariant.title} />}
        steps={steps}
        width={"100%"}
        hideBotAvatar={true}
        hideUserAvatar={true}
        contentStyle={{
          height: window.innerHeight <= 670 ? "77%" : window.innerWidth <= 768 ? "80%" : "84%",
        }}
        // header and footer are 120px total
        // these hard-coded values are required to make the chatbot fit inside the Journal widget :(
        style={{ height: "100%" }}
        enableSmoothScroll={true}
        userDelay={200}
        zIndex={1}
        handleEnd={async ({ renderedSteps, steps, values: answers }) => {
          const optionalParams = selectedDailyLog ? { logDate: selectedDailyLog.logDate } : {};
          const res = await questionnaireStore.createQuestionnaireAttempt(
            questionnaireVariant.id,
            {
              renderedSteps,
              steps,
              answers,
            },
            questionnaireVariant.title,
            optionalParams,
          );
          if (res === true) {
            return;
          } else {
            submitCheckinResponse(res.id);
          }
          // if (typeof props.endFn === "function") {
          //   setTimeout(() => {
          //     props.endFn();
          //   }, 2000);
          // }
        }}
      />
    </ChatBotContainer>
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
  @media only screen and (max-width: 768px) {
    height: 10%;
  }
`;

type ChatBotContainerProps = {
  disabled?: boolean;
};

const ChatBotContainer = styled.div<ChatBotContainerProps>`
  overflow-y: auto;
  height: 100%;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 346px;
  justify-content: center;
  align-items: center;
`;
