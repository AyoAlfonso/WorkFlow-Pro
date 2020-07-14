import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import * as R from "ramda";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { baseTheme } from "~/themes";

interface IAnnualInitiativeModalContentProps {
  annualInitiativeId: number;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnnualInitiativeModalContent = ({
  annualInitiativeId,
  setAnnualInitiativeModalOpen,
}: IAnnualInitiativeModalContentProps): JSX.Element => {
  const { annualInitiativeStore } = useMst();
  const [annualInitiative, setAnnualInitiative] = useState<any>(null);

  useEffect(() => {
    annualInitiativeStore.getAnnualInitiative(annualInitiativeId).then(() => {
      setAnnualInitiative(annualInitiativeStore.annualInitiative);
    });
  }, []);

  if (annualInitiative == null) {
    return <> Loading... </>;
  }

  const renderStatusBlocks = (quarterlyGoal: QuarterlyGoalType) => {
    return quarterlyGoal.milestones.map((milestone, index) => {
      const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;
      let backgroundColor;
      switch (milestone.status) {
        case "incomplete":
          backgroundColor = warningRed;
          break;
        case "in_progress":
          backgroundColor = cautionYellow;
          break;
        case "completed":
          backgroundColor = finePine;
          break;
        default:
          backgroundColor = grey20;
          break;
      }
      return <StatusBlock backgroundColor={backgroundColor} key={index} />;
    });
  };

  const renderQuarterlyGoals = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer key={index}>
          <StatusBlocksContainer>{renderStatusBlocks(quarterlyGoal)}</StatusBlocksContainer>
          <TopRowContainer>
            <QuarterlyGoalDescription>{quarterlyGoal.description}</QuarterlyGoalDescription>
            <QuarterlyGoalOptionContainer>
              <Icon icon={"Options"} size={"20px"} iconColor={"grey80"} />
            </QuarterlyGoalOptionContainer>
          </TopRowContainer>
          <BottomRowContainer>
            <QuarterlyGoalOwnerContainer>
              <UserDefaultIcon
                firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
                lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
                size={40}
              />
            </QuarterlyGoalOwnerContainer>
          </BottomRowContainer>
        </QuarterlyGoalContainer>
      );
    });
  };

  return (
    <Container>
      <HeaderContainer>
        <TitleContainer>
          <DescriptionText>{annualInitiative.description}</DescriptionText>
          <GoalText>
            In order to <UnderlinedGoalText> Save At Least 100 People </UnderlinedGoalText>
          </GoalText>
        </TitleContainer>
        <AnnualInitiativeActionContainer>
          <EditIconContainer>
            <Icon icon={"Edit-2"} size={"25px"} iconColor={"grey80"} />
          </EditIconContainer>
          <CloseIconContainer onClick={() => setAnnualInitiativeModalOpen(false)}>
            <Icon icon={"Close"} size={"25px"} iconColor={"grey80"} />
          </CloseIconContainer>
        </AnnualInitiativeActionContainer>
      </HeaderContainer>
      <SectionContainer>
        <SubHeaderContainer>
          <SubHeaderText> Context</SubHeaderText>
        </SubHeaderContainer>
        <ContextContainer>PLACEHOLDER FOR CONTEXT DETAILS</ContextContainer>
      </SectionContainer>
      <SectionContainer>
        <SubHeaderContainer>
          <SubHeaderText> Quarterly Goals</SubHeaderText>
        </SubHeaderContainer>
        <QuarterlyGoalsContainer>{renderQuarterlyGoals()}</QuarterlyGoalsContainer>
      </SectionContainer>
      <SectionContainer>
        <SubHeaderContainer>
          <SubHeaderText> Comments</SubHeaderText>
        </SubHeaderContainer>
        <ContextContainer>PLACEHOLDER FOR COMMENTS</ContextContainer>
      </SectionContainer>
      <SectionContainer>
        <SubHeaderContainer>
          <SubHeaderText> Attachments</SubHeaderText>
        </SubHeaderContainer>
        <ContextContainer>PLACEHOLDER FOR ATTACHMENTS</ContextContainer>
      </SectionContainer>
    </Container>
  );
};

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 36px;
  overflow: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

const DescriptionText = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  margin-top: 0;
`;

const GoalText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.grey80};
`;

const UnderlinedGoalText = styled.span`
  font-weight: bold;
  text-decoration: underline;
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const EditIconContainer = styled.div`
  margin-right: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const ContextContainer = styled(HomeContainerBorders)``;

const SubHeaderText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const QuarterlyGoalsContainer = styled.div`
  margin-top: 8px;
`;

const QuarterlyGoalContainer = styled(HomeContainerBorders)`
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const TopRowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const QuarterlyGoalDescription = styled(Text)`
  margin-top: 0;
`;

const QuarterlyGoalOptionContainer = styled.div`
  margin-left: auto;
`;

const QuarterlyGoalOwnerContainer = styled.div`
  margin-left: auto;
`;

const StatusBlocksContainer = styled.div`
  display: flex;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 16px;
`;

type StatusBlockType = {
  backgroundColor?: string;
};

const StatusBlock = styled.div<StatusBlockType>`
  width: 80px;
  height: 5px;
  border-radius: 5px;
  margin-right: 1px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
`;
