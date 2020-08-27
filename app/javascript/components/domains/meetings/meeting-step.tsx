import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "../home/shared-components";
import { Heading } from "~/components/shared/heading";
import { Button } from "~/components/shared/button";
import { ConversationStarter } from "./components/conversation-starter";
import { PersonalGoals } from "./components/personal-goals";
import { DailyPlanning } from "./components/daily-planning";
import { Milestones } from "./components/milestones";
import { PersonalKeyActivities } from "./components/personal-key-activities";
import { WeeklyReflection } from "./components/weekly-reflection";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { IMeeting } from "~/models/meeting";
import { IStep } from "~/models/step";
import meetingTypes from "~/constants/meeting-types";
import { Loading } from "~/components/shared/loading";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { TeamPulse } from "./components/team-pulse";

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
        default:
          return <Text>This custom component has not been configured</Text>;
      }
      break;
    case "image":
      return <ImageStep step={step} />;
      break;
    case "embedded_link":
      return <EmbedStep step={step} />;
      break;
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
            <HomeTitle>{meeting.currentStepDetails.name}</HomeTitle>
            <Text fontSize={1}>{meeting.currentStepDetails.instructions}</Text>
          </LeftContainerBorder>
        </LeftContainer>
        <RightContainer>{StepComponent(meeting.currentStepDetails)}</RightContainer>
      </BodyContainer>
    );
  },
);

const LeftContainerBorder = styled(HomeContainerBorders)`
  padding: 10px;
`;

const BodyContainer = styled.div`
  display: flex;
`;

const LeftContainer = styled.div`
  width: 20%;
  margin-right: 10px;
  min-width: 320px;
`;

const RightContainer = styled.div`
  width: 80%;
  min-width: 320p;
  margin-left: 10px;
`;
