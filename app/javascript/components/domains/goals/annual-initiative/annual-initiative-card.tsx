import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { AnnualInitiativeCardMinimized } from "./annual-initiative-card-minimized";
import { AnnualInitiativeCardExpanded } from "./annual-initiative-card-expanded";
import { useState, useEffect } from "react";
import { RecordOptions } from "../shared/record-options";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";

interface IAnnualInitiativeCardProps {
  annualInitiative: any;
  index: number;
  totalNumberOfAnnualInitiatives: number;
  showMinimizedCards: boolean;
  setAnnualInitiativeId?: React.Dispatch<React.SetStateAction<number>>;
  setAnnualInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId?: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  showCreateQuarterlyGoal: boolean;
  onboarding?: boolean;
  showEditButton?: boolean;
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
  onboarding,
  showEditButton = true,
}: IAnnualInitiativeCardProps): JSX.Element => {
  const [showMinimizedCard, setShowMinimizedCard] = useState<boolean>(showMinimizedCards);

  const { companyStore } = useMst();

  useEffect(() => {
    setShowMinimizedCard(showMinimizedCards);
  }, [showMinimizedCards]);

  const goalYearString = onboarding
    ? `${companyStore.onboardingCompany.currentFiscalYear}`
    : companyStore.company.currentFiscalYear == annualInitiative.fiscalYear
    ? `FY${annualInitiative.fiscalYear.toString().slice(-2)}`
    : `FY${(annualInitiative.fiscalYear + 1)
        .toString()
        .slice(-2)}/${annualInitiative.fiscalYear.toString().slice(-2)}`;

  const renderYearDisplay = () => {
    if (onboarding) {
      return null;
    } else if (
      companyStore.company.currentFiscalYear != annualInitiative.fiscalYear &&
      annualInitiative.fiscalYear
    ) {
      let containerColor =
        companyStore.company.currentFiscalYear > annualInitiative.fiscalYear
          ? baseTheme.colors.grey100
          : baseTheme.colors.primary100;
      return (
        <YearContainer color={containerColor}>
          <YearText> {goalYearString} Goal </YearText>
        </YearContainer>
      );
    }
  };

  return (
    <Container
      key={index}
      marginRight={index + 1 == totalNumberOfAnnualInitiatives ? "0px" : "15px"}
      onboarding={onboarding}
      onClick={e => {
        e.stopPropagation();
        setAnnualInitiativeModalOpen(true);
        setAnnualInitiativeId(annualInitiative.id);
      }}
    >
      <HeaderContainer>
        <DescriptionContainer>
          <StyledText closedInitiative={annualInitiative.closedInitiative}>
            {annualInitiative.description}
          </StyledText>
        </DescriptionContainer>
        <IconContainer>
          <RecordOptions type={"annualInitiative"} id={annualInitiative.id} marginLeft={"-70px"} />
        </IconContainer>
      </HeaderContainer>

      
      {/* <YearDisplayContainer>{renderYearDisplay()}</YearDisplayContainer> */}

      {showMinimizedCard ? (
        <AnnualInitiativeCardMinimized
          annualInitiative={annualInitiative}
          setShowMinimizedCard={setShowMinimizedCard}
          disableOpen={onboarding}
        />
      ) : (
        <AnnualInitiativeCardExpanded
          annualInitiative={annualInitiative}
          setShowMinimizedCard={setShowMinimizedCard}
          setQuarterlyGoalId={setQuarterlyGoalId}
          setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
          setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
          showCreateQuarterlyGoal={showCreateQuarterlyGoal}
          showEditButton={showEditButton}
        />
      )}
    </Container>
  );
};

type ContainerProps = {
  onboarding: boolean;
  marginRight: string;
};

const Container = styled(HomeContainerBorders)<ContainerProps>`
  width: ${props => (props.onboarding ? "-webkit-fill-available" : "calc(20% - 15px)")};
  min-width: 240px;
  margin-right: ${props => props.marginRight || "0px"};
  display: flex;
  flex-direction: column;
  height: 100%;
  &: hover {
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

const DescriptionContainer = styled.div`
  overflow-wrap: anywhere;
`;

type StyledTextProps = {
  closedInitiative: boolean;
};

const StyledText = styled(Text)<StyledTextProps>`
  padding-left: 16px;
  padding-right: 16px;
  white-space: normal;
  font-weight: 800;
  width: 160px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${props => props.closedInitiative && props.theme.colors.greyActive};
  &:hover {
    cursor: pointer;
    color: #34353a;
    font-weight: bold;
    text-decoration: underline;
  }
`;
// TODOIT: Add the color in hover state above to constants

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

type YearContainerProps = {
  color: string;
};

const YearContainer = styled.div<YearContainerProps>`
  background-color: ${props => props.color || props.theme.colors.primary100};
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
  width: fit-content;
  margin-left: 14px;
  text-align: center;
  margin-bottom: 8px;
`;
