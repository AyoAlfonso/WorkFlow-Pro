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
import { findNextMonday, resetYearOfDateToCurrent } from "~/utils/date-time";
import { useMst } from "~/setup/root";

const WeekSummary = observer(
  ({ kpis, currentWeek, currentFiscalYear, setWeekToShow }): JSX.Element => {
    const [data, setData] = useState<Object>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const { companyStore } = useMst();

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
            const percentScore =
              kpi.targetValue == 0 && week.score == 0
                ? 100
                : kpi.targetValue == 0 && week.score != 0
                ? -week.score
                : getScorePercent(week.score, kpi.targetValue, kpi.greaterThan);
            if (percentScore >= 100) {
              acc[3]++;
            } else if (percentScore >= kpi.needsAttentionThreshold) {
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
        <HeaderContainer>
          <HeaderContainer onClick={() => setShowDropdown(!showDropdown)}>
            <Header>
              {companyStore.company.currentFiscalWeek === currentWeek ? "This Week" : "Last Week"}
            </Header>
            {showDropdown ? (
              <ChevronUp
                icon={"Chevron-Down"}
                size={"12px"}
                iconColor={"primary100"}
                ml={"0.5em"}
              />
            ) : (
              <Icon icon={"Chevron-Down"} size={"12px"} iconColor={"primary100"} ml={"0.5em"} />
            )}
          </HeaderContainer>
          {showDropdown && (
            <WeekToogleContainer>
              {companyStore.company.currentFiscalWeek === currentWeek ? (
                <ToogleOption
                  onClick={() => {
                    setWeekToShow(currentWeek - 1);
                    setShowDropdown(false);
                  }}
                >
                  Last Week
                </ToogleOption>
              ) : (
                <ToogleOption
                  onClick={() => {
                    setWeekToShow(companyStore.company.currentFiscalWeek);
                    setShowDropdown(false);
                  }}
                >
                  This Week
                </ToogleOption>
              )}
            </WeekToogleContainer>
          )}
        </HeaderContainer>
        <RowContainer>
          <DoughnutChartContainer>
            <DoughnutTextContainer>
              <Text fontSize={11} mb={8}>
                {companyStore.company.currentFiscalWeek === currentWeek ? "This Week" : "Last Week"}
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
  },
);

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
            return `${label}: ${tooltipItem.yLabel.toFixed(1)}%`;
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
      ? weeks.map((weekIndex: number) => {
          return (
            kpis.reduce((acc: number, kpi: any) => {
              const week = kpi?.period[currentFiscalYear]?.[weekIndex];
              const { targetValue, greaterThan } = kpi;

              return (
                acc +
                (week
                  ? Math.min(
                      100,
                      kpi.targetValue == 0 && week.score == 0
                        ? 100
                        : kpi.targetValue == 0 && week.score != 0
                        ? -week.score
                        : getScorePercent(week.score, targetValue, greaterThan),
                    )
                  : 0)
              );
            }, 0) / kpis.length
          );
        })
      : [];
  };

  const weekToDate = (week: number): string =>
    moment(findNextMonday(resetYearOfDateToCurrent(fiscalYearStart, currentFiscalYear)))
      .add(week - 1, "w")
      .startOf("week" as moment.unitOfTime.StartOf)
      .format("MMM D");

  useEffect(() => {
    const startWeek = (currentQuarter - 1) * 13 + 1;
    const currentQuarterWeeks = R.range(startWeek, currentWeek + 1);
    const currentQuarterData = gatherData(currentQuarterWeeks);
    if (currentQuarterData.length > 0) {
      setCurrentWeekPercent(R.last(currentQuarterData)?.toFixed(2));
      setQuarterlyPercent(currentQuarterData.reduce((a, b) => a + b) / currentQuarterData.length);
      if (currentWeek != 1) {
        setLastWeekPercent(+currentQuarterData[currentQuarterData.length - 2]);
      }
    }
    
    setData({
      labels: R.range(startWeek, startWeek + 13).map((i: number) => `Week ${i}`),
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
    if (percentGrade >= 85) {
      return (
        <>
          <Text ml={8} mr={16} fontSize={32} color={successGreen} bold>
            {percentGrade.toFixed(2)}%
          </Text>
        </>
      );
    } else if (percentGrade < 85 && percentGrade >= 60) {
      return (
        <>
          <Text ml={8} mr={16} fontSize={32} color={yellowSea} bold>
            {quarterlyPercent.toFixed(2)}%
          </Text>
        </>
      );
    } else if (percentGrade < 60) {
      return (
        <>
          <Text ml={8} mr={16} fontSize={32} color={warningRed} bold>
            {quarterlyPercent.toFixed(2)}%
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text ml={8} mr={16} fontSize={32} color={warningRed} bold>
            {quarterlyPercent.toFixed(2)}%
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

      return (
        <>
          {difference >= 0 ? (
            <>
              <Arrow up={true} color={successGreen} />
              <Text color={successGreen} ml={4}>
                {Number.isNaN(difference) ? 0 : difference}%
              </Text>
            </>
          ) : (
            <>
              <Arrow up={false} color={warningRed} />
              <Text color={warningRed} ml={4}>
                {Number.isNaN(difference * -1) ? 0 : difference * -1}%
              </Text>
            </>
          )}
          <Text color={greyActive} ml={8} fontSize={12}>
            {t<string>("scorecards.latestWeekComparison")}
          </Text>
        </>
      );
    }
  };

  return (
    <QuarterContainer>
      <Header>This Quarter</Header>
      <Text color={greyActive} fontSize={14} mt={4} mb={9}>
        {/* {t<string>("scorecards.quarterlyGraphTitle")} */}
      </Text>
      <QuarterInfoContainer>
        <StatsContainer>
          {renderGrade(quarterlyPercent)}
          {renderWeekDifference()}
        </StatsContainer>
        <QuarterLegendContainer>
          {/* <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={primary100} background={backgroundBlue}>
              • Current Quarter
            </StatusBadge>
          </StatusBadgeContainer> */}
          {/* <StatusBadgeContainer>
            <StatusBadge fontSize={"12px"} color={greyActive} background={backgroundGrey}>
              • Last Quarter
            </StatusBadge>
          </StatusBadgeContainer> */}
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
  setWeekToShow: React.Dispatch<React.SetStateAction<number>>;
};

export const ScorecardSummary = ({
  kpis,
  currentWeek,
  currentQuarter,
  fiscalYearStart,
  currentFiscalYear,
  setWeekToShow,
}: ScorecardSummaryProps): JSX.Element => {
  const KPIs = JSON.parse(JSON.stringify(kpis));
  return (
    <Container>
      <WeekSummary
        kpis={KPIs}
        currentWeek={currentWeek}
        currentFiscalYear={currentFiscalYear}
        setWeekToShow={setWeekToShow}
      />
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: fit-content;
  cursor: pointer;
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

const RightIcon = styled(Icon)`
  transform: rotate(180deg);
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const WeekToogleContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  padding: 8px 0px;
  position: absolute;
  box-shadow: 0px 3px 6px #00000029;
  width: 100%;
  z-index: 5;
  bottom: -45px;
`;

const ToogleOption = styled.div`
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const ChevronUp = styled(Icon)`
  transform: rotate(180deg);
`;
