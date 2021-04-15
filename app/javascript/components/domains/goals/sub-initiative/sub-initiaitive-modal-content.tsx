import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect, useRef } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import ContentEditable from "react-contenteditable";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Loading } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { useTranslation } from "react-i18next";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import { MilestoneCreateButton } from "../shared-quarterly-goal-and-sub-initiative/milestone-create-button";
import { WeeklyMilestones } from "../shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { InitiativeHeader } from "../shared-quarterly-goal-and-sub-initiative/initiative-header";

interface ISubInitiativeModalContentProps {
  subInitiativeId: number;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
}

export const QuarterlyGoalModalContent = observer(
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
    const [quarterlyGoal, setQuarterlyGoal] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );

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
          />
          <SectionContainer>
            <Context itemType={"quarterlyGoal"} item={quarterlyGoal} />
          </SectionContainer>
          <SectionContainer>
            <MilestonesHeaderContainer>
              <SubHeaderContainer>
                <SubHeaderText text={"Milestones"} />
              </SubHeaderContainer>
              <ShowPastWeeksContainer>
                <Button
                  small
                  variant={"primaryOutline"}
                  onClick={() => setShowInactiveMilestones(!showInactiveMilestones)}
                >
                  {showInactiveMilestones
                    ? "Show Upcoming"
                    : `Show Past Weeks (${allMilestones.length - activeMilestones.length})`}
                </Button>
              </ShowPastWeeksContainer>
            </MilestonesHeaderContainer>

            <WeeklyMilestones
              editable={editable}
              allMilestones={allMilestones}
              activeMilestones={activeMilestones}
              showInactiveMilestones={showInactiveMilestones}
            />
            {showCreateMilestones && editable && allMilestones.length == 0 && (
              <MilestoneCreateButton itemType={"quarterlyGoal"} item={quarterlyGoal} />
            )}
          </SectionContainer>
          {/* <SectionContainer>
              <SubHeaderContainer>
                <SubHeaderText text={"Comments"} />
              </SubHeaderContainer>
              <ContextContainer>PLACEHOLDER FOR COMMENTS</ContextContainer>
            </SectionContainer>
            <SectionContainer>
              <SubHeaderContainer>
                <SubHeaderText text={"Attachments"} />
              </SubHeaderContainer>
              <ContextContainer>PLACEHOLDER FOR ATTACHMENTS</ContextContainer>
            </SectionContainer> */}
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

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

const GoalText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.grey80};
`;

const UnderlinedGoalText = styled.span`
  font-weight: bold;
  text-decoration: underline;
  &: hover {
    cursor: pointer;
  }
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const InfoSectionContainer = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 90%;
`;

const ShowPastWeeksContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddMilestoneText = styled.p`
  margin-left: 16px;
`;

const DropdownOptionsContainer = styled.div`
  margin-right: 16px;
  &: hover {
    cursor: pointer;
  }
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
`;
