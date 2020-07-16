import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Checkbox, Label } from "@rebass/forms";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "~/types/quarterly-goal";

interface IContextTabsProps {
  object: AnnualInitiativeType | QuarterlyGoalType;
}

export const ContextTabs = ({ object }: IContextTabsProps): JSX.Element => {
  const [selectedContextTab, setSelectedContextTab] = useState<number>(1);

  const renderContextImportance = () => {
    return (
      <ContextImportanceContainer>
        <SubHeaderText> Why is it important?</SubHeaderText>
        <ContextContainer>
          <Text>{object.importance[0]}</Text>
        </ContextContainer>
        <SubHeaderText> What are the consequences if missed?</SubHeaderText>
        <ContextContainer>
          <Text>{object.importance[1]}</Text>
        </ContextContainer>
        <SubHeaderText> How will we celebrate if achieved?</SubHeaderText>
        <ContextContainer>
          <Text>{object.importance[2]}</Text>
        </ContextContainer>
      </ContextImportanceContainer>
    );
  };

  const renderContextDescription = () => {
    return (
      <ContextContainer>
        <Text>{object.contextDescription}</Text>
      </ContextContainer>
    );
  };

  const renderKeyElements = () => {
    return object.keyElements.map((element, index) => {
      return (
        <KeyElementContainer key={index}>
          <CheckboxContainer>
            <Label>
              <Checkbox
                id={index}
                name={index}
                // checked={element["completedAt"] ? true : false}
                // onChange={e => {
                //   console.log("e", e.target.checked);
                // }}
              />
            </Label>
          </CheckboxContainer>

          <KeyElementContextContainer>
            <KeyElementText>{element.value}</KeyElementText>
          </KeyElementContextContainer>
        </KeyElementContainer>
      );
    });
  };

  return (
    <Container>
      <Tabs>
        <StyledTabList>
          <StyledTab onClick={() => setSelectedContextTab(1)}>
            <StyledTabTitle tabSelected={selectedContextTab == 1}>Importance </StyledTabTitle>
          </StyledTab>
          <StyledTab onClick={() => setSelectedContextTab(2)}>
            <StyledTabTitle tabSelected={selectedContextTab == 2}>Description</StyledTabTitle>
          </StyledTab>
          <StyledTab onClick={() => setSelectedContextTab(3)}>
            <StyledTabTitle tabSelected={selectedContextTab == 3}>Key Elements</StyledTabTitle>
          </StyledTab>
        </StyledTabList>

        <TabPanelContainer>
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
  margin-left: 20px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
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
