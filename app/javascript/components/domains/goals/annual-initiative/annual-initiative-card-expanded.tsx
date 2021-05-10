import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { CreateGoalSection } from "../shared/create-goal-section";
import { HomeContainerBorders } from "../../home/shared-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { QuarterlyGoalCard } from "../quarterly-goal/quarterly-goal-card";
import { SubInitiativeCardsExpanded } from "../sub-initiative/sub-initiative-card-expanded"
import { observer } from "mobx-react";
import { IAnnualInitiativeCardExpandedProps } from "~/types/annual-initiative-cards";
// TODOIST: You should define this in another folder


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
    } = props;

    const { quarterlyGoalStore, companyStore, sessionStore } = useMst();
    const [createQuarterlyGoalArea, setCreateQuarterlyGoalArea] = useState<boolean>(false);

    const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;

    const { t } = useTranslation();

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
             {quarterlyGoal.subInitiatives.length > 0 &&
              (<MinimizeIconContainer
                  onClick={e => {
                    (showSubInitiativeCards && selectedSubInitiativeCards !== index) ?
                      setShowSubInitiativeCards(showSubInitiativeCards):
                        setShowSubInitiativeCards(!showSubInitiativeCards)
                    setSelectSubInitiativeCard(index)
                  }}
                >
                <Icon
                  icon={showRender ?  "Chevron-Up" : "Chevron-Down"}
                  size={"12px"}
                  iconColor={"#005FFE"}
                  style={{ padding: "0px 5px" }}
                />
              </MinimizeIconContainer>)}
          </InitiativesContainer>
          <SubInitiativeContainer
             display={showRender? 'block' : 'none'}
          >
           <SubInitiativeCardsExpanded
              annualInitiative={annualInitiative}
              // quarterlyGoals={annualInitiative.quarterlyGoals}
              // showSubInitiativeCards={showSubInitiativeCards}
              selectedSubInitiativeCards={index}
              setQuarterlyGoalId={setQuarterlyGoalId}
              setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
              setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
              showCreateQuarterlyGoal={showCreateQuarterlyGoal}
              showEditButton={showEditButton}
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
        {/* <QuarterlyGoalsText>
          {t("quarterlyGoal.title", { title: quarterlyGoalTitle })}
        </QuarterlyGoalsText> */}
        {renderQuarterlyGoals()}
        {showCreateQuarterlyGoal && renderCreateGoal()}
        
      </Container>
    );
  },
);

const Container = styled.div`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: calc(20% - 16px);
  min-width: 220px;
`;

type SubInitiativeContainerProps = {
  display?: string;
 
};


const SubInitiativeContainer =  styled.div<SubInitiativeContainerProps>`
  display: ${props => props.display};
  transition: "all 0.4s ease-in";
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

type ContainerProps = {
  onboarding?: boolean;
  marginRight?: string;
};

const InitiativesContainer  = styled(HomeContainerBorders)<ContainerProps>`
  width: ${props => (props.onboarding ? "-webkit-fill-available" : "calc(20% - 16px)")};
  min-width: 240px;
  display: flex;
  margin-top:5%;
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

const CreateGoalContainer = styled.div`
  margin-bottom: 16px;
  margin-right: 8px;
`;
