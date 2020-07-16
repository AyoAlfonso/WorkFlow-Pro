import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import * as R from "ramda";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { ContextTabs } from "../shared/context-tabs";
import { OwnedBySection } from "../shared/owned-by-section";

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

  const renderQuarterlyGoals = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer key={index}>
          <StatusBlockColorIndicator
            milestones={quarterlyGoal.milestones}
            indicatorWidth={80}
            marginBottom={16}
          />
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

  const renderHeader = (): JSX.Element => {
    return (
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
    );
  };

  const renderContext = (): JSX.Element => {
    return (
      <InfoSectionContainer>
        <ContextSectionContainer>
          <SubHeaderContainer>
            <SubHeaderText> Context</SubHeaderText>
          </SubHeaderContainer>
          <ContextTabs object={annualInitiative} />
        </ContextSectionContainer>
        <OwnedBySection ownedBy={annualInitiative.ownedBy} />
      </InfoSectionContainer>
    );
  };

  const renderGoals = (): JSX.Element => {
    return (
      <>
        <SubHeaderContainer>
          <SubHeaderText> Quarterly Goals</SubHeaderText>
          <ShowPastGoalsContainer>
            <Button small variant={"primaryOutline"} onClick={() => {}}>
              Show Past Goals (2)
            </Button>
          </ShowPastGoalsContainer>
        </SubHeaderContainer>
        <QuarterlyGoalsContainer>{renderQuarterlyGoals()}</QuarterlyGoalsContainer>
      </>
    );
  };

  return (
    <Container>
      {renderHeader()}
      <SectionContainer>{renderContext()}</SectionContainer>
      <SectionContainer>{renderGoals()}</SectionContainer>
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

const ContextContainer = styled(HomeContainerBorders)`
  padding-left: 16px;
  padding-right: 16px;
`;

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

const InfoSectionContainer = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 90%;
`;

const ShowPastGoalsContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;
