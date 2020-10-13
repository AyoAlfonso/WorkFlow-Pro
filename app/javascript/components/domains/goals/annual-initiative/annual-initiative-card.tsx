import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { AnnualInitiativeCardMinimized } from "./annual-initiative-card-minimized";
import { AnnualInitiativeCardExpanded } from "./annual-initiative-card-expanded";
import { useState, useEffect } from "react";
import { RecordOptions } from "../shared/record-options";
import { useMst } from "~/setup/root";

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

  const { companyStore } = useMst();

  useEffect(() => {
    setShowMinimizedCard(showMinimizedCards);
  }, [showMinimizedCards]);

  const renderYearDisplay = () => {
    if (companyStore.company.currentFiscalYear != annualInitiative.fiscalYear) {
      return (
        <YearContainer>
          <YearText> {annualInitiative.fiscalYear} Goal </YearText>
        </YearContainer>
      );
    }
  };

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

      <YearDisplayContainer>{renderYearDisplay()}</YearDisplayContainer>

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

const YearContainer = styled.div`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-left: 8px;
`;

const YearText = styled(Text)`
  color: white;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const YearDisplayContainer = styled.div`
  width: 100px;
  margin-left: 14px;
  text-align: center;
  margin-bottom: 8px;
`;
