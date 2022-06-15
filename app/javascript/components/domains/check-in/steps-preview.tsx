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
    switch (step?.stepType) {
      case "Open-ended":
        return <OpenEndedPreview question={step.question} />;
      case "Numeric":
        return <NumericalStep question={step.question} />;
      case "Sentiment":
        return <SelectionScale question={step.question} type="sentiment" />;
      case "Agreement Scale":
        return <SelectionScale question={step.question} />;
      case "Yes/No":
        return <YesNoPreview question={step.question} />;
      case "ToDos":
        switch (step.variant) {
          case "Today's Priorities":
            return <HomeKeyActivities todayOnly={true} width={"100%"} />;
          case "Weekly List":
            return <HomeKeyActivities weeklyOnly={true} width={"100%"} />;
          case "Weekly List + Key Results":
            return (
              <>
                <DesktopContainer>
                  <Milestones showWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileTodosInitiatives />
                </MobileContainer>
              </>
            );
          case "Weekly List + Milestones":
            return (
              <>
                <DesktopContainer>
                  <Milestones showWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileTodosInitiatives />
                </MobileContainer>
              </>
            );
          case "Weekly List + Master List":
            return (
              <>
                <DesktopContainer>
                  <PersonalKeyActivitiesWeekly />
                </DesktopContainer>
                <MobileContainer>
                  <MobileKeyActivitiesBody WeeklyMaster={true} />
                </MobileContainer>
              </>
            );
          case "Today's Priorities + Weekly List":
            return (
              <>
                <DesktopContainer>
                  <DailyPlanning hideListSelector={true} />
                </DesktopContainer>
                <MobileContainer>
                  <MobileKeyActivitiesBody TodayWeekly={true} />
                </MobileContainer>
              </>
            );
          case "Outstanding ToDos":
            return <OutstandingTodos />;
          default:
            return <></>;
        }
      case "Initiatives":
        switch (step.variant) {
          case "Key Results":
            return <WeeklyKeyResults />;
          case "Milestones":
            return <WeeklyMilestones />;
          default:
            return <></>;
        }
      case "Objectives":
        return <PersonalGoals />;
      case "Issues":
        return (
          <IssuesBody
            showOpenIssues={showOpenIssues}
            setShowOpenIssues={setShowOpenIssues}
            noShadow
          />
        );
      case "KPIs":
        return <KpiComponent />;
      case "Habits":
        return <HabitsBody />;
      case "Conversation Starter":
        return <ConversationStarter />;
      case "Weekly Review":
        return <WeeklyReview />;
      case "Weekly Reflection":
        return <CheckinReflection variant={QuestionnaireTypeConstants.weeklyReflection} />;
      case "Monthly Reflection":
        return <CheckinReflection variant={QuestionnaireTypeConstants.monthlyReflection} />;
      case "Evening Reflection":
        return <CheckinReflection variant={QuestionnaireTypeConstants.eveningReflection} />;
      default:
        return <></>;
    }
  };
  return <Container>{renderComponent()}</Container>;
};

const Container = styled.div`
  margin-right: 1px;
  overflow: auto;
  // pointer-events: none;
  // width: 100%;
  // overflow-x: auto;
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
