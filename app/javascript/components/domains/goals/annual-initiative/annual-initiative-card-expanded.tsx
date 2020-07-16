import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "../../../shared/icon";
import { UserDefaultIcon } from "../../../shared/user-default-icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { useState } from "react";
import Modal from "styled-react-modal";
import { QuarterlyGoalModalContent } from "../quarterly-goal/quarterly-goal-modal-content";

interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnnualInitiativeCardExpanded = (
  props: IAnnualInitiativeCardExpandedProps,
): JSX.Element => {
  const { annualInitiative, setShowMinimizedCard } = props;
  const [quarterlyGoalModalOpen, setQuarterlyGoalModalOpen] = useState<boolean>(false);
  const [quarterlyGoalId, setQuarterlyGoalId] = useState<number>(null);

  const renderQuarterlyGoals = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer
          key={index}
          onClick={() => {
            setQuarterlyGoalModalOpen(true);
            setQuarterlyGoalId(quarterlyGoal.id);
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

      <StyledModal
        isOpen={quarterlyGoalModalOpen}
        style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
      >
        <QuarterlyGoalModalContent
          quarterlyGoalId={quarterlyGoalId}
          setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
        />
      </StyledModal>
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
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.white};
`;
