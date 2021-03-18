import * as React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { PercentChange } from "~/components/shared/percent-change";
import { toJS } from "mobx";
import { NoMoodRatings } from "~/components/shared/no-mood-ratings";

interface ITeamPulseBodyProps {
  meeting: any;
}

export const TeamPulseBody = ({ meeting }: ITeamPulseBodyProps): JSX.Element => {
  const { companyStore } = useMst();

  let teamEmotions;
  let userEmotions;
  let percentageDifference;

  if (companyStore.company.displayFormat === "Company") {
    teamEmotions = meeting.currentWeekAverageTeamEmotions;
    userEmotions = meeting.formattedAverageWeeklyUserEmotions;
    percentageDifference = meeting.emotionScorePercentageDifference;
  } else {
    teamEmotions = meeting.currentMonthAverageTeamEmotions;
    userEmotions = meeting.formattedAverageMonthlyUserEmotions;
    percentageDifference = meeting.emotionScorePercentageDifferenceMonthly;
  }

  return (
    <Container>
      {teamEmotions > 0 ? (
        <BodyContainer>
          <TeamPulseWrapper>
            <OverallTeamPulse value={teamEmotions} />
            <TeamPulseCard data={toJS(userEmotions || [])} />
          </TeamPulseWrapper>
          <PercentChangeContainer>
            <PercentChange percentChange={percentageDifference} />
          </PercentChangeContainer>
        </BodyContainer>
      ) : (
        <BodyContainer>
          <NoMoodWrapper>
            <NoMoodRatings />
          </NoMoodWrapper>
        </BodyContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const BodyContainer = styled.div`
  width: 100%;
`;

const TeamPulseWrapper = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;

const PercentChangeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: 25px;
`;

const NoMoodWrapper = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  min-height: 250px;
  display: flex;
  flex-direction: column;
`;
