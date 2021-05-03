import * as React from "react";
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
import * as moment from "moment";

interface IQuarterlyGoalCardProps {
  quarterlyGoal: QuarterlyGoalType;
  setQuarterlyGoalModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalId?: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  annualInitiativeDescription: string;
  goalCardType?: string
}

export const QuarterlyGoalCard = (props: IQuarterlyGoalCardProps): JSX.Element => {
  const {
    quarterlyGoal,
    setQuarterlyGoalModalOpen,
    setQuarterlyGoalId,
    setSelectedAnnualInitiativeDescription,
    annualInitiativeDescription,
    goalCardType
  } = props;

  const { companyStore } = useMst();
  const { warningRed, fadedRed, cautionYellow, fadedYellow, finePine, fadedGreen, grey40, grey20 } = baseTheme.colors;

    //TODOIST: Come back to make this code dry and icon color constant
      let currentMilestone;
      let statusBadge = {description: '', colors: {
        backgroundColor: '',
        color: ''
      } };
      currentMilestone = quarterlyGoal.milestones.find(milestone =>
        moment(milestone.weekOf).isSame(moment(), "week"),
      );
      if (!currentMilestone) {
        currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
      }

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "completed":
            statusBadge.description = "On Track"
            statusBadge.colors = {color: finePine, backgroundColor: fadedGreen}
            break;
          case "in_progress":
             statusBadge.description = "Needs Attention"
             statusBadge.colors = { color: cautionYellow, backgroundColor: fadedYellow}
            break;
          case "incomplete":
             statusBadge.description = "Behind"
             statusBadge.colors = { color: warningRed, backgroundColor: fadedRed}
            break;
          case "unstarted":
             statusBadge.description = "No update"
             statusBadge.colors = { color: grey40, backgroundColor: grey20}
            break;
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
      return (
          <QuarterText> Q{quarter}: </QuarterText>
      );
    }
  };

  return (
    <Container
      goalCardType={goalCardType}
      onClick={e => {
        e.stopPropagation();
        openQuarterlyGoalModal();
      }}
    >
      <StatusBlockColorIndicator milestones={quarterlyGoal.milestones || []} indicatorWidth={25} indicatorHeight={2}/>

      <RowContainer
        mt={5}
        mb={5}
        >
        <DescriptionContainer>
            { goalCardType == "child" && (<StyledSubInitiativeIcon icon={"Sub_initiative"} size={"15px"} iconColor={"#868DAA"} />)}
            { goalCardType == "parent" && (renderQuarterDisplay())}
              <StyledText>{quarterlyGoal.description}</StyledText>
        </DescriptionContainer>

        <IconContainer>
          <RecordOptions type={"quarterlyGoal"} id={quarterlyGoal.id} />
        </IconContainer>
      </RowContainer>
      <RowContainer
        mt={5}
        mb={5}
      >
    {/* // TODOIST: refactor the values of this component to get only */}
        {quarterlyGoal.ownedBy && (
          <OwnedBySection
          ownedBy={quarterlyGoal.ownedBy}
          type={"quarterlyGoal"}
          disabled={true}
          size={20}
          nameWidth={"100px"}
          marginLeft={"16px"}
          marginRight={"0px"}
          marginTop={"4px"}
          fontSize={"9px"}
          marginBottom={"0px"}
        />
        )}
       {goalCardType == "parent" && (
          <BadgeContainer>
          <MilestoneCountContainer>
           {quarterlyGoal.subInitiatives.length}
          </MilestoneCountContainer>
          
          <StyledSubInitiativeIcon icon={"Sub_initiative"} size={"15px"} iconColor={"#868DAA"} />
            <StatusBadge
              color={statusBadge.colors.color}
              backgroundColor={statusBadge.colors.backgroundColor}
            > {statusBadge.description} </StatusBadge>
          </BadgeContainer>
         )}
      </RowContainer>
    </Container>
  );
};

type RowConatainerProps = {
  mb?: number;
  mt?: number
};

const RowContainer = styled.div<RowConatainerProps>`
  display: flex;
  margin-top: ${props => `${props.mt}%` || 'auto'};
  margin-bottom: ${props => `${props.mb}%` || 'auto'}
`;

const StyledText = styled(Text)`
  padding-left: 4px;
  padding-right: 4px;
  white-space: normal;
  font-size: 12px;
  width: 160px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden; 
`;

const Container = styled.div`
  padding-top: 5px;
  background-color: ${props => (props.goalCardType == "child" ? `${props.theme.colors.grey20}` : 'inherit')};
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 8px;
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
  font-weight: 700
`;

const DescriptionContainer = styled.div`
  overflow-wrap: anywhere;
  display:flex;
  font-size: 12px;
  padding: 0px 16px; 
`;

const StyledSubInitiativeIcon = styled(Icon)`
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
  margin-top: 10px;
`;

// TODOIST: Update the color constant 
const StatusBadge = styled.div`
    font-size: 9px;
    font-weight: 900;
    display: inline-block;
    background-color:${props => props.backgroundColor};
    color: ${props => props.color};
    padding: 5px;
    text-align: center;
    border-radius: 2px;
    margin: 10px 0px 0px;
`;

const BadgeContainer = styled.div`
  display:flex;
  width: 60%;
  margin-right: 10px;

`;

const MilestoneCountContainer = styled.div`
  font-size: 9px;
  margin-right: 5px;
  margin-top: 15%;
`;