import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { UserIconBorder } from "../shared/user-icon-border";
import { baseTheme } from "../../../../themes";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { RecordOptions } from "../shared/record-options";
import { OwnedBySection } from "../shared/owned-by-section";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import moment from "moment";
import { observer } from "mobx-react";

interface IQuarterlyGoalCardProps {
  quarterlyGoal: QuarterlyGoalType;
  annualInitiativeYear?: number;
  setQuarterlyGoalModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId?: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  annualInitiativeDescription: string;
  goalCardType?: string;
  onboarding?: boolean;
}

export const QuarterlyGoalCard = observer(
  ({
    quarterlyGoal,
    setQuarterlyGoalModalOpen,
    setQuarterlyGoalId,
    setSelectedAnnualInitiativeDescription,
    annualInitiativeDescription,
    goalCardType,
    onboarding = false,
  }: IQuarterlyGoalCardProps): JSX.Element => {
    const { companyStore, sessionStore } = useMst();
    const { currentFiscalYear, currentFiscalQuarter } = companyStore.company;
    const {
      warningRed,
      fadedRed,
      fadedYellow,
      finePine,
      fadedGreen,
      grey80,
      grey100,
      backgroundGrey,
      white,
      primary100,
      tango,
    } = baseTheme.colors;
    const defaultOptionsColor = white;
    const [showOptions, setShowOptions] = useState<string>(defaultOptionsColor);

    let currentMilestone;
    const statusBadge = {
      description: "",
      colors: {
        backgroundColor: "",
        color: "",
      },
    };

    currentMilestone = quarterlyGoal.milestones.find(milestone =>
      moment(milestone.weekOf).isSame(moment(), "week"),
    );

    if (quarterlyGoal.closedAt != null) {
      statusBadge.description = `Closed - Q${quarterlyGoal.quarter}`;
      statusBadge.colors = { color: white, backgroundColor: grey100 };
    } else if (currentFiscalYear < quarterlyGoal.quarter) {
      statusBadge.description = `Upcoming - Q${quarterlyGoal.quarter}`;
      statusBadge.colors = { color: white, backgroundColor: primary100 };
    } else {
      if (!currentMilestone) {
        currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
      }

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "completed":
            statusBadge.description = "On Track";
            statusBadge.colors = { color: finePine, backgroundColor: fadedGreen };
            break;
          case "in_progress":
            statusBadge.description = "Needs Attention";
            statusBadge.colors = { color: tango, backgroundColor: fadedYellow };
            break;
          case "incomplete":
            statusBadge.description = "Behind";
            statusBadge.colors = { color: warningRed, backgroundColor: fadedRed };
            break;
          case "unstarted":
            statusBadge.description = "No update";
            statusBadge.colors = { color: grey100, backgroundColor: backgroundGrey };
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
      if (companyStore.company.currentFiscalQuarter != quarterlyGoal.quarter) {
        const quarter =
          quarterlyGoal.quarter || companyStore.onboardingCompany.quarterForCreatingQuarterlyGoals;
        return <QuarterText> Q{quarter}: </QuarterText>;
      }
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
            setShowOptions(grey80);
          }}
          onMouseLeave={e => {
            setShowOptions(defaultOptionsColor);
          }}
        >
          {onboarding || (
            <StatusBlockColorIndicator
              milestones={quarterlyGoal.milestones || []}
              indicatorWidth={"100%"}
              indicatorHeight={2}
              marginTop={4}
            />
          )}

          <RowContainer mt={0} mb={0}>
            <DescriptionContainer>
              {goalCardType == "child" && (
                <StyledSubInitiativeIcon
                  icon={"Sub_initiative"}
                  size={"16px"}
                  iconColor={grey100}
                />
              )}
              <StyledText>{quarterlyGoal.description}</StyledText>
            </DescriptionContainer>

            {!onboarding && (
              <IconContainer>
                <RecordOptions
                  type={"quarterlyGoal"}
                  id={quarterlyGoal.id}
                  iconColor={showOptions}
                />
              </IconContainer>
            )}
          </RowContainer>
          <RowContainer mt={0} mb={0}>
            {/* // TODOIST: refactor the values of this component to get only */}
            {(quarterlyGoal.ownedBy || sessionStore.profile) && (
              <OwnedBySection
                ownedBy={quarterlyGoal.ownedBy || sessionStore.profile}
                type={"quarterlyGoal"}
                disabled={true}
                size={16}
                nameWidth={"76px"}
                marginLeft={"16px"}
                marginRight={"0px"}
                marginTop={"auto"}
                fontSize={"12px"}
                marginBottom={"auto"}
              />
            )}
            <BadgeContainer>
              {quarterlyGoal.subInitiatives && quarterlyGoal.subInitiatives.length > 0 && (
                <>
                  <MilestoneCountContainer>
                    {quarterlyGoal.subInitiatives.length}
                  </MilestoneCountContainer>
                  <StyledSubInitiativeIcon
                    icon={"Sub_initiative"}
                    size={"16px"}
                    iconColor={grey100}
                  />
                </>
              )}
              <StatusBadge
                color={statusBadge.colors.color}
                backgroundColor={statusBadge.colors.backgroundColor}
              >
                {" "}
                {statusBadge.description}{" "}
              </StatusBadge>
            </BadgeContainer>
          </RowContainer>
        </Container>
      </>
    );
  },
);

type RowContainerProps = {
  mb?: number;
  mt?: number;
};

const RowContainer = styled.div<RowContainerProps>`
  display: flex;
  margin-top: ${props => `${props.mt}%` || "auto"};
  margin-bottom: ${props => `${props.mb}%` || "auto"};
`;

const StyledText = styled(Text)`
  padding-left: 4px;
  padding-right: 4px;
  white-space: normal;
  font-size: 14px;
  width: 100%;
  min-width: 180px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

type ContainerProps = {
  goalCardType?: string;
};

const Container = styled.div<ContainerProps>`
  background-color: ${props =>
    props.goalCardType == "child" ? `${props.theme.colors.backgroundGrey}` : "inherit"};
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
  font-weight: 700;
`;

const DescriptionContainer = styled.div`
  overflow-wrap: anywhere;
  display: flex;
  width: 95%;
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
};

const StatusBadge = styled.div<StatusBadgeType>`
  font-size: 12px;
  font-weight: 900;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  padding: 2px;
  text-align: center;
  border-radius: 2px;
  white-space: nowrap;
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
  align-items: center;
`;

const MilestoneCountContainer = styled.div`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-right: 5px;
`;
