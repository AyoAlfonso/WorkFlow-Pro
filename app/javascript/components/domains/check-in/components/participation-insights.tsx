import React from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { baseTheme } from "~/themes";
import { Text } from "~/components/shared";

const ParticipationInsights = (): JSX.Element => {
  const chartOptions = {
    legend: {
      display: false,
    },
    radius: 100,
    cutoutPercentage: 60,
  };

  const data = {
    labels: ["Participation"],
    datasets: [
      {
        data: [33, 67],
        backgroundColor: [baseTheme.colors.primary100, baseTheme.colors.grey100],
      },
    ],
    hoveroffset: 0,
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>Participation</HeaderText>
      </HeaderContainer>
      <DoughnutChartContainer>
        <DoughnutTextContainer>
          <ParticipationPercentage>33%</ParticipationPercentage>
        </DoughnutTextContainer>
        <Doughnut data={data} options={chartOptions} width={200} height={200} />
      </DoughnutChartContainer>
      <InfoContainer>
        <InfoText>
          Reported <b>2</b> people out of <b>6</b>
        </InfoText>
      </InfoContainer>
    </Container>
  );
};

export default ParticipationInsights;

const DoughnutChartContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
  position: sticky;
  top: 96px;

  @media only screen and (max-width: 768px) {
    position: static;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled.span`
  color: ${props => props.theme.colors.primary100};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const InfoContainer = styled.div`
  margin: 1em auto;
  text-align: center;
`;
const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.black};
`;

const DoughnutTextContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ParticipationPercentage = styled(Text)`
  color: ${props => props.theme.colors.grey100};
  font-size: 30px;
  font-weight: bold;
  margin: 0;
`;
