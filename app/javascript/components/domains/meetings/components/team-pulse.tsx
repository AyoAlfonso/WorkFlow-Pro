import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { HomeContainerBorders } from "../../home/shared-components";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { toJS } from "mobx";
import { baseTheme } from "~/themes";

export const TeamPulse = (): JSX.Element => {
  const { meetingStore } = useMst();
  const meeting = meetingStore.currentMeeting;

  const renderPercentageChange = () => {
    const increaseChange = meeting.emotionScorePercentageDifference.includes("+");

    return (
      <PercentageChangeContainer>
        <PercentageChangeText
          color={increaseChange ? baseTheme.colors.successGreen : baseTheme.colors.warningRed}
        >
          {meeting.emotionScorePercentageDifference}
        </PercentageChangeText>
        <ComparedToLastWeekText>Compared to last week</ComparedToLastWeekText>
      </PercentageChangeContainer>
    );
  };

  return (
    <Container>
      <HeaderTextContainer>
        <HeaderText>Team Pulse</HeaderText>
      </HeaderTextContainer>
      <TeamPulseBody>
        <OverallTeamPulse value={meeting.currentWeekAverageTeamEmotions} />
        <TeamPulseCard data={toJS(meeting.formattedAverageWeeklyUserEmotions)} />
      </TeamPulseBody>
      {renderPercentageChange()}
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  width: 650px;
  margin-left: auto;
  margin-right: auto;
`;

const HeaderTextContainer = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  border-bottom: ${props => `1px solid ${props.theme.colors.grey40}`};
`;

const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

const TeamPulseBody = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;

const PercentageChangeContainer = styled.div`
  display: flex;
  margin-top: -20px;
  margin-left: 36px;
`;

type PercentageChangeTextProps = {
  color: string;
};

const PercentageChangeText = styled(Text)<PercentageChangeTextProps>`
  color: ${props => props.color};
  font-weight: bold;
`;

const ComparedToLastWeekText = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.grey60};
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
`;
