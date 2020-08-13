import * as React from "react";
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries } from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css";
import styled from "styled-components";
import { baseTheme } from "~/themes";
import * as moment from "moment";

const { warningRed, cautionYellow, successGreen, finePine, greyInactive } = baseTheme.colors;

interface ITeamPulseCardProps {
  data: any;
}

export const TeamPulseCard = ({ data }: ITeamPulseCardProps): JSX.Element => {
  const parsedData = () => {
    return data.map(data => {
      return {
        ...data,
        color: colorParser(data.y),
      };
    });
  };

  const colorParser = value => {
    switch (value) {
      case 1:
        return warningRed;
      case 2:
        return cautionYellow;
      case 3:
        return greyInactive;
      case 4:
        return successGreen;
      case 5:
        return finePine;
    }
  };

  return (
    <Container>
      <XYPlot height={225} width={425} margin={{ top: 40, bottom: 20 }} xType="ordinal">
        <HorizontalGridLines />
        <XAxis
          orientation="top"
          hideLine
          top={-34}
          tickSize={0}
          tickFormat={value => renderDateOfWeek(value)}
        />
        <YAxis
          hideLine
          tickFormat={(value, index) => renderTickIcon(value, index)}
          left={-40}
          top={28}
        />
        <LineMarkSeries
          data={parsedData()}
          colorType="literal"
          strokeStyle={"dashed"}
          lineStyle={{ stroke: greyInactive }}
        />
      </XYPlot>
    </Container>
  );
};

const renderDateOfWeek = date => {
  return (
    <tspan>
      <tspan x="0" dy="1em">
        {moment(date).format("D")}
      </tspan>
      <tspan x="0" dy="1.4em">
        {moment(date).format("ddd")}
      </tspan>
    </tspan>
  );
};

