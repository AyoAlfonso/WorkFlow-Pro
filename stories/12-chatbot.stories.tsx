import * as React from "react";
import * as R from "ramda";
import {
  SurveyBotNoMst,
  SurveyHeader,
} from "../app/javascript/components/domains/journal/survey-bot";
import { CodeBlockDiv, ContainerDiv, PropsList } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, LayoutProps } from "styled-system";
import ChatBot from "react-simple-chatbot";
import { Text } from "../app/javascript/components/shared/text";
import { QuestionnaireTitle } from "~/components/shared/questionnaire/questionnaire-title";

const botAvatarPath = require("../app/javascript/assets/images/LynchPyn-Logo-Blue_300x300.png");

export default { title: "ChatBot" };

const propsList = [
  {
    name: "variant",
    type: "string",
    required: true,
    description: " One of three types:  createMyDay | thoughtChallenge | eveningReflection",
  },
];

//TODO: ADD README ON PYNBOT AND HOW TO OVERRIDE STEPS PROGRAMATICALLY
//ADD METADATA TO THE STEP
//ADD LOGIC TO THE STEPS TO REMAP THE VALUES

const SurveyContainer = styled.div<LayoutProps>`
  ${layout}
`;

export const SurveyBot = () => (
  <ContainerDiv mt={4}>
    <h1>Survey Bot</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { SurveyBot } from "~/shared/survey-bot";

      const MyComponent = () => (
        <div width={"400px"}>
          <SurveyBot variant={"createMyDay"} />  
        <div>
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} />
    <SurveyContainer width={"400px"}>
      <SurveyBotNoMst variant={"createMyDay"} />
    </SurveyContainer>
  </ContainerDiv>
);

const userAvatarUrlForStorybook =
  "https://image.freepik.com/free-vector/woman-avatar-profile-round-icon_24640-14042.jpg";

const HeaderDiv = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 0 10px;
  margin: 0;
`;

const weeklySteps = [
  {
    id: 1,
    options: [],
    metadata: {
      questionnaireTitle: true,
      message: "Weekly Rating",
    },
    trigger: 2,
  },
  {
    id: 2,
    message: "On a scale of 1-10, how well did I progress towards my goals this week?",
    trigger: 3,
  },
  {
    id: 3,
    options: [
      { label: "1", value: 1, trigger: 4 },
      { label: "2", value: 2, trigger: 4 },
      { label: "3", value: 3, trigger: 4 },
      { label: "4", value: 4, trigger: 4 },
      { label: "5", value: 5, trigger: 4 },
      { label: "6", value: 6, trigger: 4 },
      { label: "7", value: 7, trigger: 4 },
      { label: "8", value: 8, trigger: 4 },
      { label: "9", value: 9, trigger: 4 },
      { label: "10", value: 10, trigger: 4 },
    ],
  },
  {
    id: 4,
    options: [],
    metadata: {
      questionnaireTitle: true,
      message: "My Biggest Wins",
    },
    trigger: 5,
  },
  {
    id: 5,
    message: "What went well?  Any wins (big or little) this week? (up to 5)",
    trigger: 6,
  },
  {
    id: 6,
    user: true,
    placeholder: "Write something...",
    trigger: 7,
  },
  {
    id: 7,
    message: "What did I learn from these wins and how can I double down on them?",
    trigger: 8,
  },
  {
    id: 8,
    user: true,
    placeholder: "Write something...",
    trigger: 9,
  },
  {
    id: 9,
    user: true,
    end: true,
  },
];

const steps = R.map(step => {
  if (R.hasPath(["metadata", "questionnaireTitle"], step)) {
    return R.pipe(
      R.assoc("component", <QuestionnaireTitle title={step.metadata.message} />),
      R.dissoc("options"),
    )(step);
  } else {
    return step;
  }
}, R.clone(weeklySteps));

export const WeeklyReflectionBot = () => (
  <ContainerDiv mt={4}>
    <h1>Weekly Reflection Bot</h1>
    <SurveyContainer width={"768px"}>
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
    </SurveyContainer>
  </ContainerDiv>
);
