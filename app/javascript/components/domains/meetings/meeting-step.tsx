import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "../home/shared-components";
import { ConversationStarter } from "./components/conversation-starter";
import { PersonalGoals } from "./components/personal-goals";
import { DailyPlanning } from "./components/daily-planning";
import { Milestones } from "./components/milestones";
import { PersonalKeyActivities } from "./components/personal-key-activities";
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
import { TeamPulse } from "./components/team-pulse";
import { TeamKeyActivities } from "./components/team-key-activities";
import { MeetingGoals } from "./components/meeting-goals";
import { TeamIssues } from "./components/team-issues";
import { MeetingSideOptions } from "./meeting-side-options";

export interface IMeetingStepProps {
  meeting: IMeeting;
}

const StepComponent = (step: IStep) => {
  if (R.isNil(step)) {
    return <Loading />;
  }

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
          return <Milestones />;
        case "PersonalKeyActivities":
          return <PersonalKeyActivities />;
        case "DailyPlanning":
          return <DailyPlanning />;
        case "TeamPulse":
          return <TeamPulse />;
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
        default:
          return <Text>This custom component has not been configured</Text>;
      }
    case "image":
      return <ImageStep step={step} />;
    case "embedded_link":
      return <EmbedStep step={step} />;
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
        <LeftContainer>
          <LeftContainerBorder>
            <AgendaHeaderContainer>
              <HomeTitle>{meeting.currentStepDetails.name}</HomeTitle>
              <Text fontSize={1}>{meeting.currentStepDetails.instructions}</Text>
            </AgendaHeaderContainer>
            <MeetingSideOptions teamId={meeting.teamId} meetingId={meeting.id} />
          </LeftContainerBorder>
        </LeftContainer>
        <RightContainer>{StepComponent(meeting.currentStepDetails)}</RightContainer>
      </BodyContainer>
    );
  },
);

const LeftContainerBorder = styled(HomeContainerBorders)`
  padding: 16px;
  min-height: 500px;
`;

const BodyContainer = styled.div`
  display: flex;
  margin-top: 50px;
`;

const LeftContainer = styled.div`
  width: 20%;
  margin-right: 10px;
  min-width: 320px;
  min-height: 500px;
`;

const RightContainer = styled.div`
  width: 80%;
  min-width: 320px;
  margin-left: 10px;
  margin-top: 5px;
`;

const AgendaHeaderContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-bottom: 10px;
`;
