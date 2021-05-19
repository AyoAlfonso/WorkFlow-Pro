import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { observer } from "mobx-react";
import { Loading, UserDefaultIcon } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import { MilestoneCreateButton } from "../shared-quarterly-goal-and-sub-initiative/milestone-create-button";
import { WeeklyMilestones } from "../shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { InitiativeHeader } from "../shared-quarterly-goal-and-sub-initiative/initiative-header";
import { ShowMilestonesButton } from "../shared-quarterly-goal-and-sub-initiative/show-milestones-button";
import * as R from "ramda";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../../home/shared-components";
import { RecordOptions } from "../shared/record-options";
import { useTranslation } from "react-i18next";
import { CreateGoalSection } from "../shared/create-goal-section";

interface IQuarterlyGoalModalContentProps {
  quarterlyGoalId: number;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
  setSubInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const QuarterlyGoalModalContent = observer(
  ({
    quarterlyGoalId,
    setQuarterlyGoalModalOpen,
    annualInitiativeDescription,
    setAnnualInitiativeModalOpen,
    setAnnualInitiativeId,
    showCreateMilestones,
    setSubInitiativeId,
    setSubInitiativeModalOpen,
    setSelectedAnnualInitiativeDescription,
  }: IQuarterlyGoalModalContentProps): JSX.Element => {
    const { quarterlyGoalStore, sessionStore, subInitiativeStore } = useMst();
    const currentUser = sessionStore.profile;
    const [quarterlyGoal, setQuarterlyGoal] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showCreateSubInitiative, setShowCreateSubInitiative] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );

    const { t } = useTranslation();

    useEffect(() => {
      quarterlyGoalStore.getQuarterlyGoal(quarterlyGoalId).then(() => {
        setQuarterlyGoal(quarterlyGoalStore.quarterlyGoal);
      });
    }, []);

    if (quarterlyGoal == null) {
      return <Loading />;
    }

    const editable =
      currentUser.id == quarterlyGoal.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

    const allMilestones = quarterlyGoal.milestones;
    const activeMilestones = quarterlyGoal.activeMilestones;

    const subInitiativeTitle = sessionStore.subInitiativeTitle;

    const renderSubInitiative = () => {
      return quarterlyGoal.subInitiatives.map((subInitiative, index) => {
        return (
          <SubInitiativeContainer key={index}>
            <StatusBlockColorIndicator
              milestones={subInitiative.milestones || []}
              indicatorWidth={80}
              marginBottom={16}
            />
            <TopRowContainer>
              <SubInitiativeDescription
                onClick={() => {
                  setQuarterlyGoalModalOpen(false);
                  setSubInitiativeId(subInitiative.id);
                  setSelectedAnnualInitiativeDescription(annualInitiativeDescription);
                  setSubInitiativeModalOpen(true);
                }}
              >
                {subInitiative.description}
              </SubInitiativeDescription>
              <SubInitiativeOptionContainer>
                <RecordOptions type={"subInitiative"} id={subInitiative.id} marginLeft={"-70px"} />
              </SubInitiativeOptionContainer>
            </TopRowContainer>
            <BottomRowContainer>
              {subInitiative.ownedBy && (
                <SubInitiativeOwnerContainer>
                  <UserDefaultIcon
                    firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
                    lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
                    defaultAvatarColor={R.path(["ownedBy", "defaultAvatarColor"], quarterlyGoal)}
                    size={40}
                  />
                </SubInitiativeOwnerContainer>
              )}
            </BottomRowContainer>
          </SubInitiativeContainer>
        );
      });
    };

    const goalYearString = `FY${quarterlyGoal.fiscalYear.toString().slice(-2)}/${(
      quarterlyGoal.fiscalYear + 1
    )
      .toString()
      .slice(-2)}`;

    return (
      <Container>
        <StatusBlockColorIndicator
          milestones={quarterlyGoal.milestones || []}
          indicatorWidth={80}
          marginBottom={16}
        />

        <QuarterlyGoalBodyContainer>
          <InitiativeHeader
            itemType={"quarterlyGoal"}
            item={quarterlyGoal}
            editable={editable}
            setAnnualInitiativeId={setAnnualInitiativeId}
            setModalOpen={setQuarterlyGoalModalOpen}
            setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
            annualInitiativeId={quarterlyGoal.annualInitiativeId}
            annualInitiativeDescription={annualInitiativeDescription}
            showDropdownOptionsContainer={showDropdownOptionsContainer}
            setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
            goalYearString={goalYearString}
          />
          <SectionContainer>
            <Context itemType={"quarterlyGoal"} item={quarterlyGoal} />
          </SectionContainer>
          <SectionContainer>
            {renderSubInitiative()}
            {editable && (
              <CreateGoalContainer>
                <CreateGoalSection
                  placeholder={t("subInitiative.enterTitle", { title: subInitiativeTitle })}
                  addButtonText={`${t("subInitiative.add", { title: subInitiativeTitle })}`}
                  createButtonText={t("subInitiative.addGoal", { title: subInitiativeTitle })}
                  showCreateGoal={showCreateSubInitiative}
                  setShowCreateGoal={setShowCreateSubInitiative}
                  createAction={subInitiativeStore.create}
                  quarterlyGoalId={quarterlyGoal.id}
                  inAnnualInitiative={true}
                />
              </CreateGoalContainer>
            )}
          </SectionContainer>
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
              itemType={"quarterlyGoal"}
            />
            {showCreateMilestones && editable && allMilestones.length == 0 && (
              <MilestoneCreateButton itemType={"quarterlyGoal"} item={quarterlyGoal} />
            )}
          </SectionContainer>
        </QuarterlyGoalBodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  overflow: auto;
  padding-left: 16px;
  padding-right: 16px;
`;

const QuarterlyGoalBodyContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 36px;
  padding-left: 20px;
  padding-right: 20px;
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;

const TopRowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SubInitiativeContainer = styled(HomeContainerBorders)`
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;
const SubInitiativeDescription = styled(Text)`
  margin-top: 0;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const SubInitiativeOptionContainer = styled.div`
  margin-left: auto;
`;

const SubInitiativeOwnerContainer = styled.div`
  margin-left: auto;
`;

const CreateGoalContainer = styled.div`
  width: 300px;
`;
