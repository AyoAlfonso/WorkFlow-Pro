import React, { useState, useEffect, useMemo } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment";
import { observer } from "mobx-react";
import { baseTheme } from "~/themes/base";
import { Doughnut, Line } from "react-chartjs-2";
import { StatusBadge } from "~/components/shared/status-badge";
import { Icon } from "~/components/shared/icon";
import { getScorePercent } from "./scorecard-table-view";
import { toJS } from "mobx";
import { useTranslation } from "react-i18next";
import { dataState } from "./__tests__/scorecard-data/data-store";

const WeekSummary = ({}): JSX.Element => {
  const [data, setData] = useState<Object>(null);
  const [onTrack, setOnTrack] = useState(1);
  const {
    cavier,
    fadedCavier,
    fadedGreen,
    fadedYellow,
    fadedRed,
    backgroundGrey,
    successGreen,
    cautionYellow,
    poppySunrise,
    warningRed,
    greyActive,
    grey100,
  } = baseTheme.colors;

  const chartOptions = {
    legend: {
      display: false,
    },
    radius: 100,
    cutoutPercentage: 60,
  };

  useMemo(() => {
    setData({
      labels: ["None", "Behind", "NeedsAttention", "On Track"],
      datasets: [
        {
          data: [1, 1, 1, 1],
          backgroundColor: [grey100, warningRed, cautionYellow, successGreen],
        },
      ],
      hoveroffset: 4,
    });
  }, []);

  return (
    <WeekContainer>
      <Header>This Week</Header>
      <RowContainer>
        <DoughnutChartContainer>
          <DoughnutTextContainer>
            <Text fontSize={11} mb={8}>
              This week
            </Text>
            <div>
              <Text fontSize={20} bold>
                <OnTrackCount percentageOnTrack={1 / 4}>1</OnTrackCount> / 4
              </Text>
            </div>
            <Text fontSize={11} mt={8}>
              KPIs are On Track
            </Text>
          </DoughnutTextContainer>
          {<StyledDoughnut data={data} options={chartOptions} width={200} height={200} />}
        </DoughnutChartContainer>
        <WeekLegendContainer>
          <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={successGreen} background={fadedGreen}>
              On Track
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={poppySunrise} background={fadedYellow}>
              Needs Attention
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={warningRed} background={fadedRed}>
              Behind
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={greyActive} background={backgroundGrey}>
              None
            </StatusBadge>
          </StatusBadgeContainer>
        </WeekLegendContainer>
      </RowContainer>
    </WeekContainer>
  );
};

const Arrow = ({ up = true, color }) => {
  return (
    <ArrowIconContainer up={up}>
      <Icon icon={"Arrow"} size={12} iconColor={color} />
    </ArrowIconContainer>
  );
};

