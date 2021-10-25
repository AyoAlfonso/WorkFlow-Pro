import React, { useEffect } from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { CreateGoalSection } from "../shared/create-goal-section";
import { HomeContainerBorders } from "../../home/shared-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { QuarterlyGoalCard } from "../quarterly-goal/quarterly-goal-card";
import { SubInitiativeCardsExpanded } from "../sub-initiative/sub-initiative-card-expanded";
import { observer } from "mobx-react";
import { baseTheme } from "../../../../themes";
import { IAnnualInitiativeCardExpandedProps } from "~/types/annual-initiative-cards";

export const AnnualInitiativeCardExpanded = observer(
  (props: IAnnualInitiativeCardExpandedProps): JSX.Element => {
    const {
      annualInitiative,
      setShowSubInitiativeCards,
      setSelectSubInitiativeCard,
      showSubInitiativeCards,
      selectedSubInitiativeCards,
      setQuarterlyGoalId,
      setQuarterlyGoalModalOpen,
      setSelectedAnnualInitiativeDescription,
      showCreateQuarterlyGoal,
      showEditButton,
      setSubInitiativeModalOpen,
      setSubInitiativeId,
    } = props;
    const { primary100 } = baseTheme.colors;

    const { quarterlyGoalStore, companyStore, sessionStore } = useMst();
    const [createQuarterlyGoalArea, setCreateQuarterlyGoalArea] = useState<boolean>(false);

    const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;
    const { t } = useTranslation();

    const renderEmptyState = () => {
      return annualInitiative.quarterlyGoals.length <= 0 ? (
        <EmptyStateContainer>
          <EmptyStateHeader>{t("annualInitiative.emptyHeader")}</EmptyStateHeader>
          <EmptyStateText>{t("annualInitiative.emptyText")}</EmptyStateText>
          <EmptyStateCta>{t("annualInitiative.emptyCta")}</EmptyStateCta>
        </EmptyStateContainer>
      ) : null;
    };

    const renderQuarterlyGoals = () => {
      return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
        const showRender = showSubInitiativeCards && selectedSubInitiativeCards == index;

        return (
          <>
            <InitiativesContainer>
              <QuarterlyGoalCard
                key={index}
                quarterlyGoal={quarterlyGoal}
                setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
                setQuarterlyGoalId={setQuarterlyGoalId}
                setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
                annualInitiativeDescription={annualInitiative.description}
                goalCardType={"parent"}
              />
              {quarterlyGoal.subInitiatives.length > 0 && (
                <MinimizeIconContainer
                  onClick={e => {
                    showSubInitiativeCards && selectedSubInitiativeCards !== index
                      ? setShowSubInitiativeCards(showSubInitiativeCards)
                      : setShowSubInitiativeCards(!showSubInitiativeCards);
                    setSelectSubInitiativeCard(index);
                  }}
                >
                  <Icon
                    icon={showRender ? "Chevron-Up" : "Chevron-Down"}
                    size={"12px"}
                    iconColor={primary100}
                    style={{ padding: "0px 5px" }}
                  />
                </MinimizeIconContainer>
              )}
            </InitiativesContainer>
            <SubInitiativeContainer display={showRender ? "block" : "none"}>
              <SubInitiativeCardsExpanded
                annualInitiative={annualInitiative}
                selectedSubInitiativeCards={index}
                setSubInitiativeId={setSubInitiativeId}
                setSubInitiativeModalOpen={setSubInitiativeModalOpen}
                setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
              />
            </SubInitiativeContainer>
          </>
        );
      });
    };

    const renderCreateGoal = () => {
      if (
        !(
          annualInitiative.fiscalYear == companyStore.company.currentFiscalYear &&
          companyStore.company.currentFiscalQuarter == 4 &&
          companyStore.company.quarterForCreatingQuarterlyGoals == 1
        ) &&
        showEditButton
      ) {
        return (
          <CreateGoalContainer show={createQuarterlyGoalArea}>
            <CreateGoalSection
              placeholder={t("quarterlyGoal.enterTitle", { title: quarterlyGoalTitle })}
              addButtonText={`${t("quarterlyGoal.add", { title: quarterlyGoalTitle })} (Q${
                companyStore.company.quarterForCreatingQuarterlyGoals
              })`}
              createButtonText={t("quarterlyGoal.addGoal", { title: quarterlyGoalTitle })}
              showCreateGoal={createQuarterlyGoalArea}
              setShowCreateGoal={setCreateQuarterlyGoalArea}
              createAction={quarterlyGoalStore.create}
              annualInitiativeId={annualInitiative.id}
              buttonWidth={"auto"}
              inAnnualInitiative={false}
            />
          </CreateGoalContainer>
        );
      }
    };

    return (
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {showEditButton || renderEmptyState()}
        {renderQuarterlyGoals()}
        {showCreateQuarterlyGoal && renderCreateGoal()}
      </Container>
    );
  },
);

const Container = styled.div`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

type SubInitiativeContainerProps = {
  display?: string;
};

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0px auto;
  margin-top: 20px;
  text-align: center;
  width: inherit;
  min-width: inherit;
  white-space: normal;
  p {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;
const EmptyStateHeader = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.colors.greyActive};
`;

const EmptyStateText = styled.p`
  font-size: 12px;
  min-width: 240px;
  color: ${props => props.theme.colors.greyActive};
`;

const EmptyStateCta = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary100};
`;

const SubInitiativeContainer = styled.div<SubInitiativeContainerProps>`
  display: ${props => props.display};
  transition: "all 0.4s ease-in";
  transform-style: preserve-3d;
`;

const QuarterlyGoalsText = styled.p`
  font-size: 15px;
  padding-bottom: 8px;
  margin-left: 5px;
`;

const MinimizeIconContainer = styled.div`
  background-color: inherit;
  border-radius: 50px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  &: hover {
    cursor: pointer;
  }
`;

const InitiativesContainer = styled(HomeContainerBorders)`
  display: flex;
  margin-top: 16px;
  flex-direction: column;
  min-height: 88px;
  transition: 0.3s ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;

//TODOIT: component repeated cleanup once reaching 4x
const ShowInitiativeBar = styled.div`
  margin: 15%;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
  font-weight: bold;
`;

type CreateGoalContainerProps = {
  show: boolean;
};
const CreateGoalContainer = styled.div<CreateGoalContainerProps>`
  margin-top: 16px;
  ${props => (props.show ? "" : "margin-left: 16px;")}
  margin-bottom: 16px;
`;
