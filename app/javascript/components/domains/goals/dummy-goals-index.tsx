import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useState, useEffect } from "react";
import { DummyAnnualInitiativeCard } from "./annual-initiative/dummy-annual-initiative-card";
import { Loading } from "../../shared/loading";
import Modal from "styled-react-modal";
import { AnnualInitiativeModalContent } from "./annual-initiative/annual-initiative-modal-content";
import { QuarterlyGoalModalContent } from "./quarterly-goal/quarterly-goal-modal-content";
import { observer } from "mobx-react";
import { DummyTitleContainer } from "./shared/dummy-title-container";
import { DummyUserTitleContainer } from "./shared/dummy-title-container";
import { RallyingCry } from "./shared/rallying-cry";
import { PersonalVision } from "./shared/personal-vision";
import { CreateGoalSection } from "./shared/create-goal-section";
import { useTranslation } from "react-i18next";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { DummyGoalsCoreFour } from "./dummy-goals-core-four";
import { LynchPynBadge } from "../meetings-forum/components/lynchpyn-badge";
import { SubInitiativeModalContent } from "./sub-initiative/sub-initiaitive-modal-content";
import { sortByDate } from "~/utils/sorting";
import { Icon } from "~/components/shared/icon";
import { IconContainerWithPadding } from "~/components/shared/icon";

export const DummyGoalsIndex = observer(
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

    const [companyGoalsFilter, setCompanyGoalsFilter] = useState<string>("open");
    const [personalGoalsFilter, setPersonalGoalsFilter] = useState<string>("open");

    const [companyPlanning, setCompanyPlanning] = useState<boolean>(false);
    const [personalPlanning, setPersonalPlanning] = useState<boolean>(false);

    const [showCoreFour, setShowCoreFour] = useState<boolean>(true);
    const [showCompanyInitiatives, setShowCompanyInitiatives] = useState<boolean>(true);
    const [showPersonalInitiatives, setShowPersonalInitiatives] = useState<boolean>(true);

    const { t } = useTranslation();
    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
      if (!companyStore.company) {
        companyStore.load();
      }
    }, []);

    if (loading || R.isNil(goalStore.companyGoals) || !companyStore.company) {
      return <Loading />;
    }

    const instanceType = companyStore.company.accessForum ? "forum" : "teams";
    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;
    const annualInitiativeTitle = sessionStore.annualInitiativeTitle;

    const toggleCompanyPlanning = () => {
      if (companyPlanning) {
        setCompanyPlanning(false);
        setShowPersonalInitiatives(true);
        setShowCoreFour(true);
      } else {
        setPersonalPlanning(false);
        setShowCompanyInitiatives(true);
        setShowPersonalInitiatives(false);
        setCompanyPlanning(true);
        setShowCoreFour(false);
      }
    };

    const togglePersonalPlanning = () => {
      if (personalPlanning) {
        setPersonalPlanning(false);
        setShowCompanyInitiatives(true);
        setShowCoreFour(true);
      } else {
        setCompanyPlanning(false);
        setShowCompanyInitiatives(false);
        setShowPersonalInitiatives(true);
        setPersonalPlanning(true);
        setShowCoreFour(false);
      }
    };
    const companyGoalsToShow = () => {
      switch (companyGoalsFilter) {
        case "open":
          return companyGoals.activeAnnualInitiatives.sort(sortByDate) as Array<AnnualInitiativeType>;
        case "me":
          return companyGoals.myAnnualInitiatives.sort(sortByDate);
        case "closed":
          return companyGoals.closedAnnualInitiatives.sort(sortByDate);
        default:
          return companyGoals;
      }
    };

    const personalGoalsToShow = () => {
      switch (personalGoalsFilter) {
        case "open":
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
          : `FY${(companyStore.company.currentFiscalYear - 1)
              .toString()
              .slice(-2)}/${companyStore.company.currentFiscalYear.toString().slice(-2)}`;

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
          buttonWidth={"fill"}
        />
      );
    };

    const renderAnnualInitiatives = (annualInitiatives, type): JSX.Element => {
      const showEditButton = type == "company" ? companyPlanning : personalPlanning;
      return annualInitiatives.map((annualInitiative, index) => {
        return (
          <DummyAnnualInitiativeCard
            title={"Develop, identify and retain top talent"}
            number={1}
            key={annualInitiative.id}
            index={index}
            annualInitiative={annualInitiative}
            totalNumberOfAnnualInitiatives={annualInitiatives.length}
            showMinimizedCards={true}
            showSubInitiativeCards={false}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            setAnnualInitiativeId={setAnnualInitiativeId}
            setQuarterlyGoalId={setQuarterlyGoalId}
            setQuarterlyGoalModalOpen={setQuarterlyGoalModalOpen}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            setSubInitiativeId={setSubInitiativeId}
            setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            showCreateQuarterlyGoal={true}
            showEditButton={showEditButton}
          />
        );
      });
    };

    return (
      <Overlay>
       <Wrapper>
      <Upgradetextcontainer>
        <IconWrapper>
        <Icon icon={"New-Goals"} size={160} iconColor={"#005FFE"} />
        </IconWrapper>
        <Boldtext>
          Get the information you need to drive success in your business
        </Boldtext>
        <Subtext>
          Upgrade to a higher tier to get access to Objectives
        </Subtext>
        {/* <Link to="http://go.lynchpyn.com/upgrade"> */}
        <Talktous
        // type="button"
        onClick={(e) => {
          e.preventDefault();
          window.location.href='http://go.lynchpyn.com/upgrade';
        }}>
          Talk to us
        </Talktous>
        {/* </Link> */}
      </Upgradetextcontainer>
      </Wrapper>
      <Container>
        <DummyGoalsCoreFour showCoreFour={showCoreFour} setShowCoreFour={setShowCoreFour} />

        <CompanyInitiativesContainer>
          <DummyTitleContainer
            goalsFilter={companyGoalsFilter}
            setGoalsFilter={setCompanyGoalsFilter}
            largeHomeTitle={true}
            title={companyStore.company.name}
            type={"Company"}
            handleToggleChange={toggleCompanyPlanning}
            toggleChecked={companyPlanning}
            showInitiatives={showCompanyInitiatives}
            setShowInitiatives={setShowCompanyInitiatives}
          />

          {showCompanyInitiatives && (
            <>
              <RallyingCry rallyingCry="To Accumulate $32M In Construction Project In The Pipeline" />

              <InitiativesContainer>
                {companyPlanning && (
                  <CreateAnnualInitiativeContainer>
                    {renderCreateCompanyAnnualInitiativeSection("company")}
                  </CreateAnnualInitiativeContainer>
                )}
                {renderAnnualInitiatives(companyGoalsToShow(), "company")}
              </InitiativesContainer>
            </>
          )}
        </CompanyInitiativesContainer>

        <PersonalInitiativesContainer>
          <DummyUserTitleContainer
            goalsFilter={personalGoalsFilter}
            setGoalsFilter={setPersonalGoalsFilter}
            largeHomeTitle={true}
            title={sessionStore.profile.firstName}
            handleToggleChange={togglePersonalPlanning}
            toggleChecked={personalPlanning}
            showInitiatives={showPersonalInitiatives}
            setShowInitiatives={setShowPersonalInitiatives}
          />

          {showPersonalInitiatives && (
            <>
              <PersonalVision personalVision={personalGoals.personalVision} />
              <InitiativesContainer>
                {personalPlanning && (
                  <CreateAnnualInitiativeContainer>
                    {renderCreateCompanyAnnualInitiativeSection("personal")}
                  </CreateAnnualInitiativeContainer>
                )}
                {renderAnnualInitiatives(personalGoalsToShow(), "personal")}
              </InitiativesContainer>
            </>
          )}
        </PersonalInitiativesContainer>

        <StyledModal
          isOpen={annualInitiativeModalOpen}
          style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
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
          style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
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
          style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
          onBackgroundClick={e => {
            setSubInitiativeModalOpen(false);
          }}
        >
          <SubInitiativeModalContent
            subInitiativeId={subInitiativeId}
            setSubInitiativeModalOpen={setSubInitiativeModalOpen}
            annualInitiativeDescription={annualInitiativeDescription}
            setAnnualInitiativeId={setAnnualInitiativeId}
            showCreateMilestones={true}
          />
        </StyledModal>
        {instanceType === "forum" && <LynchPynBadge />}
      </Container>
      </Overlay>
    );
  },
);

