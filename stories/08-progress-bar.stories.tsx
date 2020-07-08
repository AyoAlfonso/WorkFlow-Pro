import * as React from "react";
import { text, withKnobs } from "@storybook/addon-knobs";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, space, typography } from "styled-system";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { StripedProgressBar as ProgressBar } from "../app/javascript/components/shared/striped-progress-bar";

export default { title: "Progress Bars", decorators: [withKnobs] };

const propsList = [
  {
    name: "completed",
    type: "number",
    required: true,
    description: "percentage complete from 0-100",
  },
  {
    name: "variant",
    type: "string",
    required: true,
    description: "must be one of: primary | success | warning | error",
  },
];

export const StripedProgressBar = () => (
  <ContainerDiv>
    <h1>Striped Progress Bar</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { StripedProgressBar } from "../components/shared/striped-progress-bar"

      const MyComponent = () => (
        <div>
          <StripedProgressBar completed={25} variant={"primary"} />
        </div>    
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} styledSystemProps={["color", "layout", "space"]} />
    <RowDiv width={"50%"} mb={3} mt={3}>
      <ProgressBar completed={25} variant={"primary"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={50} variant={"success"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={75} variant={"warning"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={85} variant={"error"} />
    </RowDiv>
  </ContainerDiv>
);
