import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { UserIconBorder } from "../shared/user-icon-border";
import { Avatar } from "~/components/shared/avatar";
import * as R from "ramda";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { RecordOptions } from "../shared/record-options";

interface IQuarterlyGoalCardProps {
  quarterlyGoal: QuarterlyGoalType;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  annualInitiativeDescription: string;
}

export const QuarterlyGoalCard = (props: IQuarterlyGoalCardProps): JSX.Element => {
  const {
    quarterlyGoal,
    setQuarterlyGoalModalOpen,
    setQuarterlyGoalId,
    setSelectedAnnualInitiativeDescription,
    annualInitiativeDescription,
  } = props;

  const startedMilestones = quarterlyGoal.milestones.filter(
    milestone => milestone.status != "unstarted",
  );

  let userIconBorder = "";

  if (startedMilestones.length > 0) {
    const lastStartedMilestone = startedMilestones[startedMilestones.length - 1];
    userIconBorder = UserIconBorder(lastStartedMilestone.status);
  }

  const openQuarterlyGoalModal = () => {
    setQuarterlyGoalModalOpen(true);
    setQuarterlyGoalId(quarterlyGoal.id);
    setSelectedAnnualInitiativeDescription(annualInitiativeDescription);
  };

  return (
    <Container>
      <StatusBlockColorIndicator milestones={quarterlyGoal.milestones} indicatorWidth={25} />

      <RowContainer>
        <StyledText onClick={() => openQuarterlyGoalModal()}>
          {quarterlyGoal.description}
        </StyledText>
        <IconContainer>
          <RecordOptions quarterlyGoalId={quarterlyGoal.id} />
        </IconContainer>
      </RowContainer>
      <RowContainer onClick={() => openQuarterlyGoalModal()}>
        <IconContainer>
          <Avatar
            avatarUrl={R.path(["ownedBy", "avatarUrl"], quarterlyGoal)}
            firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
            lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
            size={40}
            border={userIconBorder}
          />
        </IconContainer>
      </RowContainer>
    </Container>
  );
};

const RowContainer = styled.div`
  display: flex;
`;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
  white-space: normal;
`;

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
`;
