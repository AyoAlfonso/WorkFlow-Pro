import * as React from "react";
import { Icon } from "~/components/shared";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  LineMarkSeries,
  VerticalGridLines,
} from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css";
import styled from "styled-components";

export const TeamPulseCard = (): JSX.Element => {
  const data = [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 5 },
    { x: 4, y: 1 },
    { x: 5, y: 2 },
    { x: 6, y: 5 },
    { x: 7, y: 3 },
    { x: 8, y: 4 },
    { x: 9, y: 3 },
  ];
  return (
    <Container>
      <XYPlot height={300} width={400} yType="ordinal" xType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis
          hideLine
          tickFormat={(value, index) => test(value, index)}
          left={-40}
          top={-8}
          height={350}
        />
        <LineMarkSeries data={data} />
      </XYPlot>
    </Container>
  );
};

const test = (value, index) => {
  console.log("value", value);
  console.log("index", index);
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <title>Emotion-E</title>
      <path d="M17.411 14.111c0 0 0 0 0 0 0.519 0 0.941-0.421 0.941-0.94v-0c0-1.040 0.843-1.883 1.883-1.883s1.883 0.843 1.883 1.883v0c0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941v0c0-2.079-1.686-3.765-3.765-3.765s-3.765 1.686-3.765 3.765v0c0.001 0.519 0.422 0.94 0.941 0.94 0 0 0 0 0 0v0z"></path>
      <path d="M8 16.946c0 1.040 0.843 1.883 1.883 1.883s1.883-0.843 1.883-1.883v0c0-0.955-1.467-2.558-1.729-2.839 0.45-0.076 0.788-0.463 0.788-0.929 0-0.003 0-0.005-0-0.008v0-0.071c0.020-1.024 0.855-1.847 1.883-1.847 1.040 0 1.883 0.843 1.883 1.883 0 0.013-0 0.025-0 0.037l0-0.002c0.044 0.482 0.447 0.857 0.938 0.857s0.893-0.375 0.937-0.854l0-0.004c-0.001-2.077-1.685-3.761-3.762-3.761-0 0-0.001 0-0.001 0h0c-2.077 0.001-3.761 1.685-3.761 3.763 0 0.001 0 0.002 0 0.003v-0c-0 0.003-0 0.005-0 0.008 0 0.464 0.335 0.849 0.777 0.927l0.006 0.001c-0.275 0.25-1.721 1.889-1.721 2.835z"></path>
      <path d="M16.47 17.891c-0 0-0.001 0-0.001 0-2.078 0-3.762 1.684-3.762 3.761v0c0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941v0c0-1.040 0.843-1.883 1.883-1.883s1.883 0.843 1.883 1.883v0c-0.002 0.025-0.004 0.054-0.004 0.084 0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941c0-0.030-0.001-0.059-0.004-0.088l0 0.004c-0.001-2.076-1.683-3.758-3.758-3.761h-0z"></path>
      <path d="M28.446 0.007h-24.789c-1.988 0.006-3.599 1.617-3.605 3.604v24.789c0.006 1.989 1.616 3.6 3.604 3.606h24.789c1.989-0.006 3.601-1.617 3.606-3.606v-24.789c-0.006-1.989-1.617-3.599-3.606-3.605h-0.001zM28.446 28.401h-24.789v-24.789h24.789z"></path>
    </svg>
  );
};

const Container = styled.div`
  padding: 36px;
`;
