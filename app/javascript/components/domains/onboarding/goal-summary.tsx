import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

import { AnnualInitiativeCard } from "~/components/domains/goals/annual-initiative/annual-initiative-card";
import { QuarterlyGoalCard } from "~/components/domains/goals/quarterly-goal/quarterly-goal-card";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { TextDiv } from "~/components/shared";

interface IGoalSummaryProps {
  formData: any;
}

export const GoalSummary = ({
  formData: { rallyingCry, annualInitiative },
}: IGoalSummaryProps): JSX.Element => {
  const quarterlyGoalLens = R.lens(R.prop("quarterlyGoals"), R.assoc("quarterlyGoals"));
  const annualInitiativeFormatted = R.pipe(
    R.ifElse(
      R.compose(R.is(Array), R.view(quarterlyGoalLens)),
      R.identity,
      R.pipe(R.prop("quarterlyGoals"), R.values, R.set(quarterlyGoalLens, R.__, annualInitiative)),
      R.assoc("fiscalYear", "2022"),
    ),
  )(annualInitiative);
  const quarterlyGoal = R.path(["quarterlyGoals", "0"], annualInitiative);
  const milestone = R.path(["milestones", "0"], quarterlyGoal);
  return (
    <Container>
      {!R.isNil(rallyingCry) && (
        <SectionContainer>
          <RallyingCryContainer>
            <TextDiv fontSize={"20px"} color={"primary100"} mr={"8px"}>
              Lynchpyn Goal
            </TextDiv>
            <TextDiv fontSize={"12px"} color={"black"}>
              {rallyingCry}
            </TextDiv>
          </RallyingCryContainer>
        </SectionContainer>
      )}
      {!R.isNil(annualInitiative) && (
        <SectionContainer>
          <TextDiv fontSize={"12px"} color={"primary100"} mb={"6px"}>
            Annual Goal
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
          <TextDiv fontSize={"12px"} color={"primary100"} mb={"6px"}>
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
          <TextDiv fontSize={"12px"} color={"primary100"} mb={"6px"}>
            Weekly Milestone
          </TextDiv>
          <MilestoneCard milestone={milestone} editable={false} />
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
  width: 100%;
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
  padding: 16px 16px 0 16px;
`;
