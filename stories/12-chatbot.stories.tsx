import * as React from "react";
import { SurveyBotNoMst } from "../app/javascript/components/shared/survey-bot";
import { CodeBlockDiv, ContainerDiv, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, LayoutProps } from "styled-system";

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
