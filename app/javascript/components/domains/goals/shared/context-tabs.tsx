import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect, useRef } from "react";
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

    const tabDefaultIndex = () => {
      if (
        (type == "annualInitiative" && R.length(R.path(["quarterlyGoals"], object)) == 0) ||
        (type == "quarterlyGoal" && R.length(R.path(["milestones"], object)) == 0)
      ) {
        return 2;
      } else {
        return 0;
      }
    };

    const currentUser = sessionStore.profile;
    const [selectedContextTab, setSelectedContextTab] = useState<number>(tabDefaultIndex() + 1);
    const [hideContent, setHideContent] = useState<boolean>(false);
    const [store, setStore] = useState<any>(null);
    const [focusOnLastInput, setFocusOnLastInput] = useState<boolean>(false);
    const editable = currentUser.id == object.ownedById;

    const firstImportanceRef = useRef(null);
    const secondImportanceRef = useRef(null);
    const thirdImportanceRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
      if (type == "annualInitiative") {
        setStore(annualInitiativeStore);
      } else if (type == "quarterlyGoal") {
        setStore(quarterlyGoalStore);
      }
    }, []);

    const updateImportance = (index: number, value: string): void => {
      let objectToBeModified = R.clone(object);
      objectToBeModified.importance[index] = value;
      store.updateModelField("importance", objectToBeModified.importance);
    };

    const updateContentEditable = () => {
      //CHRIS' NOTE: We need to use a separate function with the if statement below because when ref is calling blur, the local states get reset and store is now empty.
      //             Hence the need to use a separate function to update the store.
      if (type == "annualInitiative") {
        annualInitiativeStore.update();
      } else if (type == "quarterlyGoal") {
        quarterlyGoalStore.update();
      }
    };

    const renderContextImportance = () => {
      return (
        <ContextImportanceContainer>
          <SubHeaderText text={"Why is it important?"} />
          <StyledContentEditable
            innerRef={firstImportanceRef}
            html={object.importance[0]}
            disabled={!editable}
            onChange={e => {
              if (!e.target.value.includes("<div>")) {
                updateImportance(0, e.target.value);
              }
            }}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                firstImportanceRef.current.blur();
              }
            }}
            onBlur={() => updateContentEditable()}
          />
          <SubHeaderText text={"What are the consequences if missed?"} />
          <StyledContentEditable
            innerRef={secondImportanceRef}
            html={object.importance[1]}
            disabled={!editable}
            onChange={e => {
              if (!e.target.value.includes("<div>")) {
                updateImportance(1, e.target.value);
              }
            }}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                secondImportanceRef.current.blur();
              }
            }}
            onBlur={() => updateContentEditable()}
          />
          <SubHeaderText text={"How will we celebrate when achieved?"} />
          <StyledContentEditable
            innerRef={thirdImportanceRef}
            html={object.importance[2]}
            disabled={!editable}
            onChange={e => {
              if (!e.target.value.includes("<div>")) {
                updateImportance(2, e.target.value);
              }
            }}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                thirdImportanceRef.current.blur();
              }
            }}
            onBlur={() => updateContentEditable()}
          />
        </ContextImportanceContainer>
      );
    };

    const renderContextDescription = () => {
      return (
        <StyledContentEditable
          innerRef={descriptionRef}
          html={object.contextDescription}
          disabled={!editable}
          onChange={e => {
            if (!e.target.value.includes("<div>")) {
              store.updateModelField("contextDescription", e.target.value);
            }
          }}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              descriptionRef.current.blur();
            }
          }}
          onBlur={() => updateContentEditable()}
        />
      );
    };

    const renderKeyElements = () => {
      return object.keyElements.map((element, index) => {
        const lastKeyElement = index == object.keyElements.length - 1;
        return (
          <KeyElement
            element={element}
            store={store}
            editable={editable}
            key={index}
            lastKeyElement={lastKeyElement}
            focusOnLastInput={focusOnLastInput}
            setFocusOnLastInput={setFocusOnLastInput}
          />
        );
      });
    };

    const tabClicked = (index: number): void => {
      setFocusOnLastInput(false);
      if (index == selectedContextTab) {
        setHideContent(!hideContent);
      } else {
        setHideContent(false);
        setSelectedContextTab(index);
      }
    };

    return (
      <Container>
        <Tabs defaultIndex={tabDefaultIndex()}>
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
                    variant={"grey"}
                    onClick={() => {
                      store.createKeyElement().then(() => {
                        setFocusOnLastInput(true);
                      });
                    }}
                  >
                    <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
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

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddKeyElementText = styled.p`
  margin-left: 16px;
`;
