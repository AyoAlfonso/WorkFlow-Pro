import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { UserDefaultIcon } from "../../../shared/user-default-icon";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { AnnualInitiativeType } from "~/types/annual-initiative";

interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnnualInitiativeCardExpanded = (
  props: IAnnualInitiativeCardExpandedProps,
): JSX.Element => {
  const { annualInitiative, setShowMinimizedCard } = props;

  const renderStatusBlocks = (quarterlyGoal: QuarterlyGoalType) => {
    return quarterlyGoal.milestones.map((milestone, index) => {
      const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;
      let backgroundColor;
      switch (milestone.status) {
        case "incomplete":
          backgroundColor = warningRed;
          break;
        case "in_progress":
          backgroundColor = cautionYellow;
          break;
        case "completed":
          backgroundColor = finePine;
          break;
        default:
          backgroundColor = grey20;
          break;
      }
      return <StatusBlock backgroundColor={backgroundColor} key={index} />;
    });
  };

  const renderQuarterlyGoals = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer key={index}>
          <StatusBlocksContainer>{renderStatusBlocks(quarterlyGoal)}</StatusBlocksContainer>

          <RowContainer>
            <StyledText> {quarterlyGoal.description} </StyledText>
            <IconContainer>
              <Icon icon={"Options"} size={"25px"} iconColor={"grey60"} />
            </IconContainer>
          </RowContainer>
          <RowContainer>
            <IconContainer>
              <UserDefaultIcon
                size={40}
                firstName={quarterlyGoal.ownedBy.firstName}
                lastName={quarterlyGoal.ownedBy.lastName}
              />
            </IconContainer>
          </RowContainer>
        </QuarterlyGoalContainer>
      );
    });
  };

  return (
    <Container>
      {renderQuarterlyGoals()}
      <MinimizeIconContainer onClick={() => setShowMinimizedCard(true)}>
        <Icon icon={"Chevron-Up"} size={"15px"} iconColor={"grey60"} />
      </MinimizeIconContainer>
    </Container>
  );
};

const RowContainer = styled.div`
  display: flex;
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px;
`;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
`;

const QuarterlyGoalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
`;

const StatusBlocksContainer = styled.div`
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
`;

type StatusBlockType = {
  backgroundColor?: string;
};

const StatusBlock = styled.div<StatusBlockType>`
  width: 25px;
  height: 5px;
  border-radius: 5px;
  margin-right: 1px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
`;

const MinimizeIconContainer = styled.div`
  background-color: white;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;
