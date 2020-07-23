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
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { TextInput } from "~/components/shared/text-input";
import { HomeContainerBorders } from "../home/shared-components";

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
    const [
      createCompanyAnnualInitaitiveDescription,
      setCreateCompanyAnnualInitiativeDescription,
    ] = useState<string>("");
    const [
      createPersonalAnnualInitaitiveDescription,
      setCreatePersonalAnnualInitiativeDescription,
    ] = useState<string>("");

    useEffect(() => {
      goalStore.load().then(() => setLoading(false));
    }, []);

    if (loading || R.isNil(goalStore.companyGoals)) {
      return <Loading />;
    }

    const companyGoals = goalStore.companyGoals;
    const personalGoals = goalStore.personalGoals;
    const goalsToShow = showCompanyGoals ? companyGoals.goals : companyGoals.myAnnualInitiatives;

    const renderCreateCompanyAnnualInitiativeSection = (type): JSX.Element => {
      const showCreateAnnualInitiative =
        type == "company" ? showCreateCompanyAnnualInitiative : showCreatePersonalAnnualInitiative;
      const setShowCreateAnnualInitiative =
        type == "company"
          ? setShowCreateCompanyAnnualInitiative
          : setShowCreatePersonalAnnualInitiative;
      const createAnnualInitaitiveDescription =
        type == "company"
          ? createCompanyAnnualInitaitiveDescription
          : createPersonalAnnualInitaitiveDescription;
      const setCreateAnnualInitiativeDescription =
        type == "company"
          ? setCreateCompanyAnnualInitiativeDescription
          : setCreatePersonalAnnualInitiativeDescription;

      return showCreateAnnualInitiative ? (
        <CreateAnnualInitiativeCardContainer>
          <TextInput
            textValue={createAnnualInitaitiveDescription}
            setTextValue={setCreateAnnualInitiativeDescription}
            placeholder={"Enter Annual Initiative Title..."}
          />
          <ActionsContainer>
            <AddInitiativeButton
              small
              variant={"primary"}
              onClick={() => {
                //annualInitiativeStore.create("personal");
              }}
            >
              <AddInitiativeText>Add Initiative</AddInitiativeText>
            </AddInitiativeButton>
          </ActionsContainer>
        </CreateAnnualInitiativeCardContainer>
      ) : (
        <StyledButton small variant={"grey"} onClick={() => setShowCreateAnnualInitiative(true)}>
          <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
          <AddGoalText>Add an Annual Initiative</AddGoalText>
        </StyledButton>
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
          />
        );
      });
    };

    return (
      <Container>
        <HeaderText> Goals </HeaderText>
        <TitleContainer
          showMinimizedCards={showMinimizedCards}
          setShowMinimizedCards={setShowMinimizedCards}
          showCompanyGoals={showCompanyGoals}
          setShowCompanyGoals={setShowCompanyGoals}
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
              <StyledButton
                small
                variant={"grey"}
                onClick={() => {
                  //annualInitiativeStore.create("personal");
                }}
              >
                <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
                <AddGoalText>Add an Annual Initiative</AddGoalText>
              </StyledButton>
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

const HeaderText = styled.p`
  font-size: 40pt;
  font-family: Exo;
  font-weight: 300;
  margin-top: 32px;
  margin-bottom: 48px;
`;

type CreateAnnualInitiativeContainerProps = {
  marginLeft: string;
};

const CreateAnnualInitiativeContainer = styled.div<CreateAnnualInitiativeContainerProps>`
  margin-left: ${props => props.marginLeft || "0px"};
  width: 20%;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 240px;
  width: -webkit-fill-available;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddGoalText = styled.p`
  margin-left: 16px;
`;

const CreateAnnualInitiativeCardContainer = styled(HomeContainerBorders)`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

const ActionsContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const AddInitiativeButton = styled(Button)`
  width: 120px;
  padding: 0;
  &: hover {
    font-weight: bold;
  }
`;
const AddInitiativeText = styled.p`
  margin: 0;
  font-size: 14px;
`;
