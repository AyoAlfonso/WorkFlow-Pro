import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useState, useEffect } from "react";
import { AnnualInitiativeCard } from "../goals/annual-initiative/annual-initiative-card";
import { Loading } from "../../shared/loading";
import Modal from "styled-react-modal";
import { AnnualInitiativeModalContent } from "../goals/annual-initiative/annual-initiative-modal-content";
import { QuarterlyGoalModalContent } from "../goals/quarterly-goal/quarterly-goal-modal-content";
import { observer } from "mobx-react";
import { TitleContainer } from "../goals/shared/title-container";
import { RallyingCry } from "../goals/shared/rallying-cry";
import { PersonalVision } from "../goals/shared/personal-vision";

export const HomeGoals = observer(
  (): JSX.Element => {
    const { goalStore } = useMst();

    const [showCompanyGoals, setShowCompanyGoals] = useState<boolean>(true);
    const [showMinimizedCards, setShowMinimizedCards] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [annualInitiativeModalOpen, setAnnualInitiativeModalOpen] = useState<boolean>(false);
    const [annualInitiativeId, setAnnualInitiativeId] = useState<number>(null);
    const [quarterlyGoalModalOpen, setQuarterlyGoalModalOpen] = useState<boolean>(null);
    const [quarterlyGoalId, setQuarterlyGoalId] = useState<number>(null);
    const [annualInitiativeDescription, setSelectedAnnualInitiativeDescription] = useState<string>(
      "",
    );

    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
    }, []);

    if (loading || R.isNil(goalStore.companyGoals)) {
      return <Loading />;
    }

    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;

    const renderAnnualInitiatives = (annualInitiatives): JSX.Element => {
      return annualInitiatives.map((annualInitiative, index) => {
        return (
          <AnnualInitiativeCard
            key={index}
            index={index}
            annualInitiative={annualInitiative}
            totalNumberOfAnnualInitiatives={annualInitiatives.length}
            showMinimizedCards={showMinimizedCards}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            setQuarterlyGoalId={setQuarterlyGoalId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
          />
        );
      });
    };

    return (
      <Container>
        <TitleContainer
          showMinimizedCards={showMinimizedCards}
          setShowMinimizedCards={setShowMinimizedCards}
          showCompanyGoals={showCompanyGoals}
          setShowCompanyGoals={setShowCompanyGoals}
        />

        <RallyingCry rallyingCry={companyGoals.rallyingCry} />

        <InitiativesContainer>
          {renderAnnualInitiatives(
            showCompanyGoals ? companyGoals.goals : companyGoals.myAnnualInitiatives,
          )}
        </InitiativesContainer>

        <PersonalVisionContainer>
          <PersonalVision personalVision={personalGoals.personalVision} />
          <InitiativesContainer>
            {renderAnnualInitiatives(personalGoals.goals)}
          </InitiativesContainer>
        </PersonalVisionContainer>

        <StyledModal
          isOpen={annualInitiativeModalOpen}
          style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
        >
          <AnnualInitiativeModalContent
            annualInitiativeId={annualInitiativeId}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            setQuarterlyGoalId={setQuarterlyGoalId}
          />
        </StyledModal>

        <StyledModal
          isOpen={quarterlyGoalModalOpen}
          style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
        >
          <QuarterlyGoalModalContent
            quarterlyGoalId={quarterlyGoalId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            annualInitiativeDescription={annualInitiativeDescription}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
          />
        </StyledModal>
      </Container>
    );
  },
);

const Container = styled.div`
  margin-top: 30px;
`;

const InitiativesContainer = styled.div`
  display: flex;
  margin-top: 15px;
`;

const PersonalVisionContainer = styled.div`
  margin-top: 20px;
  padding-top: 10px;
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
`;
