import * as React from "react";
import * as R from "ramda";
import styled, { keyframes, css } from "styled-components";
import { space, SpaceProps } from "styled-system";

import { parseAnnualInitiative } from "./annual-initiative-parser";

import { AnnualInitiativeCard } from "~/components/domains/goals/annual-initiative/annual-initiative-card";
import { QuarterlyGoalCard } from "~/components/domains/goals/quarterly-goal/quarterly-goal-card";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { TextDiv } from "~/components/shared";
import { KeyElement } from "../goals/shared/key-element";

interface IGoalSummaryProps {
  formData: any;
}

export const GoalSummary = ({ formData }: IGoalSummaryProps): JSX.Element => {
  const annualInitiative = R.pathOr("", ["annualInitiative"], formData);
  const annualInitiativeFormatted = parseAnnualInitiative(annualInitiative);
  const rallyingCry = R.pathOr("", ["rallyingCry"], formData);
  const quarterlyGoal = R.pathOr("", ["quarterlyGoals", "0"], annualInitiativeFormatted);
  const keyResult = R.pathOr("", ["keyElements", "0"], quarterlyGoal);
  return (
    <Container>
      {!R.isEmpty(rallyingCry) && (
        <SectionContainer>
          <TextDiv
            fontSize={"16px"}
            color={"primary100"}
            mb={"8px"}
            fontFamily={"Lato, Exo, sans-serif"}
            fontWeight={"bold"}
          >
            LynchPyn Goal™
          </TextDiv>
          <RallyingCryContainer>
            <WrappedTextDiv fontSize={"16px"} fontWeight={"bold"} color={"black"}>
              {rallyingCry}
            </WrappedTextDiv>
          </RallyingCryContainer>
        </SectionContainer>
      )}
      {annualInitiative?.description && (
        <SectionContainer height={180}>
          <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"} fontWeight={"bold"}>
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
      {quarterlyGoal?.description && (
        <SectionContainer>
          <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"} fontWeight={"bold"}>
            Quarterly Initiative
          </TextDiv>
          <QuarterlyGoalCardContainer>
            <QuarterlyGoalCard
              quarterlyGoal={quarterlyGoal}
              annualInitiativeDescription={R.pathOr("", ["description"], annualInitiative)}
              onboarding={true}
            />
          </QuarterlyGoalCardContainer>
        </SectionContainer>
      )}
      {keyResult?.value && (
        <SectionContainer>
          <KeyResultContainer>
            <TextDiv fontSize={"16px"} color={"primary100"} mb={"8px"} fontWeight={"bold"}>
              Key Result
            </TextDiv>
            <KeyElement keyElement={keyResult} type={"onboarding"} editable={false} />
            {/* <MilestoneCard milestone={milestone} editable={false} itemType={"quarterlyGoal"} /> */}
          </KeyResultContainer>
        </SectionContainer>
      )}
    </Container>
  );
};

const fadeIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const animTiming = "800ms ease forwards";

const fadeInAnimation = css`
  animation: ${fadeIn} ${animTiming};
`;
const Container = styled.div`
  width: 80%;
  height: 100%;
  margin-right: 24px;
`;

type SectionContainerProps = {
  height?: number;
};

const SectionContainer = styled.div<SectionContainerProps>`
  ${space}
  height: ${props => props.height || 140}px;
  width: 100%;
  margin-bottom: 24px;
  ${fadeInAnimation}
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
  box-shadow: 0px 3px 6px ${props => props.theme.colors.grayShadow};
  padding-bottom: 8px;
`;

const KeyResultContainer = styled.div``;

const WrappedTextDiv = styled(TextDiv)`
  overflow-wrap: anywhere;
`;
