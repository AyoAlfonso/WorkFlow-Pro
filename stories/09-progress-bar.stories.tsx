import { number, select, text, withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { CodeBlockDiv, ContainerDiv, PropsList, RowDiv } from "./shared";
import {
  StripedProgressBar as ProgressBar,
  StepProgressBar as StProgressBar,
} from "~/components/shared";

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
        completed={number("completed", 50, { range: true, min: 0, max: 100, step: 0.1 })}
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

export const StepProgressBar = () => (
  <ContainerDiv marginTop={250} marginLeft={25} width={"80%"}>
    <StProgressBar
      steps={[
        { accomplished: true, title: "Step #1" },
        { accomplished: true, title: "Step #2" },
        { accomplished: false, title: "Step #3" },
        { accomplished: false, title: "Step #4" },
      ]}
      onStepClick={() => {}}
      currentStep={1}
    />
  </ContainerDiv>
);
export const TimedStepProgressBar = () => (
  <ContainerDiv marginTop={250} marginLeft={25} width={"80%"}>
    <StProgressBar
      progressBarProps={{
        stepPositions: [25, 30, 45, 60, 100],
        percent: 55,
      }}
      steps={[
        { accomplished: true, title: "Step #1" },
        { accomplished: true, title: "Step #2" },
        { accomplished: false, title: "Step #3" },
        { accomplished: false, title: "Step #4" },
      ]}
      timed={true}
      onStepClick={() => {}}
      currentStep={1}
    />
  </ContainerDiv>
);
