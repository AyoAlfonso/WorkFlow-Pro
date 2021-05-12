import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
// import { CreateGoalSection } from "../shared/create-goal-section";
import { HomeContainerBorders } from "../../home/shared-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { SubInitiativeGoalCard } from "./sub-intiative-goal-card";
import { observer } from "mobx-react";
import { ISubInitiativeCardExpandedProps } from "~/types/sub-initiative-cards";


export const SubInitiativeCardsExpanded = observer(
  (props: ISubInitiativeCardExpandedProps): JSX.Element => {
    const {
      annualInitiative,
      setSubInitiativeId,
      selectedSubInitiativeCards,
      setSubInitiativeModalOpen,
      setSelectedAnnualInitiativeDescription,
    } = props;

    const { quarterlyGoalStore, companyStore, sessionStore } = useMst();
    const [createQuarterlyGoalArea, setCreateQuarterlyGoalArea] = useState<boolean>(false);
  
    const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;

    const { t } = useTranslation();
  
    const renderSubInitiativeQuarterlyGoals = () => {
      return annualInitiative.quarterlyGoals[selectedSubInitiativeCards].subInitiatives.map((subInitiative, index) => {
        return (
          <>
          <LineContainer>
            <svg height="16" width="2">
              <line x1="1" y1="4" x2="1" y2="16" />
            </svg>
          </LineContainer>
          <InitiativesContainer>
            <SubInitiativeGoalCard
              key={index}
              subInitiative={subInitiative}
              setSubInitiativeModalOpen={setSubInitiativeModalOpen}           
              setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
              // annualInitiativeDescription={annualInitiative.description}
              setSubInitiativeId={setSubInitiativeId}
            />
          </InitiativesContainer>
          </>
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

const LineContainer = styled.div<ContainerProps>`
  z-index: -1;
  width: ${props => (props.onboarding ? "-webkit-fill-available" : "calc(20% - 16px)")};
  min-width: 240px;
  display: flex;
  justify-content: center;
  line {
    stroke: ${props => props.theme.colors.grey20};
    stroke-width: 2;
  }
  margin: 0 0 0 0;
`

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
  background-color: ${props => props.theme.colors.backgroundGrey};
  min-width: 240px;
  display: flex;
  border-radius: 8px;
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
  color: #005ffe;
  font-size: 12px;
  font-weight: bold;
`;

// const CreateGoalContainer = styled.div`
//   margin-bottom: 16px;
//   margin-right: 4px;
//   margin-left: 4px
// `;
