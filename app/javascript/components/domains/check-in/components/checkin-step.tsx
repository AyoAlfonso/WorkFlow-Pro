import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { IMeeting } from "~/models/meeting";
import { IStep } from "~/models/step";
import { Loading } from "~/components/shared/loading";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { TextStep } from "~/components/domains/meetings/shared/text-step";
import { WeeklyMilestones } from "./weekly-milestones";
import { KpiComponent } from "./kpi";
import { WeeklyKeyResults } from "./weekly-key-results";
import { OpenEndedPreview } from "./open-ended-preview";
import { HabitsBody } from "../../habits";
import { HomeKeyActivities } from "../../home/home-key-activities/home-key-activities";
import { Milestones } from "../../meetings/components/milestones";
import { MobileTodosInitiatives } from "./mobile-todos-initiatives";
import { PersonalKeyActivitiesWeekly } from "../../meetings/components/personal-key-activities-weekly";
import { MobileKeyActivitiesBody } from "../../key-activities/mobile-key-activities-body";
import { DailyPlanning } from "../../meetings/components/daily-planning";
import { OutstandingTodos } from "../outstanding-todos";
import { NumericalStep } from "./numerical-step";
import { SelectionScale } from "./selection-scale";
import { YesNoPreview } from "./yes-no-preview";
import { PersonalGoals } from "../../meetings/components/personal-goals";
import { IssuesBody } from "../../issues/issues-body";
import { ConversationStarter } from "../../meetings/components/conversation-starter";
import { WeeklyReview } from "./weekly-review";
import { CheckinReflection } from "./check-in-reflection";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";

export interface ICheckinStepProps {
  checkin: any;
}

export const CheckinStep = observer(
  ({ checkin }: ICheckinStepProps): JSX.Element => {
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

    const StepComponent = (step: IStep) => {
      switch (step.stepType) {
        case "component":
          switch (step.componentToRender) {
            case "KPI":
              return <KpiComponent />;
            case "KPIs":
              return <KpiComponent />;
            case "Open-ended":
              return (
                <Container>
                  <OpenEndedPreview question={step.question} />
                </Container>
              );
            case "Habits":
              return (
                <Container>
                  <HabitsBody />;
                </Container>
              );
            case "WeeklyMilestones":
              return <WeeklyMilestones />;
            case "WeeklyKeyResults":
              return <WeeklyKeyResults />;
            case "Numeric":
              return (
                <Container>
                  <NumericalStep question={step.question} />
                </Container>
              );
            case "Sentiment":
              return (
                <Container>
                  <SelectionScale question={step.question} type="sentiment" />;
                </Container>
              );

            case "Agreement Scale":
              return (
                <Container>
                  <SelectionScale question={step.question} />;
                </Container>
              );
            case "Yes/No":
              return (
                <Container>
                  <YesNoPreview question={step.question} />;
                </Container>
              );
            case "Initiatives":
              switch (step.variant) {
                case "Key Results":
                  return (
                    <Container>
                      <WeeklyKeyResults />;
                    </Container>
                  );
                case "Milestones":
                  return (
                    <Container>
                      <WeeklyMilestones />;
                    </Container>
                  );
                default:
                  return <></>;
              }
            case "Objectives":
              return (
                <Container>
                  <PersonalGoals />;
                </Container>
              );
            case "Issues":
              return (
                <Container>
                  <IssuesBody
                    showOpenIssues={showOpenIssues}
                    setShowOpenIssues={setShowOpenIssues}
                    noShadow
                  />
                </Container>
              );
            case "Conversation Starter":
              return (
                <Container>
                  <ConversationStarter />;
                </Container>
              );
            case "Weekly Review":
              return (
                <Container>
                  <WeeklyReview />;
                </Container>
              );
            case "Weekly Reflection":
              return (
                <Container>
                  <CheckinReflection variant={QuestionnaireTypeConstants.weeklyReflection} />;
                </Container>
              );
            case "Monthly Reflection":
              return (
                <Container>
                  <CheckinReflection variant={QuestionnaireTypeConstants.monthlyReflection} />;
                </Container>
              );
            case "Evening Reflection":
              return (
                <Container>
                  <CheckinReflection variant={QuestionnaireTypeConstants.eveningReflection} />;
                </Container>
              );
            case "ToDos":
              switch (step.variant) {
                case "Today's Priorities":
                  return (
                    <Container>
                      <HomeKeyActivities todayOnly={true} width={"100%"} />;
                    </Container>
                  );
                case "Weekly List":
                  return (
                    <Container>
                      <HomeKeyActivities weeklyOnly={true} width={"100%"} />;
                    </Container>
                  );
                case "Weekly List + Key Results":
                  return (
                    <Container>
                      <DesktopContainer>
                        <Milestones showWeekly />
                      </DesktopContainer>
                      <MobileContainer>
                        <MobileTodosInitiatives />
                      </MobileContainer>
                    </Container>
                  );
                case "Weekly List + Milestones":
                  return (
                    <Container>
                      <DesktopContainer>
                        <Milestones showWeekly />
                      </DesktopContainer>
                      <MobileContainer>
                        <MobileTodosInitiatives />
                      </MobileContainer>
                    </Container>
                  );
                case "Weekly List + Master List":
                  return (
                    <Container>
                      <DesktopContainer>
                        <PersonalKeyActivitiesWeekly />
                      </DesktopContainer>
                      <MobileContainer>
                        <MobileKeyActivitiesBody WeeklyMaster={true} />
                      </MobileContainer>
                    </Container>
                  );
                case "Today's Priorities + Weekly List":
                  return (
                    <Container>
                      <DesktopContainer>
                        <DailyPlanning hideListSelector={true} />
                      </DesktopContainer>
                      <MobileContainer>
                        <MobileKeyActivitiesBody TodayWeekly={true} />
                      </MobileContainer>
                    </Container>
                  );
                case "Outstanding ToDos":
                  return (
                    <Container>
                      <OutstandingTodos />;
                    </Container>
                  );
                default:
                  return <></>;
              }
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
          return <Text>This checkin step type has not been configured</Text>;
      }
    };

    if (R.isNil(checkin) || R.isNil(checkin.currentStepDetails)) {
      return <Loading />;
    }
    return (
      <BodyContainer>
        <StepComponentContainer>{StepComponent(checkin.currentStepDetails)}</StepComponentContainer>
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
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const Container = styled.div`
  padding: 0 1em;
  margin-top: 1em;

  @media only screen and (min-width: 1600px) {
    max-width: 1024px;
  }
`;

const DesktopContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;
