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
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

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
  const [selectedContextTab, setSelectedContextTab] = useState<number>(1);

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

  const renderContextImportance = () => {
    return (
      <ContextImportanceContainer>
        <SubHeaderText> Why is it important?</SubHeaderText>
        <ContextContainer>
          <Text>{annualInitiative.importance[0]}</Text>
        </ContextContainer>
        <SubHeaderText> What are the consequences if missed?</SubHeaderText>
        <ContextContainer>
          <Text>{annualInitiative.importance[1]}</Text>
        </ContextContainer>
        <SubHeaderText> How will we celebrate if achieved?</SubHeaderText>
        <ContextContainer>
          <Text>{annualInitiative.importance[2]}</Text>
        </ContextContainer>
      </ContextImportanceContainer>
    );
  };

  const renderContextDescription = () => {
    return (
      <ContextContainer>
        <Text>{annualInitiative.contextDescription}</Text>
      </ContextContainer>
    );
  };

  const renderContextTabs = () => {
    return (
      <Tabs>
        <StyledTabList>
          <StyledTab tabSelected={selectedContextTab == 1} onClick={() => setSelectedContextTab(1)}>
            <StyledTabTitle>Importance </StyledTabTitle>
          </StyledTab>
          <StyledTab tabSelected={selectedContextTab == 2} onClick={() => setSelectedContextTab(2)}>
            <StyledTabTitle>Description</StyledTabTitle>
          </StyledTab>
          <StyledTab tabSelected={selectedContextTab == 3} onClick={() => setSelectedContextTab(3)}>
            <StyledTabTitle>Key Elements</StyledTabTitle>
          </StyledTab>
        </StyledTabList>

        <TabPanelContainer>
          <StyledTabPanel>{renderContextImportance()}</StyledTabPanel>
          <StyledTabPanel>{renderContextDescription()}</StyledTabPanel>
          <StyledTabPanel>
            <h2>Key Elements Container</h2>
          </StyledTabPanel>
        </TabPanelContainer>
      </Tabs>
    );
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
        <div>{renderContextTabs()}</div>
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

const TabPanelContainer = styled.div`
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  margin-top: -20px;
  padding: 16px;
`;

const StyledTabList = styled(TabList)`
  padding-left: 0;
`;

type StyledTabType = {
  tabSelected: boolean;
};

const StyledTab = styled(Tab)<StyledTabType>`
  display: inline-block;
  border: 1px solid #e3e3e3;
  outline: none;
  color: ${props =>
    props.tabSelected ? props.theme.colors.primary100 : props.theme.colors.grey80};
  border-bottom: none;
  margin-bottom: 3px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
  width: 140px;
  margin-left: 20px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const StyledTabTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledTabPanel = styled(TabPanel)``;

const ContextImportanceContainer = styled.div`
  margin-top: -8px;
`;
