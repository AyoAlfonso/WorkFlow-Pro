import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { useMst } from "~/setup/root";
import { TextDiv } from "~/components/shared/text";

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
      <CircularIcon icon={"Plus"} size={"12px"} />
      <AddMilestoneText> Add Weekly Milestones </AddMilestoneText>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddMilestoneText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
`;

const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;