const Overlay = styled.div`
  position: relative;

`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
`;

const IconWrapper = styled.div`
  margin-top: 120px;
`;

const Boldtext = styled.div`
  font-family: exo;
  font-weight: bold;
  font-size: 36px;
  line-spacing: 48;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 32px;
  max-width: 720px;
  display: inline-block;
`;

const Subtext = styled.div`
  font-family: exo;
  font-weight: regular;
  font-size: 20px;
  line-spacing: 27;
  margin-bottom: 24px;
`;

const Talktous = styled.div`
  width: 120px;
  height: 28px;
  background: #005FFE 0% 0% no-repeat padding-box;
  border: 1px solid #005FFE;
  border-radius: 4px;
  opacity: 1;
  font-family: lato;
  font-weight: bold;
  font-size: 12px;
  color: #FFFFFF;
  display: inline-block;
  padding-top: 11px;
  line-spacing: 24;
 `;

const Container = styled.div`
  filter: blur(10px);
  position: absolute;
  opacity: 0.5;
`;

const InitiativesContainer = styled.div`
  display: -webkit-box;
  margin-top: 0px;
  padding-bottom: 0px;
  overflow-x: auto;
  //border: 1px solid black;
`;

const PersonalInitiativesContainer = styled.div`
  margin-top: 0px;
  padding-top: 0px;
  //border: 1px solid black;
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
  //border: 1px solid black;
`;

const CreateAnnualInitiativeContainer = styled.div`
  width: calc(20% - 16px);
  min-width: 240px;
  padding-left: 8px;
  padding-right: 8px;
  //border: 1px solid black;
`;

const CompanyInitiativesContainer = styled.div`
  //border: 1px solid black;
`;
