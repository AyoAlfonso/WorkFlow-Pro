import * as React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { Loading } from "~/components/shared/loading";
import { RallyingCry } from "../../goals/shared/rallying-cry";
import { AnnualInitiativeCard } from "../../goals/annual-initiative/annual-initiative-card";
import Modal from "styled-react-modal";
import { AnnualInitiativeModalContent } from "../../goals/annual-initiative/annual-initiative-modal-content";
import { QuarterlyGoalModalContent } from "../../goals/quarterly-goal/quarterly-goal-modal-content";

export const MeetingGoals = (): JSX.Element => {
  const { meetingStore, goalStore, companyStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  const [annualInitiativeModalOpen, setAnnualInitiativeModalOpen] = useState<boolean>(false);
  const [annualInitiativeId, setAnnualInitiativeId] = useState<number>(null);
  const [quarterlyGoalModalOpen, setQuarterlyGoalModalOpen] = useState<boolean>(null);
  const [quarterlyGoalId, setQuarterlyGoalId] = useState<number>(null);
  const [annualInitiativeDescription, setSelectedAnnualInitiativeDescription] = useState<string>(
    "",
  );
  const [subInitiativeModalOpen, setSubInitiativeModalOpen] = useState<boolean>(null);
  const [subInitiativeId, setSubInitiativeId] = useState<number>(null);

  if (!meetingStore.currentMeeting) {
    return <Loading />;
  }

  const teamId = meetingStore.currentMeeting.teamId;

  useEffect(() => {
    goalStore.getTeamGoals(teamId).then(() => {
      setLoading(false);
    });
  }, []);

  const annualInitiatives = goalStore.teamGoals;

  if (loading || !annualInitiatives) {
    return <Loading />;
  }

  const renderAnnualInitiatives = (): Array<JSX.Element> => {
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
        />
      );
    });
  };

  return (
    <Container>
      <RallyingCry rallyingCry={companyStore.company.rallyingCry} />
      <AnnualInitiativesContainer>{renderAnnualInitiatives()}</AnnualInitiativesContainer>

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
          setSubInitiativeId={setSubInitiativeId}
          setSubInitiativeModalOpen={setSubInitiativeModalOpen}
          setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
        />
      </StyledModal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -5px;
  margin-left: 15px;
`;

const AnnualInitiativesContainer = styled.div`
  display: -webkit-box;
  margin-top: 15px;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 15px;
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
`;
