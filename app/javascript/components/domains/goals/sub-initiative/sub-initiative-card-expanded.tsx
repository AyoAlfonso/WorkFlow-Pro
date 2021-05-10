import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
// import { CreateGoalSection } from "../shared/create-goal-section";
import { HomeContainerBorders } from "../../home/shared-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { QuarterlyGoalCard } from "../quarterly-goal/quarterly-goal-card";
import { observer } from "mobx-react";
import { IAnnualInitiativeCardExpandedProps } from "~/types/annual-initiative-cards";

export const SubInitiativeCardsExpanded = observer(
  (props: IAnnualInitiativeCardExpandedProps): JSX.Element => {
    const {
      annualInitiative,
      // quarterlyGoals,
      selectedSubInitiativeCards,
      setQuarterlyGoalId,
      setQuarterlyGoalModalOpen,
      setSelectedAnnualInitiativeDescription,
      // showCreateQuarterlyGoal,
      showEditButton,
    } = props;

    const { quarterlyGoalStore, companyStore, sessionStore } = useMst();
    const [createQuarterlyGoalArea, setCreateQuarterlyGoalArea] = useState<boolean>(false);

    const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;

    const { t } = useTranslation();
  
    const renderSubInitiativeQuarterlyGoals = () => {
      return annualInitiative.quarterlyGoals[selectedSubInitiativeCards].subInitiatives.map((quarterlyGoal, index) => {
        return (
          <InitiativesContainer>
            <QuarterlyGoalCard
              key={index}
              quarterlyGoal={quarterlyGoal}
              setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
              setQuarterlyGoalId={setQuarterlyGoalId}
              setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
              annualInitiativeDescription={annualInitiative.description}
              goalCardType={"child"}
            />
          </InitiativesContainer>
        );
      });
    };

{/*
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
          <CreateGoalContainer>
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
              buttonWidth={"220px"}
              inAnnualInitiative={false}
            />
          </CreateGoalContainer>
        );
      }
    };
*/}
    return (
      
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
      >
       
        {renderSubInitiativeQuarterlyGoals()}
        {/* {showCreateQuarterlyGoal && renderCreateGoal()} */}
      </Container>
    );
  },
);

const Container = styled.div`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const QuarterlyGoalsText = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.greyActive};
  padding-bottom: 8px;
  margin-left: 5px;
`;

const MinimizeIconContainer = styled.div`
  border-radius: 50px;
  width: 100%;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 10px auto;
  &: hover {
    cursor: pointer;
  }
`;

type ContainerProps = {
  onboarding?: boolean;
};

//TODOIST: calc the margin left
const InitiativesContainer = styled(HomeContainerBorders)<ContainerProps>`
  width: ${props => (props.onboarding ? "-webkit-fill-available" : "calc(20% - 16px)")};
  min-width: 240px;
  display: flex;
  margin-top: 5%;
  margin-left: 2px;
  flex-direction: column;
  min-height: 88px;
  &: hover {
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

//TODOIT: component repeated cleanup once reaching 4x
const ShowInitiativeBar = styled.div`
  margin: 15%;
  color: #005ffe;
  font-size: 12px;
  font-weight: bold;
`;

// const CreateGoalContainer = styled.div`
//   margin-bottom: 16px;
//   margin-right: 4px;
//   margin-left: 4px
// `;
