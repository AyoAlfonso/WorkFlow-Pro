import * as React from "react";
import { number, select, text, withKnobs } from "@storybook/addon-knobs";
import { atomOneLight, CopyBlock } from "react-code-blocks";
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
  {
    name: "text",
    type: "string",
    required: false,
    description: "the text to be displayed",
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
      <ProgressBar
        completed={number("completed", 50, { range: true, min: 0, max: 100, step: 1 })}
        variant={select("variant", ["primary", "success", "warning", "error"], "primary")}
        text={text("text", "Primary")}
      />
    </RowDiv>
    <h3>Variants</h3>
    <RowDiv width={"50%"} mb={3} mt={3}>
      <ProgressBar completed={25} variant={"primary"} text={"Primary"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={50} variant={"success"} text={"Success"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={75} variant={"warning"} text={"Warning"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={3}>
      <ProgressBar completed={85} variant={"error"} text={"Error"} />
    </RowDiv>
  </ContainerDiv>
);
