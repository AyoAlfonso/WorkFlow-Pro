import { ScorecardsIndex } from "~/components/domains/scorecard/scorecards-index";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";

const DashboardSteps = team => {
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

export const EmbedContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: 600px;
`;
