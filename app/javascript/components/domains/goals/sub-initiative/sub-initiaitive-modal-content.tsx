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
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
}

export const SubInitiativeModalContent = observer(
  ({
    subInitiativeId,
    setSubInitiativeModalOpen,
    annualInitiativeDescription,
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
    const [showInitiatives, setShowInitiatives] = useState<boolean>(true);

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

    const goalYearString = `FY${subInitiative.fiscalYear.toString().slice(-2)}/${(
      subInitiative.fiscalYear + 1
    )
      .toString()
      .slice(-2)}`;

    return (
      <>
        <StatusBlockColorIndicator
          milestones={subInitiative.milestones || []}
          indicatorWidth={"80px"}
          indicatorHeight={4}
          marginBottom={0}
        />
        <Container>
          <SubInitiativeBodyContainer>
            <SectionContainer>
              <InitiativeHeader
                itemType={"subInitiative"}
                item={subInitiative}
                editable={editable}
                setAnnualInitiativeId={setAnnualInitiativeId}
                setModalOpen={setSubInitiativeModalOpen}
                setAnnualInitiativeModalOpen={setSubInitiativeModalOpen}
                annualInitiativeId={subInitiative.annualInitiativeId}
                annualInitiativeDescription={annualInitiativeDescription}
                showDropdownOptionsContainer={showDropdownOptionsContainer}
                setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
                goalYearString={goalYearString}
              />
            </SectionContainer>
            <SectionContainer>
              <Context
                setShowInitiatives={setShowInitiatives}
                itemType={"subInitiative"}
                item={subInitiative}
              />
            </SectionContainer>
            {showInitiatives ? (
              <SectionContainer>
                <MilestonesHeaderContainer>
                  <ShowMilestonesButton
                    setShowInactiveMilestones={setShowInactiveMilestones}
                    showInactiveMilestones={showInactiveMilestones}
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
            ) : (
              <></>
            )}
          </SubInitiativeBodyContainer>
        </Container>
      </>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 30px;
  overflow: auto;
  padding-left: auto;
  padding-right: auto;
`;

const SubInitiativeBodyContainer = styled.div``;

const SectionContainer = styled.div``;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;
