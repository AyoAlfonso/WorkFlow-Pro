import * as React from "react";
import { SurveyBotNoMst, SurveyHeader } from "../app/javascript/components/shared/survey-bot";
import { CodeBlockDiv, ContainerDiv, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, LayoutProps } from "styled-system";
import ChatBot from "react-simple-chatbot";
import { Text } from "../app/javascript/components/shared/text";

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
        <SurveyContainer width={"400px"}>
          <SurveyBot variant={"createMyDay"} />  
        <SurveyContainer>
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
    component: (
      <HeaderDiv>
        <Text color={"black"} fontSize={2} fontWeight={"regular"} py={0} my={0}>
          Weekly Rating
        </Text>
      </HeaderDiv>
    ),
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
    component: (
      <HeaderDiv>
        <Text color={"black"} fontSize={2} fontWeight={"regular"} py={0} my={0}>
          My Biggest Wins
        </Text>
      </HeaderDiv>
    ),
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
    trigger: 1,
  },
];

export const WeeklyReflectionBot = () => (
  <ContainerDiv mt={4}>
    <h1>Weekly Reflection Bot</h1>
    <SurveyContainer width={"768px"}>
      <ChatBot
        botAvatar={botAvatarPath}
        userAvatar={userAvatarUrlForStorybook}
        botDelay={1000}
        headerComponent={<SurveyHeader title={"Weekly Reflection"} />}
        steps={weeklySteps}
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
