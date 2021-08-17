import * as React from "react";
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries } from "react-vis";
import styled from "styled-components";
import { baseTheme } from "~/themes";
import * as moment from "moment";
import "react-vis/dist/style.css";
import {
  emotionA,
  emotionB,
  emotionC,
  emotionD,
  emotionE,
} from "~/components/shared/pulse/pulse-icon";

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
    switch (true) {
      case value < 2:
        return warningRed;
      case value < 3:
        return cautionYellow;
      case value < 4:
        return greyInactive;
      case value < 5:
        return successGreen;
      case value == 5:
        return finePine;
    }
  };

  return (
    <Container>
      <XYPlot
        height={225}
        width={425}
        margin={{ top: 40, bottom: 20 }}
        xType="ordinal"
        yDomain={[1, 5]}
      >
        <HorizontalGridLines />
        <XAxis
          orientation="top"
          hideLine
          top={-34}
          tickSize={0}
          tickFormat={value => renderDateOfWeek(value)}
          title={data.length ? "" : "This chart empty"}
        />
        <YAxis
          hideLine
          tickFormat={(value, index) => renderTickIcon(value, index)}
          left={-40}
          top={28}
        />
        <LineMarkSeries
          data={data.length ? parsedData() : [{ x: 0, y: 0 }]}
          colorType="literal"
          strokeStyle={"dashed"}
          lineStyle={{ stroke: greyInactive }}
        />
      </XYPlot>
    </Container>
  );
};

export const TeamPulseCardMini = ({ data }: ITeamPulseCardProps): JSX.Element => {
  const parsedData = () => {
    return data.map(data => {
      return {
        ...data,
        color: colorParser(data.y),
      };
    });
  };

  const colorParser = value => {
    switch (true) {
      case value < 2:
        return warningRed;
      case value < 3:
        return cautionYellow;
      case value < 4:
        return greyInactive;
      case value < 5:
        return successGreen;
      case value == 5:
        return finePine;
    }
  };

  return (
    <ContainerMini>
      <XYPlot
        height={225}
        width={224}
        margin={{ top: 40, bottom: 20 }}
        xType="ordinal"
        yDomain={[1, 5]}
      >
        <HorizontalGridLines />
        <XAxis
          orientation="top"
          hideLine
          top={-34}
          tickSize={0}
          tickFormat={value => renderDateOfWeek(value)}
          title={data.length ? "" : "This chart empty"}
        />
        <YAxis
          hideLine
          tickFormat={(value, index) => renderTickIcon(value, index)}
          left={-40}
          top={28}
        />
        <LineMarkSeries
          data={data.length ? parsedData() : [{ x: 0, y: 0 }]}
          colorType="literal"
          strokeStyle={"dashed"}
          lineStyle={{ stroke: greyInactive }}
        />
      </XYPlot>
    </ContainerMini>
  );
};

const renderDateOfWeek = date => {
  const splittedDate = date.split("-");
  return (
    <tspan>
      <tspan x="0" dy="1em">
        {splittedDate[1]}
      </tspan>
      <tspan x="0" dy="1.4em">
        {splittedDate[0]}
      </tspan>
    </tspan>
  );
};

const renderTickIcon = (value, index) => {
  //CHRIS' COMMENT: We can only either pass in strings or svgs for rendering the tick on the axes.
  //                That's why we are passing in hard coded svg values instead of using the Icon component
  switch (index) {
    case 0:
      return emotionE(true);
    case 1:
      return emotionD(true);
    case 2:
      return emotionC(true);
    case 3:
      return emotionB(true);
    case 4:
      return emotionA(true);
  }
};

const Container = styled.div`
  padding-left: 36px;
`;

const ContainerMini = styled.div`
  width: 224px;
  margin-right: auto;
  margin-left: auto;
`;