const QuarterSummary = ({}): JSX.Element => {
  const [currentWeekPercent, setCurrentWeekPercent] = useState(0);
  const [quarterlyPercent, setQuarterlyPercent] = useState(0);
  const [lastWeekPercent, setLastWeekPercent] = useState<number | null>(null);
  const [data, setData] = useState<Object>(null);
  const {
    cavier,
    fadedCavier,
    white,
    primary100,
    backgroundBlue,
    greyActive,
    grey100,
    poppySunrise,
    yellowSea,
    backgroundGrey,
    successGreen,
    warningRed,
    fadedGreen,
    fadedYellow,
    fadedRed,
  } = baseTheme.colors;

  const chartOptions = {
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          const label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            return `${label}: ${tooltipItem.yLabel}%`;
          } else {
            return "";
          }
        },
      },
    },
    scales: {
      x: {
        autoSkip: false,
      },
      yAxes: [
        {
          ticks: {
            stepSize: 20,
            callback: function(value, index, values) {
              return `${value}%`;
            },
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    setData({
      labels: [
        "Mar 7",
        "Mar 14",
        "Mar 21",
        "Mar 28",
        "Apr 4",
        "Apr 11",
        "Apr 18",
        "Apr 25",
        "May 2",
        "May 9",
        "May 16",
        "May 23",
        "May 30",
      ],
      datasets: [
        {
          label: "Current Quarter",
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          fill: false,
          backgroundColor: white,
          borderColor: primary100,
          borderWidth: 1.5,
          tension: 0,
        },
      ],
    });
  });
  const renderGrade = percentGrade => {
    return (
      <>
        <Text ml={8} mr={16} fontSize={32} color={successGreen} bold>
          {percentGrade.toFixed(2)}%
        </Text>
      </>
    );
  };

  const renderWeekDifference = () => {
    return (
      <>
        {
          <>
            <Arrow up={true} color={successGreen} />
            <Text color={successGreen} ml={4}>
              5%
            </Text>
          </>
        }
        <Text color={greyActive} ml={8} fontSize={12}>
          {"compared to last week"}
        </Text>
      </>
    );
  };

  return (
    <QuarterContainer>
      <Header>This Quarter</Header>
      <Text color={greyActive} fontSize={14} mt={4} mb={9}></Text>
      <QuarterInfoContainer>
        <StatsContainer>
          {renderGrade(40)}
          {renderWeekDifference()}
        </StatsContainer>
        <QuarterLegendContainer></QuarterLegendContainer>
      </QuarterInfoContainer>
      <LineChartContainer>
        {data && <Line data={data} options={chartOptions} height={200} />}
      </LineChartContainer>
    </QuarterContainer>
  );
};

type ScorecardSummaryProps = {};
export const DummyScorecardSummary = ({}: ScorecardSummaryProps): JSX.Element => {
  return (
    <Container>
      <WeekSummary />
      <QuarterSummary />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 320px;
  grid-template-areas: "week quarter";
  grid-gap: 16px;
  width: 100%;
  margin-bottom: 32px;
  @media (max-width: 850px) {
    grid-template-columns: 100%;
    grid-template-rows: 320px 340px;
    grid-template-areas:
      "week"
      "quarter";
  }
`;

const Header = styled.h3`
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 21px;
`;

const WeekContainer = styled.div`
  grid-area: week;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  padding: 16px;
`;

const QuarterContainer = styled.div`
  grid-area: quarter;
  @media (min-width: 850px) {
    width: calc(100% - 34px);
  }
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  padding: 16px;
`;

const RowContainer = styled.div`
  margin-top: 35px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const DoughnutChartContainer = styled.div`
  position: relative;
`;

const StyledDoughnut = styled(Doughnut)`
  position: absolute;
  top: 0;
  left: 0;
`;

type TextProps = {
  fontSize?: number;
  color?: string;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  bold?: boolean;
  children?: React.ReactNode | React.ReactNode[];
};

type OnTrackCountProps = {
  percentageOnTrack: number;
};

const Text = styled.p<TextProps>`
  font-size: ${props => props.fontSize || 12}px;
  margin-top: ${props => props.mt || 0}px;
  margin-bottom: ${props => props.mb || 0}px;
  margin-left: ${props => props.ml || 0}px;
  margin-right: ${props => props.mr || 0}px;
  ${props => props.color && `color: ${props.color};`}
  ${props => props.bold && "font-weight: bold;"}
`;

const OnTrackCount = styled.span<OnTrackCountProps>`
  font-size: 32px;
  color: ${props =>
    props.percentageOnTrack * 100 > 90
      ? props.theme.colors.successGreen
      : props.percentageOnTrack * 100 >= 50 && props.percentageOnTrack * 100 <= 90
      ? props.theme.colors.cautionYellow
      : props.theme.colors.warningRed};
`;

const DoughnutTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  padding: 40px;
  z-index: -2;
`;

const WeekLegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80px;
  margin-top: auto;
  margin-bottom: auto;
`;

const StatusBadgeContainer = styled.div``;

const LineChartContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 184px;
  width: 100%;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

type GradeContainerProps = {
  background?: string;
};

const GradeContainer = styled.div<GradeContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 38px;
  background: ${props => props.background || props.theme.colors.fadedYellow};
  border-radius: 4px;
`;

const QuarterInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const QuarterLegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
`;

type ArrowIconContainerProps = {
  up: boolean;
};

const ArrowIconContainer = styled.div<ArrowIconContainerProps>`
  transform: rotate(${props => (props.up ? 0 : 180)}deg);
`;
