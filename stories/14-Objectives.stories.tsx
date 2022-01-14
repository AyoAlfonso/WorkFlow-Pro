import * as React from "react";
import { InitiativeHeader } from "../app/javascript/components/domains/goals/shared-quarterly-goal-and-sub-initiative/initiative-header";
import { Context } from "../app/javascript/components/domains/goals/shared-quarterly-goal-and-sub-initiative/context";
import { ShowMilestonesButton } from "../app/javascript/components/domains/goals/shared-quarterly-goal-and-sub-initiative/show-milestones-button";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { rootStore, Provider } from "../app/javascript/setup/root";
import { observer } from "mobx-react";
import { getEnv } from "mobx-state-tree";
import { Router } from "react-router-dom";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import * as moment from "moment";
import * as R from "ramda";
import { WeeklyMilestones } from "~/components/domains/goals/shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { KeyElement } from "~/components/domains/goals/shared/key-element";
import { Avatar, Button, Icon, Text, TextDiv } from "~/components/shared";
import { ActivityLogs } from "~/components/domains/goals/shared/activity-logs";
import { StatusBlockColorIndicator } from "~/components/domains/goals/shared/status-block-color-indicator";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { RecordOptions } from "~/components/domains/goals/shared/record-options";
import { quarterlyGoal } from "./shared/objective-stories-data";

export default { title: "Objectives" };

const annualInitiativeDescription = "Refactor Codebase";

const allMilestones = quarterlyGoal.milestones;
const activeMilestones = quarterlyGoal.milestones.filter(
  milestone =>
    moment(milestone.weekOf).isSame(moment(), "week") ||
    moment(milestone.weekOf).isAfter(moment(), "week"),
);

const goalYearString = `FY${quarterlyGoal.fiscalYear.toString().slice(-2)}/${(
  quarterlyGoal.fiscalYear + 1
)
  .toString()
  .slice(-2)}`;

