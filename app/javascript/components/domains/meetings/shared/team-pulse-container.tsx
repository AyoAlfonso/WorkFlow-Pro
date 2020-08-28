import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { HomeContainerBorders } from "../../home/shared-components";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { toJS } from "mobx";
import { IMeeting } from "~/models/meeting";
import { PercentChange } from "~/components/shared/percent-change";

export interface ITeamPulseProps {
  meeting: IMeeting;
  title?: string;
}

export const TeamPulseContainer = ({ meeting, title }: ITeamPulseProps): JSX.Element => {
  return (
    <>
      <HeaderTextContainer>
        <HeaderText>{title ? title : `Team Pulse`}</HeaderText>
      </HeaderTextContainer>
      <TeamPulseBody>
        <OverallTeamPulse value={meeting.currentWeekAverageTeamEmotions} />
        <TeamPulseCard data={toJS(meeting.formattedAverageWeeklyUserEmotions)} />
      </TeamPulseBody>
      <PercentChange percentChange={meeting.emotionScorePercentageDifference} />
    </>
  );
};

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
