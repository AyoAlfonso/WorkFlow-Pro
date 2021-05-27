import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { UserIconBorder } from "../shared/user-icon-border";
import { Avatar } from "~/components/shared/avatar";
import * as R from "ramda";
import { baseTheme } from "../../../../themes";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { RecordOptions } from "../shared/record-options";
import { OwnedBySection } from "../shared/owned-by-section";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import moment from "moment";

interface IQuarterlyGoalCardProps {
  quarterlyGoal: QuarterlyGoalType;
  annualInitiativeYear: number;
  setQuarterlyGoalModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId?: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  annualInitiativeDescription: string;
  goalCardType?: string;
}

export const QuarterlyGoalCard = (props: IQuarterlyGoalCardProps): JSX.Element => {
  const {
    quarterlyGoal,
    annualInitiativeYear,
    setQuarterlyGoalModalOpen,
    setQuarterlyGoalId,
    setSelectedAnnualInitiativeDescription,
    annualInitiativeDescription,
    goalCardType
  } = props;

  const { companyStore } = useMst();
  const { currentFiscalYear, currentFiscalQuarter } = companyStore.company
  const {
    warningRed,
    fadedRed,
    cautionYellow,
    fadedYellow,
    finePine,
    fadedGreen,
    grey40,
    grey20,
    grey80,
    grey100,
    white,
    primary100,
  } = baseTheme.colors;
  const defaultOptionsColor = white;
  const [showOptions, setShowOptions] = useState<string>(defaultOptionsColor);

  //TODOIST: Come back to make this code dry and icon color constant
  let currentMilestone;
  let statusBadge = {
    description: '', colors: {
      backgroundColor: '',
      color: ''
    }
  };

  if (quarterlyGoal.closedAt != null) {
    statusBadge.description = `Closed`
    statusBadge.colors = { color: white, backgroundColor: grey100 }
  }
  else if (currentFiscalYear*10 + currentFiscalQuarter < annualInitiativeYear*10 + quarterlyGoal.quarter) {
    statusBadge.description = `Upcoming`
    statusBadge.colors = { color: white, backgroundColor: primary100 }
  }
  else {
    if (!currentMilestone) {
      currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
    }

    if (currentMilestone && currentMilestone.status) {
      switch (currentMilestone.status) {
        case "completed":
          statusBadge.description = "On Track"
          statusBadge.colors = { color: finePine, backgroundColor: fadedGreen }
          break;
        case "in_progress":
          statusBadge.description = "Needs Attention"
          statusBadge.colors = { color: cautionYellow, backgroundColor: fadedYellow }
          break;
        case "incomplete":
          statusBadge.description = "Behind"
          statusBadge.colors = { color: warningRed, backgroundColor: fadedRed }
          break;
        case "unstarted":
          statusBadge.description = "No update"
          statusBadge.colors = { color: grey40, backgroundColor: grey20 }
          break;
      }
    }
  }

  const startedMilestones = quarterlyGoal.milestones
    ? quarterlyGoal.milestones.filter(milestone => milestone.status != "unstarted")
    : [];

  let userIconBorder = "";

  if (startedMilestones.length > 0) {
    const lastStartedMilestone = startedMilestones[startedMilestones.length - 1];
    userIconBorder = UserIconBorder(lastStartedMilestone.status);
  }

  const openQuarterlyGoalModal = () => {
    setQuarterlyGoalModalOpen(true);
    setQuarterlyGoalId(quarterlyGoal.id);
    setSelectedAnnualInitiativeDescription(annualInitiativeDescription);
  };

  const renderQuarterDisplay = () => {
    const quarter =
      quarterlyGoal.quarter || companyStore.onboardingCompany.quarterForCreatingQuarterlyGoals;
    return (
      <QuarterText> Q{quarter}: </QuarterText>
    );
  };

  return (
    <>
      <Container
        goalCardType={goalCardType}
        onClick={e => {
          e.stopPropagation();
          openQuarterlyGoalModal();
        }}
        onMouseEnter={e => {
          setShowOptions(grey80)
        }}
        onMouseLeave={e => {
          setShowOptions(defaultOptionsColor)
        }}
      >
        <StatusBlockColorIndicator milestones={quarterlyGoal.milestones || []} indicatorWidth={14} indicatorHeight={2} marginTop={4}/>

        <RowContainer
          mt={0}
          mb={0}
        >
          <DescriptionContainer>
            {goalCardType == "child" && (<StyledSubInitiativeIcon icon={"Sub_initiative"} size={"16px"} iconColor={"#868DAA"} />)}
            {goalCardType == "parent" && (renderQuarterDisplay())}
            <StyledText>{quarterlyGoal.description}</StyledText>
          </DescriptionContainer>

          <IconContainer>
            <RecordOptions
              type={"quarterlyGoal"}
              id={quarterlyGoal.id}
              iconColor={showOptions}
            />
          </IconContainer>
        </RowContainer>
        <RowContainer
          mt={0}
          mb={0}
        >
          {/* // TODOIST: refactor the values of this component to get only */}
          {quarterlyGoal.ownedBy && (
            <OwnedBySection
              ownedBy={quarterlyGoal.ownedBy}
              type={"quarterlyGoal"}
              disabled={true}
              size={16}
              nameWidth={"60%"}
              marginLeft={"16px"}
              marginRight={"0px"}
              marginTop={"auto"}
              fontSize={"9px"}
              marginBottom={"auto"}
            />
          )}
          <BadgeContainer>
            {quarterlyGoal.subInitiatives.length > 0 && (
              <>
                <MilestoneCountContainer>
                  {quarterlyGoal.subInitiatives.length}
                </MilestoneCountContainer>
                <StyledSubInitiativeIcon icon={"Sub_initiative"} size={"16px"} iconColor={"#868DAA"} />
              </>
            )}
            <StatusBadge
              color={statusBadge.colors.color}
              backgroundColor={statusBadge.colors.backgroundColor}
            > {statusBadge.description} </StatusBadge>
          </BadgeContainer>
        </RowContainer>
      </Container>
    </>
  );
};

