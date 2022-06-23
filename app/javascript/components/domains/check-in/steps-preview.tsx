import React, { useState } from "react";
import styled from "styled-components";
import { HabitsBody } from "../habits";
import { HomeKeyActivities } from "../home/home-key-activities/home-key-activities";
import { IssuesBody } from "../issues/issues-body";
import { ConversationStarter } from "../meetings/components/conversation-starter";
import { DailyPlanning } from "../meetings/components/daily-planning";
import { Milestones } from "../meetings/components/milestones";
import { PersonalGoals } from "../meetings/components/personal-goals";
import { PersonalKeyActivitiesWeekly } from "../meetings/components/personal-key-activities-weekly";
import { WeeklyReflection } from "../meetings/components/weekly-reflection";
import { CheckinReflection } from "./components/check-in-reflection";
import { KpiComponent } from "./components/kpi";
import { NumericalStep } from "./components/numerical-step";
import { OpenEndedPreview } from "./components/open-ended-preview";
import { SelectionScale } from "./components/selection-scale";
import { WeeklyKeyResults } from "./components/weekly-key-results";
import { WeeklyMilestones } from "./components/weekly-milestones";
import { WeeklyReview } from "./components/weekly-review";
import { YesNoPreview } from "./components/yes-no-preview";
import { OutstandingTodos } from "./outstanding-todos";
import { SelectedStepType } from "./steps-selector-page";
import { QuestionnaireTypeConstants } from "../../../constants/questionnaire-types";
import { MobileKeyActivitiesBody } from "../key-activities/mobile-key-activities-body";
import { MobileTodosInitiatives } from "./components/mobile-todos-initiatives";

interface StepsPreviewProps {
  step: SelectedStepType;
}

export const StepsPreview = ({ step }: StepsPreviewProps): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  const renderComponent = () => {
    switch (step?.name) {
      case "Open-ended":
        return (
          <Container>
            <OpenEndedPreview question={step.question} />
          </Container>
        );
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
              <OverflowContainer>
                <DesktopContainer>
                  <Milestones showWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileTodosInitiatives />
                </MobileContainer>
              </OverflowContainer>
            );
          case "Weekly List + Milestones":
            return (
              <OverflowContainer>
                <DesktopContainer>
                  <Milestones showWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileTodosInitiatives />
                </MobileContainer>
              </OverflowContainer>
            );
          case "Weekly List + Master List":
            return (
              <OverflowContainer>
                <DesktopContainer>
                  <PersonalKeyActivitiesWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileKeyActivitiesBody WeeklyMaster={true} />
                </MobileContainer>
              </OverflowContainer>
            );
          case "Today's Priorities + Weekly List":
            return (
              <OverflowContainer>
                <DesktopContainer>
                  <DailyPlanning hideListSelector={true} />
                </DesktopContainer>
                <MobileContainer>
                  <MobileKeyActivitiesBody TodayWeekly={true} />
                </MobileContainer>
              </OverflowContainer>
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
      case "KPIs":
        return (
          <Container>
            <KpiComponent />;
          </Container>
        );
      case "Habits":
        return (
          <Container>
            <HabitsBody />;
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
      default:
        return <></>;
    }
  };
  return <>{renderComponent()}</>;
};

const Container = styled.div`
  margin-right: 1px;
`;

const OverflowContainer = styled.div`
  margin-right: 1px;
  overflow: auto;
  overscroll-behavior: contain;
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
