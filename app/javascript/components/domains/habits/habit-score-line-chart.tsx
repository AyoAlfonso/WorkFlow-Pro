import React, { useState } from "react";
import styled from "styled-components";
import "react-circular-progressbar/dist/styles.css";
import { baseTheme } from "~/themes";
import { Select } from "~/components/shared";
import { Heading } from "~/components/shared/heading";
import * as R from "ramda";
import { Line } from "react-chartjs-2";

interface IHabitScoreLineChartProps {
  habitId: number | string;
  scoreDataForLineGraph: any;
  color: string;
}

export const HabitScoreLineChart = ({
  habitId,
  scoreDataForLineGraph,
  color,
}: IHabitScoreLineChartProps): JSX.Element => {
  const [dataFilter, setDataFilter] = useState<string>("weeklyStats");

  const dataToShow = scoreDataForLineGraph[dataFilter];

  const { successGreen } = baseTheme.colors;

  const displayColor = color || successGreen;

  const data = {
    labels: dataToShow["labels"],
    datasets: [
      {
        label: "Score",
        fill: false,
        lineTension: 0.1,
        backgroundColor: displayColor,
        borderColor: displayColor,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: displayColor,
        pointBackgroundColor: displayColor,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: displayColor,
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: dataToShow["data"],
      },
    ],
  };

  return (
    <Container>
      <HeaderContainer>
        <Heading type={"h5"} fontSize={"16px"} fontWeight={400}>
          Score
        </Heading>

        <SelectContainer>
          <Select
            name="userRole"
            onChange={e => {
              setDataFilter(e.target.value);
            }}
            value={dataFilter}
          >
            {R.map(
              filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.display}
                </option>
              ),
              [
                { display: "Weekly", value: "weeklyStats" },
                { display: "Monthly", value: "monthlyStats" },
                { display: "Quarterly", value: "quarterlyStats" },
              ],
            )}
          </Select>
        </SelectContainer>
      </HeaderContainer>
      <Line
        data={data}
        key={`${dataToShow["label"]}-${habitId}`}
        options={{ legend: { display: false } }}
      />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const SelectContainer = styled.div`
  margin-top: 16px;
  margin-left: auto;
`;
