import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { CreateGoalSection } from "../shared/create-goal-section";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { QuarterlyGoalCard } from "../quarterly-goal/quarterly-goal-card";
import { observer } from "mobx-react";

interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  showCreateQuarterlyGoal: boolean;
  showEditButton?: boolean;
}

export const AnnualInitiativeCardExpanded = observer(
  (props: IAnnualInitiativeCardExpandedProps): JSX.Element => {
    const {
      annualInitiative,
      setShowMinimizedCard,
      setQuarterlyGoalId,
      setQuarterlyGoalModalOpen,
      setSelectedAnnualInitiativeDescription,
      showCreateQuarterlyGoal,
      showEditButton,
    } = props;

    const { quarterlyGoalStore, companyStore } = useMst();
    const [createQuarterlyGoalArea, setCreateQuarterlyGoalArea] = useState<boolean>(false);

    const { t } = useTranslation();

    const renderQuarterlyGoals = () => {
      return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
        return (
          <QuarterlyGoalCard
            key={index}
            quarterlyGoal={quarterlyGoal}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setQuarterlyGoalId={setQuarterlyGoalId}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            annualInitiativeDescription={annualInitiative.description}
          />
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
          <CreateGoalContainer>
            <CreateGoalSection
              placeholder={t("quarterlyGoal.enterTitle")}
              addButtonText={`${t("quarterlyGoal.add")} (Q${
                companyStore.company.quarterForCreatingQuarterlyGoals
              })`}
              createButtonText={t("quarterlyGoal.addGoal")}
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

    return (
      <Container>
        <QuarterlyGoalsText>{t("quarterlyGoal.title")}</QuarterlyGoalsText>
        {renderQuarterlyGoals()}
        {showCreateQuarterlyGoal && renderCreateGoal()}
        <MinimizeIconContainer onClick={() => setShowMinimizedCard(true)}>
          <Icon icon={"Chevron-Up"} size={"15px"} iconColor={"grey60"} />
        </MinimizeIconContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px;
`;

const QuarterlyGoalsText = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.greyActive};
  padding-bottom: 8px;
  margin-left: 5px;
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
  &: hover {
    cursor: pointer;
  }
`;

const CreateGoalContainer = styled.div`
  margin-bottom: 16px;
  margin-right: 8px;
`;
