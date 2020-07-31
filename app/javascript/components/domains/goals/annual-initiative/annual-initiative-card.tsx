import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { AnnualInitiativeCardMinimized } from "./annual-initiative-card-minimized";
import { AnnualInitiativeCardExpanded } from "./annual-initiative-card-expanded";
import { useState, useEffect } from "react";

interface IAnnualInitiativeCardProps {
  annualInitiative: any;
  index: number;
  totalNumberOfAnnualInitiatives: number;
  showMinimizedCards: boolean;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  showCreateQuarterlyGoal: boolean;
}

export const AnnualInitiativeCard = ({
  annualInitiative,
  index,
  totalNumberOfAnnualInitiatives,
  showMinimizedCards,
  setAnnualInitiativeId,
  setAnnualInitiativeModalOpen,
  setQuarterlyGoalId,
  setQuarterlyGoalModalOpen,
  setSelectedAnnualInitiativeDescription,
  showCreateQuarterlyGoal,
}: IAnnualInitiativeCardProps): JSX.Element => {
  const [showMinimizedCard, setShowMinimizedCard] = useState<boolean>(showMinimizedCards);

  useEffect(() => {
    setShowMinimizedCard(showMinimizedCards);
  }, [showMinimizedCards]);

  return (
    <Container
      key={index}
      margin-right={index + 1 == totalNumberOfAnnualInitiatives ? "0px" : "15px"}
    >
      <DescriptionContainer
        onClick={() => {
          setAnnualInitiativeModalOpen(true);
          setAnnualInitiativeId(annualInitiative.id);
        }}
      >
        <StyledText> {annualInitiative.description} </StyledText>
      </DescriptionContainer>

      {showMinimizedCard ? (
        <AnnualInitiativeCardMinimized
          annualInitiative={annualInitiative}
          setShowMinimizedCard={setShowMinimizedCard}
        />
      ) : (
        <AnnualInitiativeCardExpanded
          annualInitiative={annualInitiative}
          setShowMinimizedCard={setShowMinimizedCard}
          setQuarterlyGoalId={setQuarterlyGoalId}
          setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
          setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
          showCreateQuarterlyGoal={showCreateQuarterlyGoal}
        />
      )}
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  height: 100px;
  width: calc(20% - 15px);
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
`;

const DescriptionContainer = styled.div`
  height: 59px;
`;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;
