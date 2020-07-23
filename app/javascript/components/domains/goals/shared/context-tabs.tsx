import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import * as R from "ramda";
import { KeyElement } from "./key-element";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";

interface IContextTabsProps {
  object: AnnualInitiativeType | QuarterlyGoalType;
  type: string;
}

export const ContextTabs = observer(
  ({ object, type }: IContextTabsProps): JSX.Element => {
    const { sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
    const currentUser = sessionStore.profile;
    const [selectedContextTab, setSelectedContextTab] = useState<number>(1);
    const [hideContent, setHideContent] = useState<boolean>(false);
    const [store, setStore] = useState<any>(null);
    const editable = currentUser.id == object.ownedById;

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
          <SubHeaderText text={"Why is it important?"} />
          <StyledContentEditable
            html={object.importance[0]}
            disabled={!editable}
            onChange={e => updateImportance(0, e.target.value)}
            onBlur={() => store.update()}
          />
          <SubHeaderText text={"What are the consequences if missed?"} />
          <StyledContentEditable
            html={object.importance[1]}
            disabled={!editable}
            onChange={e => updateImportance(1, e.target.value)}
            onBlur={() => store.update()}
          />
          <SubHeaderText text={"How will we celebrate if achieved?"} />
          <StyledContentEditable
            html={object.importance[2]}
            disabled={!editable}
            onChange={e => updateImportance(2, e.target.value)}
            onBlur={() => store.update()}
          />
        </ContextImportanceContainer>
      );
    };

    const renderContextDescription = () => {
      return (
        <StyledContentEditable
          html={object.contextDescription}
          disabled={!editable}
          onChange={e => store.updateModelField("contextDescription", e.target.value)}
          onBlur={() => store.update()}
        />
      );
    };

    const renderKeyElements = () => {
      return object.keyElements.map((element, index) => {
        return <KeyElement element={element} store={store} editable={editable} key={index} />;
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
            <StyledTabPanel>
              {renderKeyElements()}
              {editable && (
                <ButtonContainer>
                  <StyledButton
                    small
                    variant={"primaryOutline"}
                    onClick={() => {
                      store.createKeyElement();
                    }}
                  >
                    <Icon icon={"Plus"} size={"20px"} />
                    <AddKeyElementText>Add Key Element</AddKeyElementText>
                  </StyledButton>
                </ButtonContainer>
              )}
            </StyledTabPanel>
          </TabPanelContainer>
        </Tabs>
      </Container>
    );
  },
);

const Container = styled.div``;

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

const ButtonContainer = styled.div`
  margin-top: 24px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddKeyElementText = styled.p`
  margin-left: 16px;
`;
