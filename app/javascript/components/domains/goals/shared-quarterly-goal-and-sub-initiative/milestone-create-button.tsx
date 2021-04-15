import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { useMst } from "~/setup/root";

interface IMilestoneCreateButtonProps {
  itemType: string;
  item: any;
}

export const MilestoneCreateButton = ({
  itemType,
  item,
}: IMilestoneCreateButtonProps): JSX.Element => {
  const { quarterlyGoalStore, subInitiativeStore } = useMst();

  return (
    <StyledButton
      small
      variant={"grey"}
      onClick={() => {
        if (itemType == "quarterlyGoal") {
          quarterlyGoalStore.createMilestones(item.id);
        } else if (itemType == "subInitiative") {
          subInitiativeStore.createMilestones(item.id);
        }
      }}
    >
      <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
      <AddMilestoneText> Add Weekly Milestones </AddMilestoneText>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddMilestoneText = styled.p`
  margin-left: 16px;
`;
