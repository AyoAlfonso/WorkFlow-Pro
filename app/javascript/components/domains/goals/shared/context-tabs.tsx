import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Checkbox, Label } from "@rebass/forms";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import * as R from "ramda";

interface IContextTabsProps {
  object: AnnualInitiativeType | QuarterlyGoalType;
  type: string;
}

export const ContextTabs = ({ object, type }: IContextTabsProps): JSX.Element => {
  const { sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
  const currentUser = sessionStore.profile;
  const [selectedContextTab, setSelectedContextTab] = useState<number>(1);
  const [hideContent, setHideContent] = useState<boolean>(false);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    if (type == "annualInitiative") {
      setStore(annualInitiativeStore);
    } else if (type == "quarterlyGoal") {
      setStore(quarterlyGoalStore);
    }
  });

  const updateImportance = (index: number, value: string): void => {
    let objectToBeModified = R.clone(object);
    objectToBeModified.importance[index] = value;
    store.updateModelField("importance", objectToBeModified.importance);
  };

  const renderContextImportance = () => {
    return (
      <ContextImportanceContainer>
        <SubHeaderText> Why is it important?</SubHeaderText>
        <StyledContentEditable
          html={object.importance[0]}
          disabled={currentUser.id != object.ownedById}
          onChange={e => updateImportance(0, e.target.value)}
          onBlur={() => store.updateAnnualInitiative()}
        />
        <SubHeaderText> What are the consequences if missed?</SubHeaderText>
        <StyledContentEditable
          html={object.importance[1]}
          disabled={currentUser.id != object.ownedById}
          onChange={e => updateImportance(1, e.target.value)}
          onBlur={() => store.updateAnnualInitiative()}
        />
        <SubHeaderText> How will we celebrate if achieved?</SubHeaderText>
        <StyledContentEditable
          html={object.importance[2]}
          disabled={currentUser.id != object.ownedById}
          onChange={e => updateImportance(2, e.target.value)}
          onBlur={() => store.updateAnnualInitiative()}
        />
      </ContextImportanceContainer>
    );
  };

  const renderContextDescription = () => {
    return (
      <StyledContentEditable
        html={object.contextDescription}
        disabled={currentUser.id != object.ownedById}
        onChange={e => store.updateModelField("contextDescription", e.target.value)}
        onBlur={() => store.updateAnnualInitiative()}
      />
    );
  };

  const renderKeyElements = () => {
    return object.keyElements.map((element, index) => {
      const [checkboxValue, setCheckboxValue] = useState<boolean>(
        element["completedAt"] ? true : false,
      );
      return (
        <KeyElementContainer key={index}>
          <CheckboxContainer>
            <Label>
              <Checkbox
                id={index}
                name={index}
                checked={checkboxValue}
                onChange={e => {
                  setCheckboxValue(e.target.checked);
                  store.updateKeyElementStatus(element.id, e.target.checked);
                }}
              />
            </Label>
          </CheckboxContainer>

          <KeyElementStyledContentEditable
            html={element.value}
            disabled={currentUser.id != object.ownedById}
            onChange={e => store.updateKeyElementValue(element.id, e.target.value)}
            onBlur={() => store.updateAnnualInitiative()}
          />
        </KeyElementContainer>
      );
    });
  };

  const tabClicked = (index: number): void => {
    if (index == selectedContextTab) {
      setHideContent(!hideContent);
    } else {
      setHideContent(false);
      setSelectedContextTab(index);
    }
  };

  return (
    <Container>
      <Tabs>
        <StyledTabList>
          <StyledTab onClick={() => tabClicked(1)}>
            <StyledTabTitle tabSelected={selectedContextTab == 1}>Importance </StyledTabTitle>
          </StyledTab>
          <StyledTab onClick={() => tabClicked(2)}>
            <StyledTabTitle tabSelected={selectedContextTab == 2}>Description</StyledTabTitle>
          </StyledTab>
          <StyledTab onClick={() => tabClicked(3)}>
            <StyledTabTitle tabSelected={selectedContextTab == 3}>Key Elements</StyledTabTitle>
          </StyledTab>
        </StyledTabList>

        <TabPanelContainer hideContent={hideContent}>
          <StyledTabPanel>{renderContextImportance()}</StyledTabPanel>
          <StyledTabPanel>{renderContextDescription()}</StyledTabPanel>
          <StyledTabPanel>{renderKeyElements()}</StyledTabPanel>
        </TabPanelContainer>
      </Tabs>
    </Container>
  );
};

const Container = styled.div``;

const ContextContainer = styled(HomeContainerBorders)`
  padding-left: 16px;
  padding-right: 16px;
`;

const SubHeaderText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

type TabPanelContainerType = {
  hideContent: boolean;
};

const TabPanelContainer = styled.div<TabPanelContainerType>`
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  margin-top: -20px;
  padding: 16px;
  border-top-left-radius: 0px;
  display: ${props => props.hideContent && "none"};
`;

const StyledTabList = styled(TabList)`
  padding-left: 0;
`;

const StyledTab = styled(Tab)`
  display: inline-block;
  border: 1px solid #e3e3e3;
  outline: none;
  border-bottom: none;
  margin-bottom: 3px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
  width: 140px;
  margin-right: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

type StyledTabTitleType = {
  tabSelected: boolean;
};

const StyledTabTitle = styled(Text)<StyledTabTitleType>`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  color: ${props =>
    props.tabSelected ? props.theme.colors.primary100 : props.theme.colors.grey80};
`;

const StyledTabPanel = styled(TabPanel)``;

const ContextImportanceContainer = styled.div`
  margin-top: -8px;
`;

const KeyElementContainer = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const KeyElementContextContainer = styled(ContextContainer)`
  width: 100%;
`;

const KeyElementText = styled(Text)`
  margin-top: 4px;
  margin-bottom: 4px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
`;

const KeyElementStyledContentEditable = styled(StyledContentEditable)`
  width: 100%;
`;
