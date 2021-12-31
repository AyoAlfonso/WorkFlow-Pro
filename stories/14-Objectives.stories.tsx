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
import { WeeklyMilestones } from "~/components/domains/goals/shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { KeyElement } from "~/components/domains/goals/shared/key-element";
import { Button, Icon, TextDiv } from "~/components/shared";

export default { title: "Objectives" };

const annualInitiativeDescription = "Refactor Codebase";

const quarterlyGoal = {
  id: 8,
  annualInitiativeId: 3,
  createdById: 3,
  ownedById: 3,
  importance: ["", "", ""],
  keyElements: [
    {
      id: 42,
      value: "new sorting",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-11-17T11:35:18.355Z",
      updatedAt: "2021-12-29T13:16:26.013Z",
      completionType: "numerical",
      completionCurrentValue: 0,
      completionTargetValue: 100,
      completionStartingValue: 0,
      status: "completed",
      ownedById: 3,
      greaterThan: 1,
    },
    {
      id: 43,
      value: "sorting 2",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-11-17T12:16:33.359Z",
      updatedAt: "2021-12-09T20:53:06.686Z",
      completionType: "numerical",
      completionCurrentValue: 0,
      completionTargetValue: 0,
      completionStartingValue: 0,
      status: "completed",
      ownedById: 3,
      greaterThan: null,
    },
    {
      id: 44,
      value: "sorting 2",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-11-17T12:16:37.577Z",
      updatedAt: "2021-12-16T08:52:25.806Z",
      completionType: "numerical",
      completionCurrentValue: 200,
      completionTargetValue: 100,
      completionStartingValue: 0,
      status: "completed",
      ownedById: 3,
      greaterThan: 1,
    },
    {
      id: 49,
      value: "new new",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-11-17T13:54:31.622Z",
      updatedAt: "2021-12-14T13:31:27.360Z",
      completionType: "numerical",
      completionCurrentValue: 190,
      completionTargetValue: 100,
      completionStartingValue: 0,
      status: "unstarted",
      ownedById: 3,
      greaterThan: null,
    },
    {
      id: 55,
      value: "testing target value",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-11-19T07:31:48.582Z",
      updatedAt: "2021-12-28T14:01:59.060Z",
      completionType: "numerical",
      completionCurrentValue: 2,
      completionTargetValue: 1,
      completionStartingValue: 0,
      status: "in_progress",
      ownedById: 3,
      greaterThan: 0,
    },
    {
      id: 86,
      value: "new completion",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-12-29T14:40:09.176Z",
      updatedAt: "2021-12-29T14:40:09.176Z",
      completionType: "numerical",
      completionCurrentValue: 0,
      completionTargetValue: 100,
      completionStartingValue: null,
      status: "unstarted",
      ownedById: 3,
      greaterThan: 1,
    },
    {
      id: 88,
      value: "new completion",
      completedAt: null,
      elementableType: "QuarterlyGoal",
      elementableId: 8,
      createdAt: "2021-12-29T14:55:52.176Z",
      updatedAt: "2021-12-29T14:55:52.176Z",
      completionType: "binary",
      completionCurrentValue: 0,
      completionTargetValue: 0,
      completionStartingValue: null,
      status: "unstarted",
      ownedById: 3,
      greaterThan: 1,
    },
  ],
  contextDescription: "",
  quarter: 4,
  createdAt: "2021-11-12T11:55:31.045Z",
  closedAt: null,
  description: "Test Sorting",
  ownedBy: {
    id: 3,
    firstName: "Christopher",
    lastName: "Pang",
    avatarUrl:
      "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBHdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--28646dc00f0bd1b1e066a0b59b1677e1319e8e68/blob",
    email: "christopher@laterolabs.com",
    confirmedAt: "2021-10-13T11:04:28.940Z",
    invitationSentAt: null,
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    phoneNumber: "778-998-1234",
    defaultAvatarColor: "fuschiaBlue",
    status: "active",
    defaultSelectedCompanyId: 2,
    userPulseForDisplay: null,
    currentCompanyOnboarded: true,
    questionnaireTypeForPlanning: "daily",
    productFeatures: {
      id: 3,
      userId: 3,
      objective: true,
      team: true,
      meeting: true,
      company: true,
      pyns: true,
      scorecard: true,
      scorecardPro: true,
      checkIn: true,
    },
    companyProfiles: [
      {
        id: 2,
        name: "Latero Labs",
        displayFormat: "Company",
      },
      {
        id: 4,
        name: "name",
        displayFormat: "Company",
      },
    ],
  },
  milestones: [
    {
      id: 59,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.076Z",
      status: "unstarted",
      description: "",
      week: 1,
      weekOf: "2021-10-04",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 60,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.096Z",
      status: "unstarted",
      description: "",
      week: 2,
      weekOf: "2021-10-11",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 61,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.104Z",
      status: "unstarted",
      description: "",
      week: 3,
      weekOf: "2021-10-18",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 62,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.111Z",
      status: "unstarted",
      description: "",
      week: 4,
      weekOf: "2021-10-25",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 63,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.119Z",
      status: "unstarted",
      description: "",
      week: 5,
      weekOf: "2021-11-01",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 64,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.125Z",
      status: "unstarted",
      description: "",
      week: 6,
      weekOf: "2021-11-08",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 65,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.133Z",
      status: "unstarted",
      description: "",
      week: 7,
      weekOf: "2021-11-15",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 66,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.141Z",
      status: "unstarted",
      description: "",
      week: 8,
      weekOf: "2021-11-22",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 67,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.148Z",
      status: "unstarted",
      description: "",
      week: 9,
      weekOf: "2021-11-29",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 68,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.155Z",
      status: "unstarted",
      description: "",
      week: 10,
      weekOf: "2021-12-06",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 69,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.162Z",
      status: "in_progress",
      description: "",
      week: 11,
      weekOf: "2021-12-13",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 70,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.188Z",
      status: "unstarted",
      description: "",
      week: 12,
      weekOf: "2021-12-20",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
    {
      id: 71,
      createdById: 3,
      createdAt: "2021-12-05T18:28:08.195Z",
      status: "unstarted",
      description: "",
      week: 13,
      weekOf: "2021-12-27",
      milestoneableId: 8,
      milestoneableType: "QuarterlyGoal",
    },
  ],
  subInitiatives: [
    {
      id: 6,
      quarterlyGoalId: 8,
      createdById: 3,
      ownedById: 3,
      importance: ["", "", ""],
      keyElements: [
        {
          id: 66,
          value: "New",
          completedAt: null,
          elementableType: "SubInitiative",
          elementableId: 6,
          createdAt: "2021-11-27T09:07:58.329Z",
          updatedAt: "2021-12-07T19:28:52.393Z",
          completionType: "numerical",
          completionCurrentValue: 60,
          completionTargetValue: 100,
          completionStartingValue: 0,
          status: "in_progress",
          ownedById: 3,
          greaterThan: 0,
        },
      ],
      contextDescription: "",
      quarter: 4,
      createdAt: "2021-11-27T09:07:39.634Z",
      closedAt: null,
      description: "Supporting",
      ownedBy: {
        id: 3,
        firstName: "Christopher",
        lastName: "Pang",
        avatarUrl:
          "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBHdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--28646dc00f0bd1b1e066a0b59b1677e1319e8e68/blob",
        email: "christopher@laterolabs.com",
        confirmedAt: "2021-10-13T11:04:28.940Z",
        invitationSentAt: null,
        timezone: "(GMT-08:00) Pacific Time (US & Canada)",
        phoneNumber: "778-998-1234",
        defaultAvatarColor: "fuschiaBlue",
        status: "active",
        defaultSelectedCompanyId: 2,
        userPulseForDisplay: null,
        currentCompanyOnboarded: true,
        questionnaireTypeForPlanning: "daily",
        productFeatures: {
          id: 3,
          userId: 3,
          objective: true,
          team: true,
          meeting: true,
          company: true,
          pyns: true,
          scorecard: true,
          scorecardPro: true,
          checkIn: true,
        },
        companyProfiles: [
          {
            id: 2,
            name: "Latero Labs",
            displayFormat: "Company",
          },
          {
            id: 4,
            name: "name",
            displayFormat: "Company",
          },
        ],
      },
      milestones: [],
      annualInitiativeId: 3,
      fiscalYear: 2021,
    },
  ],
  fiscalYear: 2021,
};

const objectiveLogs = [
  {
    id: 222,
    ownedById: 3,
    objecteableType: "AnnualInitiative",
    objecteableId: 3,
    score: 0,
    note: "the",
    fiscalQuarter: 4,
    fiscalYear: 2021,
    week: 50,
    createdAt: "2021-12-14T13:22:57.234Z",
    updatedAt: "2021-12-14T13:22:57.234Z",
    childId: null,
    childType: null,
    status: "unstarted",
  },
  {
    id: 215,
    ownedById: 3,
    objecteableType: "AnnualInitiative",
    objecteableId: 3,
    score: 23,
    note: "AHHHH",
    fiscalQuarter: 3,
    fiscalYear: 4,
    week: 4,
    createdAt: "2021-12-13T19:12:56.146Z",
    updatedAt: "2021-12-13T19:12:56.146Z",
    childId: 58,
    childType: "KeyElement",
    status: "done",
  },
];

const meta = {
  firstPage: true,
  prevPage: null,
  nextPage: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 2,
  size: 2,
};

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