type RowContainerProps = {
  mb?: number;
  mt?: number
};

const RowContainer = styled.div<RowContainerProps>`
  display: flex;
  margin-top: ${props => `${props.mt}%` || 'auto'};
  margin-bottom: ${props => `${props.mb}%` || 'auto'};
`;


const StyledText = styled(Text)`
  padding-left: 4px;
  padding-right: 4px;
  white-space: normal;
  font-size: 14px;
  width: 160px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

type ContainerProps = {
  goalCardType?: string;
}

const Container = styled.div<ContainerProps>`
  background-color: ${props => (props.goalCardType == "child" ? `${props.theme.colors.backgroundGrey}` : 'inherit')};
  &:hover {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
`;

const QuarterContainer = styled.div`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 8px;
`;

const QuarterText = styled(Text)`
  font-size: 14px;
  font-weight: 700
`;

const DescriptionContainer = styled.div`
  overflow-wrap: anywhere;
  display:flex;
  font-size: 12px;
  padding-left: 16px;
`;

const StyledSubInitiativeIcon = styled(Icon)`
  margin-right: 5px;
  font-size: 12px;
`;

type StatusBadgeType = {
  color: string;
  backgroundColor: string;
}

// TODOIST: Update the color constant 
const StatusBadge = styled.div<StatusBadgeType>`
    font-size: 11px;
    line-height: 12px;
    background-color:${props => props.backgroundColor};
    color: ${props => props.color};
    padding: 2px;
    text-align: center;
    border-radius: 2px;
`;

const BadgeContainer = styled.div`
  display:flex;
  justify-content: flex-end;
  margin-right: 16px;
  align-items: center; 
`;

const MilestoneCountContainer = styled.div`
  font-size: 9px;
  color: #868DAA;
  margin-right: 5px;
`;
