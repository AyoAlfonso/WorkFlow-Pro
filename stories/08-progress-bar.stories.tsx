import * as React from "react";
import { text, withKnobs } from "@storybook/addon-knobs";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, space, typography } from "styled-system";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { ProgressBar } from "../app/javascript/components/shared/progress-bar";

export default { title: "Progress Bars", decorators: [withKnobs] };

export const StripedProgressBar = () => (
  <ContainerDiv pt={3}>
    <RowDiv width={"50%"} mb={2}>
      <ProgressBar completed={25} variant={"primary"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={2}>
      <ProgressBar completed={50} variant={"success"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={2}>
      <ProgressBar completed={75} variant={"warning"} />
    </RowDiv>
    <RowDiv width={"50%"} mb={2}>
      <ProgressBar completed={85} variant={"error"} />
    </RowDiv>
  </ContainerDiv>
);
