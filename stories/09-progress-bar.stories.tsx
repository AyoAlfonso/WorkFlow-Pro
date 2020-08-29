import { number, select, text, boolean, withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { CodeBlockDiv, ContainerDiv, PropsList, RowDiv } from "./shared";
import {
  StripedProgressBar as ProgressBar,
  StepProgressBar as StProgressBar,
  SemiCircleGauge as SCGauge,
} from "~/components/shared";
import { baseTheme } from "../app/javascript/themes/base";

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
      currentStepIndex={1}
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
      onStepClick={() => {}}
      currentStepIndex={1}
    />
  </ContainerDiv>
);

const SCGaugePropsList = [
  {
    name: "percentage",
    type: "number",
    required: true,
    description: "The percentage complete, from 0-100",
  },
  {
    name: "text",
    type: "string",
    required: false,
    description: "The number or text to display in the center of the gauge",
  },
  {
    name: "textColor",
    type: "string",
    required: false,
    description: "The color of the text",
  },
  {
    name: "fillColor",
    type: "string",
    required: false,
    description:
      "The color of the gauge.  If this prop is not supplied, the gauge changes colors depending on the percentage",
  },
  {
    name: "tickCount",
    type: "number",
    required: false,
    description:
      "The number of ticks to be displayed around the outside of the gauge.  These will only appear if hasTicks={true}",
  },
  {
    name: "hasTicks",
    type: "boolean",
    required: false,
    description: "Whether or not to display the ticks",
  },
  {
    name: "hasLabels",
    type: "boolean",
    required: false,
    description: "If true, will display labels for the ticks in increments of 10",
  },
  {
    name: "hasLine",
    type: "boolean",
    required: false,
    description: "If true, draws an extra line around the gauge, through the labels",
  },
];

export const SemiCircleGauge = () => {
  const percentage = number("completed", 60, { range: true, min: 0, max: 100, step: 0.1 });
  return (
    <ContainerDiv mat={"25px"} ml={"25px"} width={"100%"}>
      <h1>Semi Circle Gauge</h1>
      <CodeBlockDiv mb={"20px"}>
        <CopyBlock
          text={`
      import * as React from "react";
      import { SemiCircleGauge } from "../components/shared/semi-circle-gauge"

      const MyComponent = () => (
        <div>
          <SCGauge
            percentage={60}
            fillColor={"blue"}
            text={"60%"}
            textColor="text"
            tickCount={10}
            hasTicks={true}
            hasLabels={true}
            hasLine={false}
          />
        </div>
      )
      `}
          language={"tsx"}
          theme={atomOneLight}
        />
      </CodeBlockDiv>
      <PropsList propsList={SCGaugePropsList} styledSystemProps={["color", "layout", "space"]} />
      <RowDiv width={"300px"} mt={"50px"}>
        <SCGauge
          percentage={percentage}
          fillColor={select("color", {null, ...baseTheme.colors}, null)}
          text={`${percentage}%`}
          textColor="text"
          tickCount={number("tickCount", 10, { range: true, min: 0, max: 20, step: 1 })}
          hasTicks={boolean("hasTicks", true)}
          hasLabels={boolean("hasLabels", true)}
          hasLine={boolean("hasLine", true)}
        />
      </RowDiv>
    </ContainerDiv>
  );
};
