import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { baseTheme } from "~/themes";
import { useHistory } from "react-router-dom";
import { CheckInTemplateCard } from "./checkin-template-card";

export const CheckinTemplates = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("All");
  const history = useHistory();

  const checkins = [
    {
      name: "☕️ Daily Standup",
      description:
        "Keep your whole team in the loop with updates on daily progress and possible blockers",
      tags: ["Team"],
    },
    {
      name: "✍🏾 Weekly Check-in",
      description:
        "A weekly check-in to reflect on what went well and what could be improved. Decide what to focus on next.",
      tags: ["Team"],
    },
    {
      name: "🪞 Evening Reflection",
      description: "Taking time to reflect on your day and getting ready for the day ahead",
      tags: ["Personal"],
    },
    {
      name: "eNPS",
      description: "Measure how do employees really feel about their work",
      tags: ["Custom", "Company"],
    },
  ];

  return (
    <Container>
      <StyledHeader>Check-in Templates</StyledHeader>
      <OverviewTabsContainer>
        <OverviewTab active={activeTab === "All"} onClick={() => setActiveTab("All")}>
          All
        </OverviewTab>
        <OverviewTab active={activeTab === "Team"} onClick={() => setActiveTab("Team")}>
          Team
        </OverviewTab>
        <OverviewTab active={activeTab === "Company"} onClick={() => setActiveTab("Company")}>
          Company
        </OverviewTab>
        <OverviewTab active={activeTab === "Personal"} onClick={() => setActiveTab("Personal")}>
          Personal
        </OverviewTab>
        <OverviewTab active={activeTab === "Custom"} onClick={() => setActiveTab("Custom")}>
          Custom
        </OverviewTab>
        <OverviewTab
          color={baseTheme.colors.primary100}
          active={activeTab === "Build"}
          onClick={() => history.push("/check-in/build")}
        >
          Build your own
        </OverviewTab>
      </OverviewTabsContainer>
      <CheckInTemplateCardsContainer>
        {checkins.map((checkin, index) => (
          <CheckInTemplateCard
            key={`checkin-${index}`}
            name={checkin.name}
            description={checkin.description}
            tags={checkin.tags}
          />
        ))}
      </CheckInTemplateCardsContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  height: 100%;
`;

const StyledHeader = styled.span`
  margin-bottom: 3em;
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
`;

const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`;

type IOverviewTab = {
  active: boolean;
  color?: string;
};

const OverviewTab = styled("span")<IOverviewTab>`
  margin-bottom: 0;
  margin-right: 0.5em;
  padding: 0 15px;
  padding-bottom: 5px;
  color: ${props =>
    props.color
      ? props.color
      : props.active
      ? props.theme.colors.black
      : props.theme.colors.greyInactive};
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  text-decoration: none;
  border-bottom-width: ${props => (props.active ? `2px` : `0px`)};
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin-bottom: 1em;
  }
`;

const CheckInTemplateCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em 2em;
`;
