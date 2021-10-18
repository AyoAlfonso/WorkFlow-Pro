import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { ITeam } from "~/models/team";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { ScorecardsIndex } from "~/components/domains/scorecard/scorecards-index";
interface ITeamDashboardProps {
  team: ITeam;
}

export const TeamDashboard = ({ team }: ITeamDashboardProps): JSX.Element => {
  const { companyStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    companyStore.load().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading || !team || !team?.id) {
    return <> </>;
  }
  const ownerId = team.executive ? companyStore.company.id : team?.id;
  const ownerType = team.executive ? "company" : "team";

  if (team && team.settings["weeklyMeetingDashboardLinkEmbed"]) {
    if (team.customScorecard) {
      return (
        <EmbedContainer>
          <EmbedStep linkEmbed={team.settings.weeklyMeetingDashboardLinkEmbed} />
        </EmbedContainer>
      );
    }
  } else {
    return (
      <EmbedContainer>
        <ScorecardsIndex miniEmbed={true} ownerType={ownerType} ownerId={ownerId} />
      </EmbedContainer>
    );
    // return <SetupMissingContainer>Please set up the team dashboard.</SetupMissingContainer>;
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
