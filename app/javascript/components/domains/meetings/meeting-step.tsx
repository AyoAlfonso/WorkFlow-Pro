import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { ConversationStarter } from "./components/conversation-starter";
import { PersonalGoals } from "./components/personal-goals";
import { YesterdayInReview } from "./components/yesterday-in-review";
import { DailyPlanning } from "./components/daily-planning";
import { CompleteDailyPlanning } from "./components/complete-daily-planning";
import { Milestones } from "./components/milestones";
import { PersonalKeyActivitiesWeekly } from "./components/personal-key-activities-weekly";
import { WeeklyReflection } from "./components/weekly-reflection";
import { MeetingRating } from "./components/meeting-rating";
import { Recap } from "./components/recap";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { IMeeting } from "~/models/meeting";
import { IStep } from "~/models/step";
import { Loading } from "~/components/shared/loading";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { TextStep } from "~/components/domains/meetings/shared/text-step";
import { TeamPulse } from "./components/team-pulse";
import { TeamKeyActivities } from "./components/team-key-activities";
import { MeetingGoals } from "./components/meeting-goals";
import { TeamIssues } from "./components/team-issues";
import { ParkingLot } from "~/components/domains/meetings-forum/components/parking-lot";
import { Exploration } from "~/components/domains/meetings-forum/components/exploration";
import { MonthlyReflection } from "~/components/domains/meetings-forum/components/monthly-reflection";
import { WeeklyMilestones  } from "../check-in/components/weekly-milestones";
import { KpiComponent } from "../check-in/components/kpi";
import { ScorecardsIndex } from "~/components/domains/scorecard/scorecards-index";
import { useMst } from "~/setup/root";

export interface IMeetingStepProps {
  meeting: IMeeting;
}

const StepComponent = (step: IStep, meeting: IMeeting) => {
  const { team_id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const { teamStore, companyStore } = useMst();
  useEffect(() => {
    teamStore.getTeam(team_id).then(() => {
      setLoading(false);
    });
  }, []);

  const currentTeam = teamStore.currentTeam;
  if (loading || R.isNil(step) || !currentTeam || !currentTeam?.id) {
    return <Loading />;
  }

  const ownerId = currentTeam.executive ? companyStore.company.id : currentTeam?.id;
  const ownerType = currentTeam.executive ? "company" : "team";

  switch (step.stepType) {
    case "component":
      switch (step.componentToRender) {
        case "ConversationStarter":
          return <ConversationStarter />;
        case "PersonalGoals":
          return <PersonalGoals />;
        case "WeeklyReflection":
          return <WeeklyReflection />;
        case "Milestones":
          return <Milestones meetingType={meeting.meetingType} />;
        case "PersonalKeyActivities":
          return <PersonalKeyActivitiesWeekly />;
        case "YesterdayInReview":
          return <YesterdayInReview />;
        case "DailyPlanning":
          return <DailyPlanning />;
        case "CompleteDailyPlanning":
          return <CompleteDailyPlanning />;
        case "TeamPulse":
          return <TeamPulse meeting={meeting} />;
        case "MeetingRating":
          return <MeetingRating />;
        case "KeyActivities":
          return <TeamKeyActivities />;
        case "Goals":
          return <MeetingGoals />;
        case "Issues":
          return <TeamIssues />;
        case "Recap":
          return <Recap />;
        case "ParkingLot":
          return <ParkingLot upcomingForumMeeting={meeting} />;
        case "MonthlyReflection":
          return <MonthlyReflection />;
        case "Exploration":
          return <Exploration />;
        case "KPI":
          return <KpiComponent />;
        case "WeeklyMilestones":
          return <WeeklyMilestones  />;
        case "Scorecard":
          return <ScorecardsIndex miniEmbed={true} ownerType={ownerType} ownerId={ownerId} />;
        default:
          return <Text>This custom component has not been configured</Text>;
      }
    case "image":
      return <ImageStep step={step} />;
    case "embedded_link":
      //the embedded link will override itself based on the team's override key setting
      return <EmbedStep linkEmbed={step.linkEmbed} />;
    case "description_text":
      return <TextStep step={step} />;
    default:
      return <Text>This meeting step type has not been configured</Text>;
  }
};

export const MeetingStep = observer(
  ({ meeting }: IMeetingStepProps): JSX.Element => {
    if (R.isNil(meeting) || R.isNil(meeting.currentStepDetails)) {
      return <Loading />;
    }
    return (
      <BodyContainer>
        <StepComponentContainer>
          {StepComponent(meeting.currentStepDetails, meeting)}
        </StepComponentContainer>
      </BodyContainer>
    );
  },
);

const BodyContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
`;

const StepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;
