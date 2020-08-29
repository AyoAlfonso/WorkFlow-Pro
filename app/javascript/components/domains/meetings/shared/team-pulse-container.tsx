import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { HomeContainerBorders } from "../../home/shared-components";
import { OverallTeamPulse } from "../shared/overall-team-pulse";
import { TeamPulseCard } from "../shared/team-pulse-card";
import { toJS } from "mobx";
import { IMeeting } from "~/models/meeting";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
export interface ITeamPulseProps {
  meeting: IMeeting;
  title?: string;
}

export const TeamPulseContainer = ({ meeting, title }: ITeamPulseProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <ContainerHeaderWithText text={title ? title : t("teams.teamsPulseTitle")} />
      <TeamPulseBody>
        <OverallTeamPulse value={meeting.currentWeekAverageTeamEmotions} />
        <TeamPulseCard data={toJS(meeting.formattedAverageWeeklyUserEmotions || [])} />
      </TeamPulseBody>
      <PercentChange percentChange={meeting.emotionScorePercentageDifference} />
    </>
  );
};

const TeamPulseBody = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;
