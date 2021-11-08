import * as React from "react";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled, { css } from "styled-components";
import { Text } from "../../../shared/text";
import { AnnualInitiativeCardMinimized } from "./annual-initiative-card-minimized";
import { AnnualInitiativeCardExpanded } from "./annual-initiative-card-expanded";
import { RecordOptions } from "../shared/record-options";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";

interface IAnnualInitiativeCardProps {
  annualInitiative: any;
  index: number;
  totalNumberOfAnnualInitiatives?: any;
  showMinimizedCards: boolean;
  showSubInitiativeCards?: boolean;
  setAnnualInitiativeId?: React.Dispatch<React.SetStateAction<number>>;
  setAnnualInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId?: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  showCreateQuarterlyGoal: boolean;
  onboarding?: boolean;
  showEditButton?: boolean;
  setSubInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubInitiativeId?: React.Dispatch<React.SetStateAction<number>>;
}

export const AnnualInitiativeCard = observer(
  ({
    annualInitiative,
    index,
    setSubInitiativeModalOpen,
    setSubInitiativeId,
    showMinimizedCards,
    showSubInitiativeCards,
    setAnnualInitiativeId,
    setAnnualInitiativeModalOpen,
    setQuarterlyGoalId,
    setQuarterlyGoalModalOpen,
    setSelectedAnnualInitiativeDescription,
    showCreateQuarterlyGoal,
    onboarding,
    showEditButton = true,
  }: IAnnualInitiativeCardProps): JSX.Element => {
    const { white, grey60 } = baseTheme.colors;
    const [showMinimizedCard, setShowMinimizedCard] = useState<boolean>(showMinimizedCards);
    const [showSubInitiativeCard, setShowSubInitiativeCards] = useState<boolean>(
      showSubInitiativeCards,
    );
    const [selectedSubInitiativeCards, setSelectSubInitiativeCard] = useState<number>();
    const [showOptions, setShowOptions] = useState<string>(white);

    const { companyStore } = useMst();

    useEffect(() => {
      setShowMinimizedCard(showMinimizedCards);
    }, [showMinimizedCards]);

    useEffect(() => {
      setShowSubInitiativeCards(showSubInitiativeCards);
    }, [showSubInitiativeCards]);

    const goalYearString = onboarding
      ? `${companyStore.onboardingCompany.currentFiscalYear}`
      : companyStore.company.currentFiscalYear == annualInitiative.fiscalYear
      ? `FY${annualInitiative.fiscalYear.toString().slice(-2)}`
      : `FY${(annualInitiative.fiscalYear + 1)
          .toString()
          .slice(-2)}/${annualInitiative.fiscalYear.toString().slice(-2)}`;

    const renderYearDisplay = () => {
      if (onboarding) {
        return (
          <YearContainer color={baseTheme.colors.primary100}>
            <YearText> {goalYearString} Goal </YearText>
          </YearContainer>
        );
      } else if (
        companyStore.company.currentFiscalYear != annualInitiative.fiscalYear &&
        annualInitiative.fiscalYear
      ) {
        const containerColor =
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
    const marginRight = "8px";
    const marginLeft = index == 0 ? "0px" : "8px";

    return (
      <ColumnContainer onboarding={onboarding} marginRight={marginRight} marginLeft={marginLeft}>
        <Container
          key={index}
          onboarding={onboarding}
          onClick={e => {
            e.stopPropagation();
            setAnnualInitiativeModalOpen(true);
            setAnnualInitiativeId(annualInitiative.id);
          }}
          onMouseEnter={e => {
            setShowOptions(grey60);
          }}
          onMouseLeave={e => {
            setShowOptions(white);
          }}
        >
          <HeaderContainer>
            <DescriptionContainer onboarding={onboarding}>
              <StyledText
                closedInitiative={annualInitiative.closedInitiative}
                onboarding={onboarding}
              >
                {annualInitiative.description}
              </StyledText>
            </DescriptionContainer>
            {!onboarding && (
              <IconContainer>
                <RecordOptions
                  type={"annualInitiative"}
                  id={annualInitiative.id}
                  marginLeft={"-70px"}
                  iconColor={showOptions}
                />
              </IconContainer>
            )}
          </HeaderContainer>

          <AnnualInitiativeCardMinimized
            annualInitiative={annualInitiative}
            setShowMinimizedCard={setShowMinimizedCard}
            disableOpen={onboarding}
            showMinimizedCard={showMinimizedCard}
          />
        </Container>
        {/* <YearDisplayContainer>{renderYearDisplay()}</YearDisplayContainer> */}

        {!showMinimizedCard ? (
          <AnnualInitiativeCardExpanded
            annualInitiative={annualInitiative}
            setShowSubInitiativeCards={setShowSubInitiativeCards}
            showSubInitiativeCards={showSubInitiativeCard}
            setSelectSubInitiativeCard={setSelectSubInitiativeCard}
            selectedSubInitiativeCards={selectedSubInitiativeCards}
            setQuarterlyGoalId={setQuarterlyGoalId}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            setSubInitiativeId={setSubInitiativeId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            showCreateQuarterlyGoal={showCreateQuarterlyGoal}
            showEditButton={showEditButton}
            marginLeft={marginLeft}
          />
        ) : null}
      </ColumnContainer>
    );
  },
);

type ContainerProps = {
  onboarding: boolean;
};

// Avoid repetition and pass min-height as a prop
const Container = styled(HomeContainerBorders)<ContainerProps>`
  width: 100%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  height: ${props => (props.onboarding ? "-webkit-fill-available" : "160px")};
  &: hover {
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

type ColumnContainerProps = {
  onboarding: boolean;
  marginRight: string;
  marginLeft: string;
};

const ColumnContainer = styled.div<ColumnContainerProps>`
  ${props => (props.onboarding ? "" : "flex: 0 1 calc(20% - 16px);")}
  width: ${props => (props.onboarding ? "100%" : "calc(20% - 16px)")};
  ${props =>
    props.onboarding
      ? ""
      : `padding-right: 8px;
  padding-left: 8px;`}
  min-width: 240px;
`;

type DescriptionContainerProps = {
  onboarding: boolean;
};

const DescriptionContainer = styled.div<DescriptionContainerProps>`
  width: 100%;
  overflow-wrap: anywhere;
  ${props => (props.onboarding ? "" : "height: 32px;")}
`;

type StyledTextProps = {
  closedInitiative: boolean;
  onboarding: boolean;
};

const StyledText = styled(Text)<StyledTextProps>`
  padding-left: 16px;
  white-space: ${props => (props.onboarding ? "nowrap" : "normal")};
  font-weight: 1000;
  font-size: 16px;
  min-width: 190px;
  width: 95%;
  ${props =>
    !props.onboarding
      ? `
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  `
      : `
  text-overflow: ellipsis;
  `}
  overflow: hidden;
  color: ${props =>
    props.closedInitiative ? props.theme.colors.greyActive : props.theme.colors.black};
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
    font-weight: bold;
    text-decoration: underline;
  }
`;
// TODOIT: Add the color in hover state above to constants

const IconContainer = styled.div`
  margin-top: 16px;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
  opacity: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-grow: 1;
  ${IconContainer}:hover & {
    fill: rebeccapurple;
  }
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
