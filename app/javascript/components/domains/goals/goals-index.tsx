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
import { GoalsCoreFour } from "./goals-core-four";
import { LynchPynBadge } from "../meetings-forum/components/lynchpyn-badge"
import { SubInitiativeModalContent } from "./sub-initiative/sub-initiaitive-modal-content";

export const GoalsIndex = observer(
  (): JSX.Element => {
    const { goalStore, annualInitiativeStore, companyStore, sessionStore } = useMst();

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
    const [showCreateCompanyAnnualInitiative, setShowCreateCompanyAnnualInitiative] = useState<
      boolean
    >(false);
    const [showCreatePersonalAnnualInitiative, setShowCreatePersonalAnnualInitiative] = useState<
      boolean
    >(false);

    const [companyGoalsFilter, setCompanyGoalsFilter] = useState<string>("all");
    const [personalGoalsFilter, setPersonalGoalsFilter] = useState<string>("all");

    const [companyPlanning, setCompanyPlanning] = useState<boolean>(false);
    const [personalPlanning, setPersonalPlanning] = useState<boolean>(false);

    const [showCompanyInitiatives, setShowCompanyInitiatives] = useState<boolean>(true);
    const [showPersonalInitiatives, setShowPersonalInitiatives] = useState<boolean>(true);

    const { t } = useTranslation();
    const instanceType = companyStore.company.accessForum ? "forum" : "teams";

    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
    }, []);

    if (loading || R.isNil(goalStore.companyGoals) || !companyStore.company) {
      return <Loading />;
    }

    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;

    const annualInitiativeTitle = sessionStore.annualInitiativeTitle;

    const toggleCompanyPlanning = () => {
      if (companyPlanning) {
        setCompanyPlanning(false);
        setShowPersonalInitiatives(true);
      } else {
        setPersonalPlanning(false);
        setShowCompanyInitiatives(true);
        setShowPersonalInitiatives(false);
        setCompanyPlanning(true);
      }
    };

    const togglePersonalPlanning = () => {
      if (personalPlanning) {
        setPersonalPlanning(false);
        setShowCompanyInitiatives(true);
      } else {
        setCompanyPlanning(false);
        setShowCompanyInitiatives(false);
        setShowPersonalInitiatives(true);
        setPersonalPlanning(true);
      }
    };

    const companyGoalsToShow = () => {
      switch (companyGoalsFilter) {
        case "all":
          return companyGoals.activeAnnualInitiatives;
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
          return personalGoals.activeAnnualInitiatives;
        case "closed":
          return personalGoals.closedAnnualInitiatives;
        default:
          return personalGoals;
      }
    };

    const renderCreateCompanyAnnualInitiativeSection = (type): JSX.Element => {
      const showCreateAnnualInitiative =
        type == "company" ? showCreateCompanyAnnualInitiative : showCreatePersonalAnnualInitiative;
      const setShowCreateAnnualInitiative =
        type == "company"
          ? setShowCreateCompanyAnnualInitiative
          : setShowCreatePersonalAnnualInitiative;

      const createGoalYearString =
        companyStore.company.currentFiscalYear ==
        companyStore.company.yearForCreatingAnnualInitiatives
          ? `FY${companyStore.company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`
          : `FY${companyStore.company.currentFiscalYear
              .toString()
              .slice(-2)}/${companyStore.company.yearForCreatingAnnualInitiatives
              .toString()
              .slice(-2)}`;

      return (
        <CreateGoalSection
          type={type}
          placeholder={t("annualInitiative.enterTitle", { title: annualInitiativeTitle })}
          addButtonText={`${t("annualInitiative.add", {
            title: annualInitiativeTitle,
          })} (${createGoalYearString})`}
          createButtonText={t("annualInitiative.addInitiative", { title: annualInitiativeTitle })}
          showCreateGoal={showCreateAnnualInitiative}
          setShowCreateGoal={setShowCreateAnnualInitiative}
          createAction={annualInitiativeStore.create}
        />
      );
    };

    const renderAnnualInitiatives = (annualInitiatives, type): JSX.Element => {
      const showEditButton = type == "company" ? companyPlanning : personalPlanning;
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
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            showCreateQuarterlyGoal={true}
            showEditButton={showEditButton}
          />
        );
      });
    };

    return (
      <Container>
        <GoalsCoreFour />

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

          {showCompanyInitiatives && (
            <>
              <RallyingCry rallyingCry={companyGoals.rallyingCry} />

              <InitiativesContainer>
                {renderAnnualInitiatives(companyGoalsToShow(), "company")}
                {companyPlanning && (
                  <CreateAnnualInitiativeContainer
                    marginLeft={R.length(companyGoalsToShow()) > 0 ? "15px" : "0px"}
                  >
                    {renderCreateCompanyAnnualInitiativeSection("company")}
                  </CreateAnnualInitiativeContainer>
                )}
              </InitiativesContainer>
            </>
          )}
        </CompanyInitiativesContainer>

        <PersonalInitiativesContainer>
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

          {showPersonalInitiatives && (
            <>
              <PersonalVision personalVision={personalGoals.personalVision} />
              <InitiativesContainer>
                {renderAnnualInitiatives(personalGoalsToShow(), "personal")}
                {personalPlanning && (
                  <CreateAnnualInitiativeContainer
                    marginLeft={R.length(personalGoalsToShow()) > 0 ? "15px" : "0px"}
                  >
                    {renderCreateCompanyAnnualInitiativeSection("personal")}
                  </CreateAnnualInitiativeContainer>
                )}
              </InitiativesContainer>
            </>
          )}
        </PersonalInitiativesContainer>

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
            showCreateMilestones={true}
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
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            annualInitiativeDescription={annualInitiativeDescription}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            showCreateMilestones={true}
          />
        </StyledModal>
        {instanceType === "forum" && (
          <LynchPynBadge/> )}
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

const PersonalInitiativesContainer = styled.div`
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

const CompanyInitiativesContainer = styled.div``;
