import React, { useState, useEffect } from "react"
import * as R from "ramda"
import styled from "styled-components"
import { baseTheme } from "~/themes/base"
import { Doughnut } from "react-chartjs-2"
import { StatusBadge } from "~/components/shared/status-badge"

const WeekSummary = ({
  kpis,
  currentWeek
}): JSX.Element => {
  const [data, setData] = useState<Object>(null);
  const [onTrack, setOnTrack] = useState(0);
  const {
    fadedGreen,
    fadedYellow,
    fadedRed,
    backgroundGrey,
    successGreen,
    cautionYellow,
    poppySunrise,
    warningRed,
    greyActive,
  } = baseTheme.colors

	const getScorePercent = (value: number, target: number, greaterThan: boolean) => {
		if (greaterThan) {
			return (value / target) * 100;
		} 
		else {
			return ((target + target - value) / target) * 100;
		}
	}

  useEffect(() => {
    const dataPoints = kpis.reduce((acc: number[], kpi: any) => {
      const week = kpi.weeks?.[currentWeek];
      if(!week) {
        acc[0]++;
      }
      else {
        const percentScore = getScorePercent(week.score, kpi.targetValue, kpi.greaterThan)
        if(percentScore >= 100) {
          acc[3]++;
        }
        else if(percentScore >= 90) {
          acc[2]++;
        }
        else {
          acc[1]++;
        }
      }
      return acc;
    }, [0,0,0,0])// ["None", "Behind", "Needs Attention", "On Track"]
    setOnTrack(dataPoints[3]);
    setData({
      labels: [
        "None",
        "Behind",
        "NeedsAttention",
        "On Track",
      ],
      datasets: [{
        data: dataPoints,
        backgroundColor: [
          greyActive,
          warningRed,
          cautionYellow,
          successGreen,
        ],
      }],
      hoveroffset: 4,
    })
  }, [kpis])

  return (
    <WeekContainer>
      <Header>This Week</Header>
      <RowContainer>
        <DoughnutChartContainer>
          <DoughnutTextContainer>
            <Text fontSize={11} mb={8}>This week</Text>
            <div><Text fontSize={20} bold><OnTrackCount>{onTrack}</OnTrackCount> / {kpis.length}</Text></div>
            <Text fontSize={11} mt={8}>KPIs are On Track</Text>
          </DoughnutTextContainer>
          <StyledDoughnut data={data} options={{
            legend: {
              display: false,
            },
            radius: 100,
            cutoutPercentage: 60,
          }} width={200} height={200}/>
        </DoughnutChartContainer>
        <LegendContainer>
          <StatusBadgeContainer>
            <StatusBadge color={successGreen} background={fadedGreen}>On Track</StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={poppySunrise} background={fadedYellow}>Needs Attention</StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={warningRed} background={fadedRed}>Behind</StatusBadge>
          </StatusBadgeContainer>
          <StatusBadgeContainer>
            <StatusBadge color={greyActive} background={backgroundGrey}>None</StatusBadge>
          </StatusBadgeContainer>
        </LegendContainer>
      </RowContainer>
    </WeekContainer>
  )
}

const QuarterSummary = ({
  kpis
}): JSX.Element => {
  return (
    <QuarterContainer>
      <Header>This Quarter</Header>
    </QuarterContainer>
  )
}


type ScorecardSummaryProps = {
  kpis: any,
  currentWeek: number,
  currentQuarter: number,
}

export const ScorecardSummary = ({
  kpis,
  currentWeek,
  currentQuarter,
}: ScorecardSummaryProps): JSX.Element => {
  return (
    <Container>
      <WeekSummary kpis={kpis} currentWeek={currentWeek}/>
      <QuarterSummary kpis={kpis}/>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 320px;
  width: 100%;
  margin-bottom: 32px;
`

const Header = styled.h4`
  margin-top: 0px;
  margin-bottom; 0px;
`

const WeekContainer = styled.div`
  width: 288px;
  height: 288px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  padding: 16px;
`

const QuarterContainer = styled.div`
  width: calc(100% - 32px);
  height: 288px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  padding: 16px;
  margin-left: 16px;
`

const RowContainer = styled.div`
  margin-top: 35px;
  display: flex;
  justify-content: space-between;
`

const DoughnutChartContainer = styled.div`
  position: relative;
`

const StyledDoughnut = styled(Doughnut)`
  position: absolute;
  top: 0;
  left: 0;
`

type TextProps = {
  fontSize?: number;
  mt?: number;
  mb?: number;
  bold?: boolean;
}

const Text = styled.p<TextProps>`
  font-size: ${props => props.fontSize || 12}px;
  margin-top: ${props => props.mt || 0}px;
  margin-bottom: ${props => props.mb || 0}px;
  ${props => props.bold && "font-weight: bold;"}
`

const OnTrackCount = styled.span`
  font-size: 32px;
  color: ${props => props.theme.colors.cautionYellow};
`

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
`

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  margin-top: auto;
  margin-bottom: auto;
`

const StatusBadgeContainer = styled.div`
  margin-bottom: 8px;
`
