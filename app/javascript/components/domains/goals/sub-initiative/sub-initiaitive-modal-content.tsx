import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Loading } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import { MilestoneCreateButton } from "../shared-quarterly-goal-and-sub-initiative/milestone-create-button";
import { WeeklyMilestones } from "../shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { InitiativeHeader } from "../shared-quarterly-goal-and-sub-initiative/initiative-header";
import { ShowMilestonesButton } from "../shared-quarterly-goal-and-sub-initiative/show-milestones-button";

interface ISubInitiativeModalContentProps {
  subInitiativeId: number;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
}

export const SubInitiativeModalContent = observer(
  ({
    subInitiativeId,
    setSubInitiativeModalOpen,
    annualInitiativeDescription,
    setAnnualInitiativeModalOpen,
    setAnnualInitiativeId,
    showCreateMilestones,
  }: ISubInitiativeModalContentProps): JSX.Element => {
    const { subInitiativeStore, sessionStore } = useMst();
    const currentUser = sessionStore.profile;
    const [subInitiative, setSubInitiative] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );

    useEffect(() => {
      subInitiativeStore.getSubInitiative(subInitiativeId).then(() => {
        setSubInitiative(subInitiativeStore.subInitiative);
      });
    }, []);

    if (subInitiative == null) {
      return <Loading />;
    }

    const editable =
      currentUser.id == subInitiative.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

    const allMilestones = subInitiative.milestones;
    const activeMilestones = subInitiative.activeMilestones;

    return (
      <Container>
        <StatusBlockColorIndicator
          milestones={subInitiative.milestones || []}
          indicatorWidth={80}
          indicatorHeight={4}
           marginBottom={0}
        />

        <SubInitiativeBodyContainer>
          <SectionContainer>
          <InitiativeHeader
            itemType={"subInitiative"}
            item={subInitiative}
            editable={editable}
            setAnnualInitiativeId={setAnnualInitiativeId}
            setModalOpen={setSubInitiativeModalOpen}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            annualInitiativeId={subInitiative.annualInitiativeId}
            annualInitiativeDescription={annualInitiativeDescription}
            showDropdownOptionsContainer={showDropdownOptionsContainer}
            setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
          />
          </SectionContainer>
          <SectionContainer>
            <Context itemType={"subInitiative"} item={subInitiative} />
          </SectionContainer>
          <SectionContainer>
            <MilestonesHeaderContainer>
              <ShowMilestonesButton
                setShowInactiveMilestones={setShowInactiveMilestones}
                showInactiveMilestones={showInactiveMilestones}
                allMilestones={allMilestones}
                activeMilestones={activeMilestones}
              />
            </MilestonesHeaderContainer>

            <WeeklyMilestones
              editable={editable}
              allMilestones={allMilestones}
              activeMilestones={activeMilestones}
              showInactiveMilestones={showInactiveMilestones}
              itemType={"subInitiative"}
            />
            {showCreateMilestones && editable && allMilestones.length == 0 && (
              <MilestoneCreateButton itemType={"subInitiative"} item={subInitiative} />
            )}
          </SectionContainer>
        </SubInitiativeBodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  overflow: auto;
  padding-left: auto;
  padding-right: auto;
`;

const SubInitiativeBodyContainer = styled.div`
  padding-top: 16px;
`;

const SectionContainer = styled.div`
  padding-bottom: 36px;
  padding-left: 20px;
  padding-right: 20px;
`;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;
