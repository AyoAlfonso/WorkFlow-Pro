import * as React from "react";
import styled from "styled-components";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { toJS } from "mobx";
import { IMeeting } from "~/models/meeting";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { NoMoodRatings } from "~/components/shared/no-mood-ratings";
export interface ITeamPulseProps {
  meeting: IMeeting;
  title?: string;
}

export const TeamPulseContainer = ({ meeting, title }: ITeamPulseProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Container>
      <ContainerHeaderWithText text={title ? title : t("teams.teamsPulseTitle")} />

      {meeting.currentWeekAverageTeamEmotions > 0 ? (
        <BodyContainer>
          <TeamPulseBody>
            <OverallTeamPulse value={meeting.currentWeekAverageTeamEmotions} />
            <TeamPulseCard data={toJS(meeting.formattedAverageWeeklyUserEmotions || [])} />
          </TeamPulseBody>
          <PercentChangeContainer>
            <PercentChange percentChange={meeting.emotionScorePercentageDifference} />
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TeamPulseBody = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;

const PercentChangeContainer = styled.div`
  width: 100%;
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
