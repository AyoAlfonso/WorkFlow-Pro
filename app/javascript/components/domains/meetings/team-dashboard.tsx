import * as React from "react";
import styled from "styled-components";
import { ITeam } from "~/models/team";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";

interface ITeamDashboardProps {
  team: ITeam;
}

export const TeamDashboard = ({ team }: ITeamDashboardProps): JSX.Element => {
  if (team && team.settings["weeklyMeetingDashboardLinkEmbed"]) {
    return (
      <EmbedContainer>
        <EmbedStep linkEmbed={team.settings.weeklyMeetingDashboardLinkEmbed} />
      </EmbedContainer>
    );
  } else {
    return <SetupMissingContainer>Please set up the team dashboard.</SetupMissingContainer>;
  }
};

export const SetupMissingContainer = styled.div`
  margin: auto;
  font-size: 16px;
  font-family: exo;
  justify-content: center;
  align-items: center;
`;

export const EmbedContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: 600px;
`;
