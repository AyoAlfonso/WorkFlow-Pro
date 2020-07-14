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
}

export const AnnualInitiativeCard = ({
  annualInitiative,
  index,
  totalNumberOfAnnualInitiatives,
  showMinimizedCards,
  setAnnualInitiativeId,
  setAnnualInitiativeModalOpen,
}: IAnnualInitiativeCardProps): JSX.Element => {
  const [showMinimizedCard, setShowMinimizedCard] = useState<boolean>(showMinimizedCards);

  useEffect(() => {
    setShowMinimizedCard(showMinimizedCards);
  }, [showMinimizedCards]);

  return (
    <Container
      key={index}
      margin-right={index + 1 == totalNumberOfAnnualInitiatives ? "0px" : "15px"}
      onClick={() => {
        setAnnualInitiativeModalOpen(true);
        setAnnualInitiativeId(annualInitiative.id);
      }}
    >
      <DescriptionContainer>
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
        />
      )}
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  height: 100px;
  width: 20%;
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