const renderTickIcon = (value, index) => {
  //CHRIS' COMMENT: We can only either pass in strings or svgs for rendering the tick on the axes.
  //                That's why we are passing in hard coded svg values instead of using the Icon component
  switch (index) {
    case 0:
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <title>Emotion-E</title>
          <path
            fill={warningRed}
            d="M17.411 14.111c0 0 0 0 0 0 0.519 0 0.941-0.421 0.941-0.94v-0c0-1.040 0.843-1.883 1.883-1.883s1.883 0.843 1.883 1.883v0c0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941v0c0-2.079-1.686-3.765-3.765-3.765s-3.765 1.686-3.765 3.765v0c0.001 0.519 0.422 0.94 0.941 0.94 0 0 0 0 0 0v0z"
          ></path>
          <path
            fill={warningRed}
            d="M8 16.946c0 1.040 0.843 1.883 1.883 1.883s1.883-0.843 1.883-1.883v0c0-0.955-1.467-2.558-1.729-2.839 0.45-0.076 0.788-0.463 0.788-0.929 0-0.003 0-0.005-0-0.008v0-0.071c0.020-1.024 0.855-1.847 1.883-1.847 1.040 0 1.883 0.843 1.883 1.883 0 0.013-0 0.025-0 0.037l0-0.002c0.044 0.482 0.447 0.857 0.938 0.857s0.893-0.375 0.937-0.854l0-0.004c-0.001-2.077-1.685-3.761-3.762-3.761-0 0-0.001 0-0.001 0h0c-2.077 0.001-3.761 1.685-3.761 3.763 0 0.001 0 0.002 0 0.003v-0c-0 0.003-0 0.005-0 0.008 0 0.464 0.335 0.849 0.777 0.927l0.006 0.001c-0.275 0.25-1.721 1.889-1.721 2.835z"
          ></path>
          <path
            fill={warningRed}
            d="M16.47 17.891c-0 0-0.001 0-0.001 0-2.078 0-3.762 1.684-3.762 3.761v0c0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941v0c0-1.040 0.843-1.883 1.883-1.883s1.883 0.843 1.883 1.883v0c-0.002 0.025-0.004 0.054-0.004 0.084 0 0.52 0.421 0.941 0.941 0.941s0.941-0.421 0.941-0.941c0-0.030-0.001-0.059-0.004-0.088l0 0.004c-0.001-2.076-1.683-3.758-3.758-3.761h-0z"
          ></path>
          <path
            fill={warningRed}
            d="M28.446 0.007h-24.789c-1.988 0.006-3.599 1.617-3.605 3.604v24.789c0.006 1.989 1.616 3.6 3.604 3.606h24.789c1.989-0.006 3.601-1.617 3.606-3.606v-24.789c-0.006-1.989-1.617-3.599-3.606-3.605h-0.001zM28.446 28.401h-24.789v-24.789h24.789z"
          ></path>
        </svg>
      );
    case 1:
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <title>Emotion-D</title>
          <path
            fill={cautionYellow}
            d="M28.394-0.031h-24.789c-1.988 0.006-3.599 1.617-3.605 3.604v24.789c0.006 1.989 1.616 3.6 3.604 3.606h24.789c1.989-0.006 3.601-1.617 3.606-3.606v-24.789c-0.006-1.989-1.617-3.599-3.606-3.605h-0.001zM28.394 28.363h-24.789v-24.789h24.789z"
          ></path>
          <path
            fill={cautionYellow}
            d="M9 14c0.552 0 1-0.448 1-1v0q0-0.037 0-0.075c0.021-1.088 0.908-1.963 2-1.963 1.105 0 2 0.896 2 2 0 0.013-0 0.026-0 0.039l0-0.002c0 0.552 0.448 1 1 1s1-0.448 1-1v0 0c0-2.209-1.791-4-4-4v0 0c-2.209 0-4 1.791-4 4v0c0 0.552 0.448 1 1 1v0z"
          ></path>
          <path
            fill={cautionYellow}
            d="M17 14c0.552 0 1-0.448 1-1v0c0-1.105 0.895-2 2-2s2 0.895 2 2v0c0 0.552 0.448 1 1 1s1-0.448 1-1v0c0-2.209-1.791-4-4-4s-4 1.791-4 4v0c0 0.552 0.448 1 1 1v0z"
          ></path>
          <path
            fill={cautionYellow}
            d="M16 18.010c-2.209 0-4 1.791-4 4v0c0 0.552 0.448 1 1 1s1-0.448 1-1v0c0-1.105 0.895-2 2-2s2 0.895 2 2v0c0 0.552 0.448 1 1 1s1-0.448 1-1v0c0-2.209-1.791-4-4-4v0z"
          ></path>
        </svg>
      );
    case 2:
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <title>Emotion-C</title>
          <path
            fill={greyInactive}
            d="M28.395 0h-24.789c-1.989 0.006-3.601 1.617-3.606 3.606v24.788c0.006 1.989 1.617 3.601 3.606 3.606h24.789c1.989-0.006 3.599-1.617 3.605-3.606v-24.788c-0.006-1.989-1.616-3.6-3.604-3.606h-0.001zM28.395 28.394h-24.789v-24.788h24.789z"
          ></path>
          <path
            fill={greyInactive}
            d="M11.575 15.875c1.964 0 3.556-1.592 3.556-3.556v0c-0.018-0.477-0.41-0.857-0.889-0.857s-0.871 0.38-0.889 0.855l-0 0.002c0 0.982-0.796 1.777-1.777 1.777s-1.777-0.796-1.777-1.777v0-0.026c-0.007-0.485-0.402-0.876-0.889-0.876-0.491 0-0.889 0.398-0.889 0.889 0 0.005 0 0.009 0 0.014v-0.001c0 0 0 0.001 0 0.001 0 1.963 1.592 3.555 3.555 3.555v0z"
          ></path>
          <path fill={greyInactive} d="M17.785 11.419v0z"></path>
          <path
            fill={greyInactive}
            d="M20.464 15.875c1.964 0 3.556-1.592 3.556-3.556v0c-0.018-0.477-0.41-0.857-0.889-0.857s-0.871 0.38-0.889 0.855l-0 0.002c0 0.982-0.796 1.777-1.777 1.777s-1.777-0.796-1.777-1.777v0-0.026c-0.007-0.485-0.402-0.876-0.889-0.876-0.491 0-0.889 0.398-0.889 0.889 0 0.005 0 0.009 0 0.014v-0.001c0 0 0 0.001 0 0.001 0 1.963 1.592 3.555 3.555 3.555v0z"
          ></path>
          <path
            fill={greyInactive}
            d="M15.064 21.241c0.025 0.472 0.414 0.845 0.89 0.845 0.016 0 0.032-0 0.047-0.001l-0.002 0h3.583c0.010 0 0.022 0.001 0.033 0.001 0.492 0 0.89-0.398 0.89-0.89s-0.398-0.89-0.89-0.89c-0.012 0-0.023 0-0.035 0.001l0.002-0h-3.672c-0.473 0.025-0.846 0.415-0.846 0.891 0 0.015 0 0.031 0.001 0.046l-0-0.002z"
          ></path>
        </svg>
      );
    case 3:
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <title>Emotion-B</title>
          <path
            fill={successGreen}
            d="M8.776 14.351c0.442 0 0.8-0.358 0.8-0.8v0c0-0.884 0.716-1.6 1.6-1.6s1.6 0.716 1.6 1.6v0c0 0.442 0.358 0.8 0.8 0.8s0.8-0.358 0.8-0.8v0c-0.001-1.766-1.433-3.197-3.199-3.197-0 0-0.001 0-0.001 0h0c-1.766 0.001-3.197 1.433-3.197 3.199 0 0 0 0.001 0 0.001v-0c0.001 0.44 0.357 0.797 0.797 0.797h0z"
          ></path>
          <path
            fill={successGreen}
            d="M18.375 14.351c0.442 0 0.8-0.358 0.8-0.8v0c0-0.884 0.716-1.6 1.6-1.6s1.6 0.716 1.6 1.6v0c0 0.442 0.358 0.8 0.8 0.8s0.8-0.358 0.8-0.8v0c-0.001-1.766-1.434-3.197-3.2-3.197 0 0 0 0 0 0v0c-1.766 0.001-3.197 1.433-3.197 3.199 0 0 0 0.001 0 0.001v-0c0.001 0.44 0.357 0.797 0.797 0.797h0z"
          ></path>
          <path
            fill={successGreen}
            d="M10.476 18.439c-0.144-0.228-0.394-0.377-0.68-0.377-0.443 0-0.801 0.359-0.801 0.801 0 0.147 0.039 0.284 0.108 0.402l-0.002-0.004c1.423 2.346 3.963 3.889 6.863 3.889 2.917 0 5.469-1.561 6.867-3.894l0.020-0.036c0.086-0.125 0.137-0.281 0.137-0.448 0-0.442-0.358-0.8-0.8-0.8-0.309 0-0.576 0.175-0.71 0.431l-0.002 0.004c-1.133 1.897-3.175 3.148-5.509 3.148-2.322 0-4.354-1.237-5.475-3.088l-0.016-0.029z"
          ></path>
          <path
            fill={successGreen}
            d="M28.375 0h-24.791c-1.989 0.006-3.601 1.617-3.606 3.606v24.788c0.006 1.989 1.617 3.601 3.606 3.606h24.792c1.989-0.006 3.599-1.617 3.605-3.606v-24.788c-0.006-1.989-1.616-3.6-3.604-3.606h-0.001zM28.375 28.394h-24.791v-24.788h24.791z"
          ></path>
        </svg>
      );
    case 4:
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <title>Emotion-A</title>
          <path
            fill={finePine}
            d="M8.637 13.551c0.442-0.001 0.799-0.358 0.8-0.8v-0c0-0.884 0.716-1.6 1.6-1.6s1.6 0.716 1.6 1.6v0c0 0.442 0.358 0.8 0.8 0.8s0.8-0.358 0.8-0.8v0c-0.001-1.766-1.434-3.197-3.2-3.197 0 0 0 0 0 0v0c-0 0-0.001 0-0.001 0-1.766 0-3.197 1.431-3.199 3.196v0c0 0 0 0.001 0 0.001 0 0.442 0.358 0.8 0.8 0.8 0 0 0 0 0 0v0z"
          ></path>
          <path
            fill={finePine}
            d="M18.238 13.551c0.442-0.001 0.799-0.358 0.8-0.8v-0c0.025-0.864 0.731-1.555 1.599-1.555s1.574 0.691 1.599 1.553l0 0.002c0.017 0.429 0.369 0.77 0.801 0.77s0.783-0.341 0.801-0.768l0-0.002c0-1.767-1.433-3.2-3.2-3.2s-3.2 1.433-3.2 3.2v0c0 0.442 0.358 0.8 0.8 0.8v0z"
          ></path>
          <path
            fill={finePine}
            d="M15.838 23.95c3.535 0 6.4-2.865 6.4-6.4v0h-12.8c0 3.535 2.865 6.4 6.4 6.4v0z"
          ></path>
          <path
            fill={finePine}
            d="M28.394 0.013h-24.788c-1.989 0.006-3.6 1.616-3.606 3.604v24.789c0.006 1.989 1.617 3.601 3.606 3.606h24.788c1.989-0.006 3.601-1.617 3.606-3.606v-24.789c-0.006-1.989-1.617-3.599-3.606-3.605h-0.001zM28.394 28.406h-24.788v-24.789h24.788z"
          ></path>
        </svg>
      );
  }
};

const Container = styled.div`
  padding-left: 36px;
`;
