import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Loading } from "../../shared/loading";
import { TextDiv } from "~/components/shared";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";

interface IPynsSummaryProps {
  goalData: any;
}

export const PynsSummary = ({ goalData: { annualInitiative } }: IPynsSummaryProps): JSX.Element => {
  const quarterlyGoal = annualInitiative
    ? R.pathOr("", ["quarterlyGoals", "0"], annualInitiative)
    : "";
  const milestone = quarterlyGoal ? R.pathOr("", ["milestones", "0"], quarterlyGoal) : "";
  return (
    <Container>
      <TextDiv fontFamily={"Exo"} fontSize={"20px"} fontWeight={600}>
        Initiatives and Weekly Milestones
      </TextDiv>
      <TextDiv fontSize={"12px"} color={"greyInactive"} my={"16px"}>
        These are your Weekly Milestones for this week
      </TextDiv>
      <TextDiv fontFamily={"Exo"} fontSize={"20px"} fontWeight={600}>
        {quarterlyGoal
          ? quarterlyGoal.description
          : "You do not have quarterly initiatives created yet."}
      </TextDiv>
      {milestone && (
        <MilestoneCard milestone={milestone} editable={false} itemType={"quarterlyGoal"} />
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
