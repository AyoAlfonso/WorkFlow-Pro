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
import { SubInitiativeModalContent } from "../goals/sub-initiative/sub-initiaitive-modal-content";
import { observer } from "mobx-react";
import { TitleContainer } from "../goals/shared/title-container";
import { RallyingCry } from "../goals/shared/rallying-cry";
import { PersonalVision } from "../goals/shared/personal-vision";

export const HomeGoals = observer(
  (): JSX.Element => {
    const { goalStore } = useMst();

    const [loading, setLoading] = useState<boolean>(true);
    const [annualInitiativeModalOpen, setAnnualInitiativeModalOpen] = useState<boolean>(false);
    const [annualInitiativeId, setAnnualInitiativeId] = useState<number>(null);
    const [quarterlyGoalModalOpen, setQuarterlyGoalModalOpen] = useState<boolean>(null);
    const [quarterlyGoalId, setQuarterlyGoalId] = useState<number>(null);
    const [subInitiativeModalOpen, setSubInitiativeModalOpen] = useState<boolean>(null);
    const [subInitiativeId, setSubInitiativeId] = useState<number>(null);

    const [annualInitiativeDescription, setSelectedAnnualInitiativeDescription] = useState<string>(
      "",
    );
    const [companyGoalsFilter, setCompanyGoalsFilter] = useState<string>("all");
    const [personalGoalsFilter, setPersonalGoalsFilter] = useState<string>("all");

    const [companyPlanning, setCompanyPlanning] = useState<boolean>(false);
    const [personalPlanning, setPersonalPlanning] = useState<boolean>(false);

    const [showCompanyInitiatives, setShowCompanyInitiatives] = useState<boolean>(true);
    const [showPersonalInitiatives, setShowPersonalInitiatives] = useState<boolean>(true);


    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
    }, []);

    if (loading || R.isNil(goalStore.companyGoals)) {
      return <Loading />;
    }

    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;

    const toggleCompanyPlanning = () => {
      if (companyPlanning) {
        setCompanyPlanning(false);
      } else {
        setPersonalPlanning(false);
        setCompanyPlanning(true);
      }
    };

    const togglePersonalPlanning = () => {
      if (personalPlanning) {
        setPersonalPlanning(false);
      } else {
        setCompanyPlanning(false);
        setPersonalPlanning(true);
      }
    };

    const companyGoalsToShow = () => {
      switch (companyGoalsFilter) {
        case "all":
          return companyGoals.goals;
        case "me":
          return companyGoals.myAnnualInitiatives;
        case "closed":
          return companyGoals.closedAnnualInitiatives;
        default:
          return companyGoals;
      }
    };

    const personalGoalsToShow = () => {
      switch (personalGoalsFilter) {
        case "all":
          return personalGoals.goals;
        case "closed":
          return personalGoals.closedAnnualInitiatives;
        default:
          return personalGoals;
      }
    };

    const renderAnnualInitiatives = (annualInitiatives, type): JSX.Element => {
      return annualInitiatives.map((annualInitiative, index) => {
        return (
          <AnnualInitiativeCard
            key={index}
            index={index}
            annualInitiative={annualInitiative}
            totalNumberOfAnnualInitiatives={annualInitiatives.length}
            showMinimizedCards={true}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            setQuarterlyGoalId={setQuarterlyGoalId}
            // setSubInitiativeId={setSubInitiativeId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            showCreateQuarterlyGoal={false}
          />
        );
      });
    };

    return (
      <Container>
        <CompanyInitiativesContainer>
          <TitleContainer
            goalsFilter={companyGoalsFilter}
            setGoalsFilter={setCompanyGoalsFilter}
            largeHomeTitle={true}
            title={"Company"}
            handleToggleChange={toggleCompanyPlanning}
            toggleChecked={companyPlanning}
            showInitiatives={showCompanyInitiatives}
            setShowInitiatives={setShowCompanyInitiatives}
          />

          <RallyingCry rallyingCry={companyGoals.rallyingCry} />

          <InitiativesContainer>
            {renderAnnualInitiatives(companyGoalsToShow(), "company")}
          </InitiativesContainer>
        </CompanyInitiativesContainer>

        <PersonalVisionContainer>
          <TitleContainer
            goalsFilter={personalGoalsFilter}
            setGoalsFilter={setPersonalGoalsFilter}
            largeHomeTitle={true}
            title={"Personal"}
            handleToggleChange={togglePersonalPlanning}
            toggleChecked={personalPlanning}
            showInitiatives={showPersonalInitiatives}
            setShowInitiatives={setShowPersonalInitiatives}
          />
          <PersonalVision personalVision={personalGoals.personalVision} />
          <InitiativesContainer>
            {renderAnnualInitiatives(personalGoalsToShow(), "personal")}
          </InitiativesContainer>
        </PersonalVisionContainer>

        <StyledModal
          isOpen={annualInitiativeModalOpen}
          style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
          onBackgroundClick={e => {
            setAnnualInitiativeModalOpen(false);
          }}
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
          onBackgroundClick={e => {
            setQuarterlyGoalModalOpen(false);
          }}
        >
          <QuarterlyGoalModalContent
            quarterlyGoalId={quarterlyGoalId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            annualInitiativeDescription={annualInitiativeDescription}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            showCreateMilestones={false}
            setSubInitiativeId={setSubInitiativeId}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
          />
        </StyledModal>

          <StyledModal
          isOpen={subInitiativeModalOpen}
          style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
          onBackgroundClick={e => {
            setSubInitiativeModalOpen(false);
          }}
        >
          <SubInitiativeModalContent
            subInitiativeId={subInitiativeId}
            setAnnualInitiativeId={setAnnualInitiativeId}
            annualInitiativeDescription={annualInitiativeDescription}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            showCreateMilestones={false}
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
  display: -webkit-box;
  margin-top: 15px;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 15px;
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

const CompanyInitiativesContainer = styled.div``;