export const Objectives = () => {
  const [showInactiveMilestones, setShowInactiveMilestones] = React.useState<boolean>(false);
  const [showMilestones, setShowMilestones] = React.useState<boolean>(true);
  const [showKeyElementForm, setShowKeyElementForm] = React.useState<boolean>(false);
  const [showActionType, setActionType] = React.useState<string>("Add");
  const [selectedElement, setSelectedElement] = React.useState<number>(null);

  const renderContextTabs = async () => (
    <Context
      activeInitiatives={quarterlyGoal.subInitiatives.length}
      setShowMilestones={setShowMilestones}
      itemType={"quarterlyGoal"}
      item={quarterlyGoal}
    />
  );

  return (
    <Provider value={rootStore}>
      <Router history={getEnv(rootStore).routerHistory}>
        <ContainerDiv>
          <h1>Milestones</h1>
          <CodeBlockDiv mb={"20px"}>
            <CopyBlock
              text={`
              import * as React from "react";
              import { ShowMilestonesButton } from "~components/domains/goals/shared-quarterly-goal-and-sub-initiative/show-milestones-button";
              
              <ShowMilestonesButton
                setShowInactiveMilestones={setShowInactiveMilestones}
                showInactiveMilestones={showInactiveMilestones}
              /> 
              <WeeklyMilestones
                editable={false}
                allMilestones={allMilestones}
                activeMilestones={activeMilestones}
                showInactiveMilestones={showInactiveMilestones}
                itemType={"quarterlyGoal"}
              />
              )
            `}
              language={"tsx"}
              theme={atomOneLight}
            />
          </CodeBlockDiv>
          <ShowMilestonesButton
            setShowInactiveMilestones={setShowInactiveMilestones}
            showInactiveMilestones={showInactiveMilestones}
          />
          <Container>
            <WeeklyMilestones
              editable={true}
              allMilestones={allMilestones}
              activeMilestones={activeMilestones}
              showInactiveMilestones={showInactiveMilestones}
              itemType={"quarterlyGoal"}
            />
          </Container>
        </ContainerDiv>
        <ContainerDiv>
          <h1>Key Element</h1>
          <CodeBlockDiv mb={"20px"}>
            <CopyBlock
              text={`
              import * as React from "react";
              import { KeyElement } from "~/components/domains/goals/shared/key-element";
            
              <KeyElement
                elementId={element.id}
                store={store}
                editable={editable}
                key={element.id}
                lastKeyElement={lastKeyElement}
                focusOnLastInput={focusOnLastInput}
                type={type}
                setShowKeyElementForm={setShowKeyElementForm}
                setActionType={setActionType}
                setSelectedElement={setSelectedElement}
                date={selectedDate}
                initiativeId={object.id}
              />
              )
            `}
              language={"tsx"}
              theme={atomOneLight}
            />
          </CodeBlockDiv>
          <Container>
            <KeyElement keyElement={quarterlyGoal.keyElements[0]} editable={true} type={"test"} />
            <StyledButton
              small
              variant={"grey"}
              onClick={() => {
                setShowKeyElementForm(true);
              }}
            >
              <CircularIcon icon={"Plus"} size={"12px"} />
              <AddKeyElementText>Add a Key Result</AddKeyElementText>
            </StyledButton>
          </Container>
        </ContainerDiv>
        <ContainerDiv>
          <h1>Initiative header</h1>
          <CodeBlockDiv mb={"20px"}>
            <CopyBlock
              text={`
              import * as React from "react";
              import { InitiativeHeader } from "../app/javascript/components/domains/goals/shared-quarterly-goal-and-sub-initiative/initiative-header";
            
              <InitiativeHeader
                itemType={itemType}
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
                derivedStatus={getCurrentWeekStatus()}
              />
              )
            `}
              language={"tsx"}
              theme={atomOneLight}
            />
          </CodeBlockDiv>
          <Container>
            <InitiativeHeader
              itemType={"quarterlyGoal"}
              item={quarterlyGoal}
              editable={true}
              annualInitiativeId={quarterlyGoal.annualInitiativeId}
              annualInitiativeDescription={annualInitiativeDescription}
              goalYearString={goalYearString}
            />
          </Container>
        </ContainerDiv>
        <ContainerDiv>
          <h1>Context Tabs</h1>
          <CodeBlockDiv mb={"20px"}>
            <CopyBlock
              text={`
              import * as React from "react";
              import { Context } from "../app/javascript/components/domains/goals/shared-quarterly-goal-and-sub-initiative/context";
            
              <Context
                activeInitiatives={quarterlyGoal.subInitiatives.length}
                setShowInitiatives={setShowInitiatives}
                setShowMilestones={setShowMilestones}
                itemType={itemType}
                item={quarterlyGoal}
              />
              )
            `}
              language={"tsx"}
              theme={atomOneLight}
            />
          </CodeBlockDiv>
          <Container>
            <Context
              activeInitiatives={quarterlyGoal.subInitiatives.length}
              setShowMilestones={setShowMilestones}
              itemType={"quarterlyGoal"}
              item={quarterlyGoal}
            />
          </Container>
        </ContainerDiv>
        <ContainerDiv>
          <h1>Quarterly Goal Card</h1>
          <QuarterlyGoalContainer>
            <StatusBlockColorIndicator
              milestones={quarterlyGoal.milestones || []}
              indicatorWidth={"80px"}
              indicatorHeight={4}
              marginBottom={16}
            />

            <TopRowContainer>
              <QuarterlyGoalDescription>{quarterlyGoal.description}</QuarterlyGoalDescription>
              <QuarterlyGoalOptionContainer>
                <RecordOptions type={"quarterlyGoal"} id={quarterlyGoal.id} />
              </QuarterlyGoalOptionContainer>
            </TopRowContainer>
            <BottomRowContainer>
              {quarterlyGoal.ownedBy && (
                <QuarterlyGoalOwnerContainer>
                  <Avatar
                    firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
                    lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
                    defaultAvatarColor={R.path(["ownedBy", "defaultAvatarColor"], quarterlyGoal)}
                    avatarUrl={R.path(["ownedBy", "avatarUrl"], quarterlyGoal)}
                    size={40}
                  />
                </QuarterlyGoalOwnerContainer>
              )}
            </BottomRowContainer>
          </QuarterlyGoalContainer>
        </ContainerDiv>
      </Router>
    </Provider>
  );
};

const Container = styled.div`
  padding: 0 10px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;

const AddKeyElementText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
`;

const QuarterlyGoalContainer = styled(HomeContainerBorders)`
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;

const TopRowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const QuarterlyGoalOwnerContainer = styled.div`
  margin-left: auto;
`;

const QuarterlyGoalDescription = styled(Text)`
  margin-top: 0;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const QuarterlyGoalOptionContainer = styled.div`
  margin-left: auto;
`;
