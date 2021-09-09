import React, { useState, useEffect } from "react";
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

const WeekSummary = ({ kpis, currentWeek, currentFiscalYear }): JSX.Element => {
  const [data, setData] = useState<Object>(null);
  const [onTrack, setOnTrack] = useState(0);
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

  useEffect(() => {
    const dataPoints = kpis.reduce(
      (acc: number[], kpi: any) => {
        const week = kpi?.period[currentFiscalYear]?.[currentWeek];
        if (!week) {
          acc[0]++;
        } else {
          const percentScore = getScorePercent(week.score, kpi.targetValue, kpi.greaterThan);
          if (percentScore >= 100) {
            acc[3]++;
          } else if (percentScore >= 90) {
            acc[2]++;
          } else {
            acc[1]++;
          }
        }
        return acc;
      },
      [0, 0, 0, 0],
    ); // ["None", "Behind", "Needs Attention", "On Track"]
    setOnTrack(dataPoints[3]);
    setData({
      labels: ["None", "Behind", "NeedsAttention", "On Track"],
      datasets: [
        {
          data: dataPoints,
          backgroundColor: [grey100, warningRed, cautionYellow, successGreen],
        },
      ],
      hoveroffset: 4,
    });
  }, [kpis]);

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
                <OnTrackCount percentageOnTrack={onTrack / kpis.length}>{onTrack}</OnTrackCount> /{" "}
                {kpis.length}
              </Text>
            </div>
            <Text fontSize={11} mt={8}>
              KPIs are On Track
            </Text>
          </DoughnutTextContainer>
          {data && <StyledDoughnut data={data} options={chartOptions} width={200} height={200} />}
        </DoughnutChartContainer>
        <WeekLegendContainer>
          <StatusBadgeContainer>
            <StatusBadge color={successGreen} background={fadedGreen}>
              On Track
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={poppySunrise} background={fadedYellow}>
              Needs Attention
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={warningRed} background={fadedRed}>
              Behind
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={greyActive} background={backgroundGrey}>
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

const QuarterSummary = ({
  kpis,
  currentWeek,
  currentQuarter,
  fiscalYearStart,
  currentFiscalYear,
}): JSX.Element => {
  const [currentWeekPercent, setCurrentWeekPercent] = useState(0);
  const [lastWeekPercent, setLastWeekPercent] = useState<number | null>(null);
  const [data, setData] = useState<Object>(null);

  const {
    cavier,
    fadedCavier,
    white,
    primary100,
    primary20,
    backgroundBlue,
    greyActive,
    grey100,
    poppySunrise,
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

  const gatherData = (weeks: [number]) => {
    return kpis
      ? weeks.map(
          (weekIndex: number) =>
            kpis.reduce((acc: number, kpi: any) => {
              const week = kpi?.period[currentFiscalYear]?.[weekIndex];
              const { targetValue, greaterThan } = kpi;
              return (
                acc +
                (week ? Math.min(100, getScorePercent(week.score, targetValue, greaterThan)) : 0)
              );
            }, 0) / kpis.length,
        )
      : [];
  };

  const weekToDate = (week: number): string =>
    moment(fiscalYearStart)
      .add(week, "w")
      .startOf("week" as moment.unitOfTime.StartOf)
      .format("MMM D");

  useEffect(() => {
    const startWeek = (currentQuarter - 1) * 13 + 1;
    const currentQuarterWeeks = R.range(startWeek, currentWeek + 1);
    const currentQuarterData = gatherData(currentQuarterWeeks);
    const lastQuarterStartWeek = (currentQuarter - 2) * 13 + 1;
    const lastQuarterWeeks = R.range(lastQuarterStartWeek, lastQuarterStartWeek + 13);
    const lastQuarterData = currentQuarter > 1 ? gatherData(lastQuarterWeeks) : [];
    setCurrentWeekPercent(R.last(currentQuarterData).toFixed(2));
    if (currentWeek != 1) {
      setLastWeekPercent(+currentQuarterData[currentQuarterData.length - 2]);
    }
    setData({
      labels: R.range(startWeek, startWeek + 13).map((i: number) => weekToDate(i)),
      datasets: [
        {
          label: "Current Quarter",
          data: currentQuarterData,
          fill: false,
          backgroundColor: white,
          borderColor: primary100,
          borderWidth: 1.5,
          tension: 0,
        },
        {
          label: "Last Quarter",
          data: lastQuarterData,
          fill: false,
          backgroundColor: white,
          borderColor: grey100,
          borderWidth: 1.5,
          tension: 0,
        },
      ],
    });
  }, [kpis]);
  const { t } = useTranslation();

  const renderCurrentWeekPercent = () => {
    return (
      <Text ml={8} mr={16} fontSize={32} color={poppySunrise} bold>
        {currentWeekPercent}%
      </Text>
    );
  };

  const renderGrade = percentGrade => {
    if (isNaN(percentGrade)) {
      return <></>;
    }
    if (percentGrade >= 100) {
      return (
        <>
          <GradeContainer background={fadedGreen}>
            <Text fontSize={24} color={successGreen} bold>
              A
            </Text>
          </GradeContainer>
          <Text ml={8} mr={16} fontSize={32} color={successGreen} bold>
            +100%
          </Text>
        </>
      );
    } else if (percentGrade >= 90) {
      return (
        <>
          <GradeContainer background={fadedYellow}>
            <Text fontSize={24} color={poppySunrise} bold>
              B
            </Text>
          </GradeContainer>
          <Text ml={8} mr={16} fontSize={32} color={poppySunrise} bold>
            {currentWeekPercent}%
          </Text>
        </>
      );
    } else if (percentGrade >= 75) {
      return (
        <>
          <GradeContainer background={fadedYellow}>
            <Text fontSize={24} color={poppySunrise} bold>
              C
            </Text>
          </GradeContainer>
          <Text ml={8} mr={16} fontSize={32} color={poppySunrise} bold>
            {currentWeekPercent}%
          </Text>
        </>
      );
    } else if (percentGrade >= 50) {
      return (
        <>
          <GradeContainer background={fadedCavier}>
            <Text fontSize={24} color={cavier} bold>
              D
            </Text>
          </GradeContainer>
          <Text ml={8} mr={16} fontSize={32} color={cavier} bold>
            {currentWeekPercent}%
          </Text>
        </>
      );
    } else {
      return (
        <>
          <GradeContainer background={warningRed}>
            <Text fontSize={24} color={white} bold>
              F
            </Text>
          </GradeContainer>
          <Text ml={8} mr={16} fontSize={32} color={warningRed} bold>
            {currentWeekPercent}%
          </Text>
        </>
      );
    }
  };

  const renderWeekDifference = () => {
    if (lastWeekPercent === null) {
      return <></>;
    } else {
      const difference = +(currentWeekPercent - lastWeekPercent).toFixed(2);
      // difference = +difference;

      return (
        <>
          {difference >= 0 ? (
            <>
              <Arrow up={true} color={successGreen} />
              <Text color={successGreen} ml={4}>
                {difference}%
              </Text>
            </>
          ) : (
            <>
              <Arrow up={false} color={warningRed} />
              <Text color={warningRed} ml={4}>
                {difference * -1}%
              </Text>
            </>
          )}
          <Text color={greyActive} ml={8} fontSize={9}>
            compared to last week
          </Text>
        </>
      );
    }
  };

  return (
    <QuarterContainer>
      <Header>This Quarter</Header>
      <Text color={greyActive} fontSize={9} mt={4} mb={9}>
        {t("scorecards.quarterlyGraphTitle")}
      </Text>
      <QuarterInfoContainer>
        <StatsContainer>
          {renderGrade(currentWeekPercent)}
          {renderWeekDifference()}
        </StatsContainer>
        <QuarterLegendContainer>
          <StatusBadgeContainer>
            <StatusBadge color={primary100} background={backgroundBlue}>
              • Current Quarter
            </StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={greyActive} background={backgroundGrey}>
              • Last Quarter
            </StatusBadge>
          </StatusBadgeContainer>
        </QuarterLegendContainer>
      </QuarterInfoContainer>
      <LineChartContainer>
        {data && <Line data={data} options={chartOptions} height={200} />}
      </LineChartContainer>
    </QuarterContainer>
  );
};

type ScorecardSummaryProps = {
  kpis: any;
  currentWeek: number;
  currentQuarter: number;
  fiscalYearStart: string;
  currentFiscalYear: number;
};

export const ScorecardSummary = ({
  kpis,
  currentWeek,
  currentQuarter,
  fiscalYearStart,
  currentFiscalYear,
}: ScorecardSummaryProps): JSX.Element => {
  const KPIs = toJS(kpis);
  return (
    <Container>
      <WeekSummary kpis={KPIs} currentWeek={currentWeek} currentFiscalYear={currentFiscalYear} />
      <QuarterSummary
        kpis={KPIs}
        currentWeek={currentWeek}
        currentQuarter={currentQuarter}
        fiscalYearStart={fiscalYearStart}
        currentFiscalYear={currentFiscalYear}
      />
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

const Header = styled.h4`
  margin-top: 0px;
  margin-bottom: 0px;
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
  overflow-x: auto;
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
