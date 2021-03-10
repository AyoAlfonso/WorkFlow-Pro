import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";

import { TextDiv } from "~/components/shared";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";

interface IPynsSummaryProps {
  goalData: any;
}
//quarterly init

export const PynsSummary = ({ goalData: { annualInitiative } }: IPynsSummaryProps): JSX.Element => {
  const quarterlyGoal = R.path(["quarterlyGoals", "0"], annualInitiative);
  const milestone = R.path(["milestones", "0"], quarterlyGoal);
  return (
    <Container>
      <TextDiv fontFamily={"Exo"} fontSize={"20px"} fontWeight={600}>
        Initiatives and Weekly Milestones
      </TextDiv>
      <TextDiv fontSize={"12px"} color={"greyInactive"} my={"16px"}>
        These are your Weekly Milestones for this week
      </TextDiv>
      <TextDiv fontFamily={"Exo"} fontSize={"20px"} fontWeight={600}>
        {quarterlyGoal.description}
      </TextDiv>
      <MilestoneCard milestone={milestone} editable={false} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
