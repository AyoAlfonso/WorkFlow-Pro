import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "../../../shared/icon";
import { UserDefaultIcon } from "../../../shared/user-default-icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";

interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const AnnualInitiativeCardExpanded = (
  props: IAnnualInitiativeCardExpandedProps,
): JSX.Element => {
  const {
    annualInitiative,
    setShowMinimizedCard,
    setQuarterlyGoalId,
    setQuarterlyGoalModalOpen,
    setSelectedAnnualInitiativeDescription,
  } = props;

  const renderQuarterlyGoals = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer
          key={index}
          onClick={() => {
            setQuarterlyGoalModalOpen(true);
            setQuarterlyGoalId(quarterlyGoal.id);
            setSelectedAnnualInitiativeDescription(annualInitiative.description);
          }}
        >
          <StatusBlockColorIndicator milestones={quarterlyGoal.milestones} indicatorWidth={25} />

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
  &: hover {
    cursor: pointer;
  }
`;
