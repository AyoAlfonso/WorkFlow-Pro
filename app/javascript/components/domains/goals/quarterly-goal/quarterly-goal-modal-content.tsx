import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { ContextTabs } from "../shared/context-tabs";
import { OwnedBySection } from "../shared/owned-by-section";
import { IndividualVerticalStatusBlockColorIndicator } from "../shared/individual-vertical-status-block-color-indicator";

interface IQuarterlyGoalModalContentProps {
  quarterlyGoalId: number;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuarterlyGoalModalContent = ({
  quarterlyGoalId,
  setQuarterlyGoalModalOpen,
}: IQuarterlyGoalModalContentProps): JSX.Element => {
  const { quarterlyGoalStore } = useMst();
  const [quarterlyGoal, setQuarterlyGoal] = useState<any>(null);

  useEffect(() => {
    quarterlyGoalStore.getQuarterlyGoal(quarterlyGoalId).then(() => {
      setQuarterlyGoal(quarterlyGoalStore.quarterlyGoal);
    });
  }, []);

  if (quarterlyGoal == null) {
    return <> Loading... </>;
  }

  const renderHeader = (): JSX.Element => {
    return (
      <HeaderContainer>
        <TitleContainer>
          <DescriptionText>{quarterlyGoal.description}</DescriptionText>
          <GoalText>
            driving <UnderlinedGoalText> Validate the technology and benefits </UnderlinedGoalText>
          </GoalText>
        </TitleContainer>
        <AnnualInitiativeActionContainer>
          <EditIconContainer>
            <Icon icon={"Edit-2"} size={"25px"} iconColor={"grey80"} />
          </EditIconContainer>
          <CloseIconContainer onClick={() => setQuarterlyGoalModalOpen(false)}>
            <Icon icon={"Close"} size={"25px"} iconColor={"grey80"} />
          </CloseIconContainer>
        </AnnualInitiativeActionContainer>
      </HeaderContainer>
    );
  };

  const renderContext = (): JSX.Element => {
    return (
      <InfoSectionContainer>
        <ContextSectionContainer>
          <SubHeaderContainer>
            <SubHeaderText> Context</SubHeaderText>
          </SubHeaderContainer>
          <ContextTabs object={quarterlyGoal} />
        </ContextSectionContainer>
        <OwnedBySection ownedBy={quarterlyGoal.ownedBy} />
      </InfoSectionContainer>
    );
  };

  const renderWeeklyMilestones = (): JSX.Element => {
    return quarterlyGoal.milestones.map((milestone, index) => {
      return (
        <MilestoneContainer key={index}>
          <MilestoneDetails>
            <WeekOfText>
              Week of <WeekOfTextValue>{milestone.weekOf}</WeekOfTextValue>
            </WeekOfText>
            <MilestoneDescriptionText>{milestone.description}</MilestoneDescriptionText>
          </MilestoneDetails>
          <IndividualVerticalStatusBlockColorIndicator milestone={milestone} />
        </MilestoneContainer>
      );
    });
  };

  return (
    <Container>
      <StatusBlockColorIndicator
        milestones={quarterlyGoal.milestones}
        indicatorWidth={80}
        marginBottom={16}
      />

      <QuarterlyGoalBodyContainer>
        {renderHeader()}
        <SectionContainer>{renderContext()}</SectionContainer>
        <SectionContainer>
          <MilestonesHeaderContainer>
            <SubHeaderContainer>
              <SubHeaderText> Weekly Milestones</SubHeaderText>
            </SubHeaderContainer>
            <ShowPastWeeksContainer>
              <Button small variant={"primaryOutline"} onClick={() => {}}>
                Show Past Weeks (2)
              </Button>
            </ShowPastWeeksContainer>
          </MilestonesHeaderContainer>
          {renderWeeklyMilestones()}
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
      </QuarterlyGoalBodyContainer>
    </Container>
  );
};

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

const ContextContainer = styled(HomeContainerBorders)`
  padding-left: 16px;
  padding-right: 16px;
`;

const SubHeaderText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const MilestoneContainer = styled.div`
  display: flex;
`;

const MilestoneDetails = styled(HomeContainerBorders)`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
`;

const WeekOfText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const WeekOfTextValue = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const MilestoneDescriptionText = styled(Text)`
  margin-top: 8px;
  margin-bottom: 8px;
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
