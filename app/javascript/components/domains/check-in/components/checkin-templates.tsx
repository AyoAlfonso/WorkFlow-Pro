import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";
import { useHistory } from "react-router-dom";
import { CheckInTemplateCard } from "./checkin-template-card";
import { Loading } from "~/components/shared";
import { toJS } from "mobx";

export const CheckinTemplates = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkInTemplatesState, setCheckInTemplatesState] = useState<any[]>([]);
  const history = useHistory();
  const { checkInTemplateStore } = useMst();

  const { checkInTemplates } = checkInTemplateStore;

  useEffect(() => {
    checkInTemplateStore.fetchCheckInTemplates().then(() => {
      setCheckInTemplatesState(toJS(checkInTemplates));
      setIsLoading(false);
    });
  }, []);

  const renderLoading = () => (
    <LoadingContainer>
      <Loading />
    </LoadingContainer>
  );

  if (isLoading) {
    return renderLoading();
  }

  const tabArray = ["All", "Team", "Company", "Personal", "Custom"];

  const filterTabs = (tab: string) => {
    setActiveTab(tab);
    if (tab === "All") {
      setCheckInTemplatesState(toJS(checkInTemplates));
    } else if (tab == "Custom") {
      const filteredTemplates = toJS(checkInTemplates).filter(
        template => template.checkInType == "dynamic",
      );
      setCheckInTemplatesState(filteredTemplates);
    } else {
      const filteredTemplates = toJS(checkInTemplates).filter(
        template => template.ownerType == tab.toLowerCase(),
      );
      setCheckInTemplatesState(filteredTemplates);
    }
  };

  const updateStatus = (id) => {
    const templates = [...checkInTemplatesState];
    const template = templates.find(template => template.id == id);
    if (template) {
      template.status = "published";
      setCheckInTemplatesState(templates);
    }
  }

  return (
    <Container>
      <StyledHeader>Check-in Templates</StyledHeader>
      <OverviewTabsContainer>
        {tabArray.map((tab, index) => (
          <OverviewTab
            key={`tab-${index}`}
            active={activeTab === tab}
            onClick={() => filterTabs(tab)}
          >
            {tab}
          </OverviewTab>
        ))}
        <OverviewTab
          color={baseTheme.colors.primary100}
          active={activeTab === "Build"}
          onClick={() => history.push("/check-in/build")}
        >
          Build your own
        </OverviewTab>
      </OverviewTabsContainer>
      <CheckInTemplateCardsContainer>
        {checkInTemplatesState.map((checkin, index) => (
          <CheckInTemplateCard
            key={`checkin-${index}`}
            name={checkin.name}
            id={checkin.id}
            description={checkin.description}
            checkInTemplate={checkin}
            tags={[checkin.ownerType, checkin.checkInType == "dynamic" ? "Custom" : ""]}
            updateStatus={updateStatus}
          />
        ))}
      </CheckInTemplateCardsContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1em;
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
  width: 100%;
  overflow: auto;
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
  white-space: nowrap;
  @media only screen and (max-width: 768px) {
    margin-bottom: 1em;
  }

  @media only screen and (max-width: 1200px) {
    padding: 0 5px;
  }

  &: last-child {
    margin-right: 0;
  }
`;

const CheckInTemplateCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  // flex-wrap: wrap;
  gap: 1em 2em;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
