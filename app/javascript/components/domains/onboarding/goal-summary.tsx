import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

import { parseAnnualInitiative } from "./annual-initiative-parser";

import { AnnualInitiativeCard } from "~/components/domains/goals/annual-initiative/annual-initiative-card";
import { QuarterlyGoalCard } from "~/components/domains/goals/quarterly-goal/quarterly-goal-card";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { TextDiv } from "~/components/shared";

interface IGoalSummaryProps {
  formData: any;
}

export const GoalSummary = ({ formData }: IGoalSummaryProps): JSX.Element => {
  const annualInitiative = R.path(["annualInitiative"], formData);
  const annualInitiativeFormatted = parseAnnualInitiative(annualInitiative);
  const rallyingCry = R.pathOr("", ["rallyingCry"], formData);
  const quarterlyGoal = R.path(["quarterlyGoals", "0"], annualInitiativeFormatted);
  const milestone = R.path(["milestones", "0"], quarterlyGoal);
  return (
    <Container>
      {!R.isNil(rallyingCry) && (
        <SectionContainer>
          <RallyingCryContainer>
            <TextDiv fontSize={"22px"} color={"primary100"} mr={"8px"}>
              Lynchpyn Goal™
            </TextDiv>
            <WrappedTextDiv fontSize={"16px"} color={"black"} ml={"auto"} mr={"auto"}>
              {rallyingCry}
            </WrappedTextDiv>
          </RallyingCryContainer>
        </SectionContainer>
      )}
      {!R.isNil(annualInitiative) && (
        <SectionContainer>
          <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"}>
            Annual Objective
          </TextDiv>
          <AnnualInitiativeContainer>
            <AnnualInitiativeCard
              index={0}
              annualInitiative={annualInitiativeFormatted}
              totalNumberOfAnnualInitiatives={1}
              showMinimizedCards={true}
              showCreateQuarterlyGoal={false}
              onboarding
            />
          </AnnualInitiativeContainer>
        </SectionContainer>
      )}
      {!R.isNil(quarterlyGoal) && (
        <SectionContainer>
          <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"}>
            Quarterly Initiative
          </TextDiv>
          <QuarterlyGoalCardContainer>
            <QuarterlyGoalCard
              quarterlyGoal={quarterlyGoal}
              annualInitiativeDescription={R.pathOr("", ["description"], annualInitiative)}
            />
          </QuarterlyGoalCardContainer>
        </SectionContainer>
      )}
      {!R.isNil(milestone) && (
        <SectionContainer>
          <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"}>
            Weekly Milestone
          </TextDiv>
          <MilestoneCard milestone={milestone} editable={false} itemType={"quarterlyGoal"} />
        </SectionContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 80%;
  height: 100%;
  margin-right: 24px;
`;

const SectionContainer = styled.div<SpaceProps>`
  ${space}
  height: 140px;
  width: 100%;
  margin-bottom: 24px;
`;

const RallyingCryContainer = styled.div`
  height: 64px;
  width: -webkit-fill-available;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 16px 0 16px;
`;

const AnnualInitiativeContainer = styled.div`
  padding-bottom: 24px;
`;

const QuarterlyGoalCardContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 6px #00000029;
`;

const WrappedTextDiv = styled(TextDiv)`
  overflow-wrap: anywhere;
`;
