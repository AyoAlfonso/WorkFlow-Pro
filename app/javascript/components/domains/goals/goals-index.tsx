import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useState, useEffect } from "react";
import { AnnualInitiativeCard } from "./annual-initiative/annual-initiative-card";
import { Loading } from "../../shared/loading";
import Modal from "styled-react-modal";
import { AnnualInitiativeModalContent } from "./annual-initiative/annual-initiative-modal-content";
import { QuarterlyGoalModalContent } from "./quarterly-goal/quarterly-goal-modal-content";
import { observer } from "mobx-react";
import { TitleContainer } from "./shared/title-container";
import { RallyingCry } from "./shared/rallying-cry";
import { PersonalVision } from "./shared/personal-vision";
import { CreateGoalSection } from "./shared/create-goal-section";
import { useTranslation } from "react-i18next";

export const GoalsIndex = observer(
  (): JSX.Element => {
    const { goalStore, annualInitiativeStore } = useMst();

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
    const [showCreateCompanyAnnualInitiative, setShowCreateCompanyAnnualInitiative] = useState<
      boolean
    >(false);
    const [showCreatePersonalAnnualInitiative, setShowCreatePersonalAnnualInitiative] = useState<
      boolean
    >(false);

    const { t } = useTranslation();

    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
    }, []);

    if (loading || R.isNil(goalStore.companyGoals)) {
      return <Loading />;
    }

    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;
    const goalsToShow = showCompanyGoals
      ? companyGoals.goals
      : companyGoals.onlyShowMyQuarterlyGoals;

    const renderCreateCompanyAnnualInitiativeSection = (type): JSX.Element => {
      const showCreateAnnualInitiative =
        type == "company" ? showCreateCompanyAnnualInitiative : showCreatePersonalAnnualInitiative;
      const setShowCreateAnnualInitiative =
        type == "company"
          ? setShowCreateCompanyAnnualInitiative
          : setShowCreatePersonalAnnualInitiative;

      return (
        <CreateGoalSection
          type={type}
          placeholder={t("annualInitiative.enterTitle")}
          addButtonText={t("annualInitiative.add")}
          createButtonText={t("annualInitiative.addInitiative")}
          showCreateGoal={showCreateAnnualInitiative}
          setShowCreateGoal={setShowCreateAnnualInitiative}
          createAction={annualInitiativeStore.create}
        />
      );
    };

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
            showCreateQuarterlyGoal={true}
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
          largeHomeTitle={true}
        />

        <RallyingCry rallyingCry={companyGoals.rallyingCry} />

        <InitiativesContainer>
          {renderAnnualInitiatives(goalsToShow)}
          <CreateAnnualInitiativeContainer marginLeft={goalsToShow.length > 0 ? "15px" : "0px"}>
            {renderCreateCompanyAnnualInitiativeSection("company")}
          </CreateAnnualInitiativeContainer>
        </InitiativesContainer>

        <PersonalVisionContainer>
          <PersonalVision personalVision={personalGoals.personalVision} />
          <InitiativesContainer>
            {renderAnnualInitiatives(personalGoals.goals)}
            <CreateAnnualInitiativeContainer
              marginLeft={personalGoals.goals.length > 0 ? "15px" : "0px"}
            >
              {renderCreateCompanyAnnualInitiativeSection("personal")}
            </CreateAnnualInitiativeContainer>
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
            showCreateMilestones={true}
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

type CreateAnnualInitiativeContainerProps = {
  marginLeft: string;
};

const CreateAnnualInitiativeContainer = styled.div<CreateAnnualInitiativeContainerProps>`
  margin-left: ${props => props.marginLeft || "0px"};
  width: 20%;
`;
