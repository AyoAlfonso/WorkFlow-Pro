import * as React from "react";
import styled from "styled-components";
import { Button } from "~/components/shared/button";
import { SubHeaderText } from "~/components/shared";

interface IShowMilestonesButtonProps {
  setShowInactiveMilestones: React.Dispatch<React.SetStateAction<boolean>>;
  showInactiveMilestones: boolean;
  allMilestones: any;
  activeMilestones;
}

export const ShowMilestonesButton = ({
  setShowInactiveMilestones,
  showInactiveMilestones,
  allMilestones,
  activeMilestones,
}: IShowMilestonesButtonProps): JSX.Element => {
  return (
    <Container>
      <SubHeaderContainer>
        <SubHeaderText text={"Milestones"} />
      </SubHeaderContainer>
      <ShowPastWeeksContainer>
        <Button
          small
          variant={"primaryOutline"}
          onClick={() => setShowInactiveMilestones(!showInactiveMilestones)}
        >
          {showInactiveMilestones
            ? "Show Upcoming"
            : `Show Past Weeks (${allMilestones.length - activeMilestones.length})`}
        </Button>
      </ShowPastWeeksContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const ShowPastWeeksContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;
