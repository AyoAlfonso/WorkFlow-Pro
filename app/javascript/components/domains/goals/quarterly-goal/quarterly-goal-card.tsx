import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { UserIconBorder } from "../shared/user-icon-border";
import { Avatar } from "~/components/shared/avatar";
import * as R from "ramda";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { RecordOptions } from "../shared/record-options";
import { useMst } from "~/setup/root";

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

  const { companyStore } = useMst();

  console.log("qg", quarterlyGoal);
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

  const renderQuarterDisplay = () => {
    if (companyStore.company.currentFiscalQuarter != quarterlyGoal.quarter) {
      return (
        <QuarterContainer>
          <QuarterText> Q{quarterlyGoal.quarter} Goal </QuarterText>
        </QuarterContainer>
      );
    }
  };

  return (
    <Container>
      <StatusBlockColorIndicator milestones={quarterlyGoal.milestones} indicatorWidth={25} />

      <RowContainer>
        <StyledText onClick={() => openQuarterlyGoalModal()}>
          {quarterlyGoal.description}
        </StyledText>
        <IconContainer>
          <RecordOptions type={"quarterlyGoal"} id={quarterlyGoal.id} />
        </IconContainer>
      </RowContainer>
      <RowContainer onClick={() => openQuarterlyGoalModal()}>
        {renderQuarterDisplay()}
        <IconContainer>
          <Avatar
            avatarUrl={R.path(["ownedBy", "avatarUrl"], quarterlyGoal)}
            defaultAvatarColor={R.path(["ownedBy", "defaultAvatarColor"], quarterlyGoal)}
            firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
            lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
            size={36}
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
  margin-right: 8px;
  display: flex;
`;

const QuarterContainer = styled.div`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 8px;
`;

const QuarterText = styled(Text)`
  color: white;
  margin-top: 8px;
  margin-bottom: 8px;
`;
