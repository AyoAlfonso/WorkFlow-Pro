import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { AnnualInitiativeCardMinimized } from "./annual-initiative-card-minimized";
import { AnnualInitiativeCardExpanded } from "./annual-initiative-card-expanded";
import { useState, useEffect } from "react";
import { RecordOptions } from "../shared/record-options";

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
      <HeaderContainer>
        <DescriptionContainer
          onClick={() => {
            setAnnualInitiativeModalOpen(true);
            setAnnualInitiativeId(annualInitiative.id);
          }}
        >
          <StyledText> {annualInitiative.description} </StyledText>
        </DescriptionContainer>
        <IconContainer>
          <RecordOptions type={"annualInitiative"} id={annualInitiative.id} marginLeft={"-70px"} />
        </IconContainer>
      </HeaderContainer>

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
  width: calc(20% - 15px);
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  display: flex;
  flex-direction: column;
  height: 100%;
  &: hover {
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

const DescriptionContainer = styled.div``;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
  white-space: normal;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

const IconContainer = styled.div`
  margin-top: 17px;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
`;
