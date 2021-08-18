import * as React from "react";
import { isNil } from "ramda";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { PercentChange } from "~/components/shared/percent-change";
import { toJS } from "mobx";
import { NoMoodRatings } from "~/components/shared/no-mood-ratings";
import { Loading } from "~/components/shared/loading";
interface ITeamPulseBodyProps {
  meeting: any;
}

export const TeamPulseBody = ({ meeting }: ITeamPulseBodyProps): JSX.Element => {
  const { companyStore } = useMst();

  if (isNil(companyStore.company)) {
    return <Loading />;
  }

  let teamEmotions, userEmotions, percentageDifference, periodDesc;
  if (companyStore.company.displayFormat === "Company") {
    teamEmotions = meeting.currentWeekAverageTeamEmotions;
    userEmotions = meeting.formattedAverageWeeklyUserEmotions;
    percentageDifference = meeting.emotionScorePercentageDifference;
    periodDesc = "week";
  } else {
    teamEmotions = meeting.currentMonthAverageTeamEmotions;
    userEmotions = meeting.formattedAverageMonthlyUserEmotions;
    percentageDifference = meeting.emotionScorePercentageDifferenceMonthly;
    periodDesc = "month";
  }
 
  return (
    <Container>
      {teamEmotions > 0 && userEmotions.length ? (
        <BodyContainer>
          <TeamPulseWrapper>
            <OverallTeamPulse value={teamEmotions} />
            <TeamPulseCard data={toJS(userEmotions || [])} />
          </TeamPulseWrapper>
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
