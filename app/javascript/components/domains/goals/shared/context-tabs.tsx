import * as React from "react";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { baseTheme } from "~/themes/base";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ContentEditable from "react-contenteditable";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "~/types/quarterly-goal";
import { KeyElement } from "./key-element";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import {
  KeyElementContentContainer,
  KeyElementsTabContainer,
  KeyElementsFormHeader,
  KeyElementFormBackButtonContainer,
} from "./key-elements/key-element-containers";
import { KeyElementForm } from "./key-element-form";
import { KeyElementModal } from "./key-element-modal";
import { RoundButton, Text, TextDiv } from "~/components/shared";
import "react-tabs/style/react-tabs.css";
import { JsxElement } from "typescript";

interface IContextTabsProps {
  object: AnnualInitiativeType | QuarterlyGoalType;
  type: string;
  disabled?: boolean;
  setShowInitiatives?: Dispatch<SetStateAction<boolean>>;
  setShowMilestones?: Dispatch<SetStateAction<boolean>>;
  activeInitiatives?: number;
}

export const ContextTabs = observer(
  ({
    object,
    type,
    disabled,
    setShowInitiatives,
    setShowMilestones,
    activeInitiatives,
  }: IContextTabsProps): JSX.Element => {
    const {
      sessionStore,
      annualInitiativeStore,
      quarterlyGoalStore,
      subInitiativeStore,
    } = useMst();

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
    const [showActionType, setActionType] = useState<string>("Add");
    const [hideContent, setHideContent] = useState<boolean>(false);
    const [store, setStore] = useState<any>(null);
    const [selectedElement, setSelectedElement] = useState<number>(null);
    const [focusOnLastInput, setFocusOnLastInput] = useState<boolean>(false);
    const [showKeyElementForm, setShowKeyElementForm] = useState<boolean>(false);
    const editable = currentUser.id == object.ownedById && !disabled;
    const [activeTab, setActiveTab] = useState(type == "quarterlyGoal" ? "milestones" : "aligned initiatives");
    const [componentToRender, setComponentToRender] = useState(null);

    const firstImportanceRef = useRef(null);
    const secondImportanceRef = useRef(null);
    const thirdImportanceRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
      if (type == "annualInitiative") {
        setStore(annualInitiativeStore);
      } else if (type == "quarterlyGoal") {
        setStore(quarterlyGoalStore);
      } else if (type == "subInitiative") {
        setStore(subInitiativeStore);
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
      } else if (type == "subInitiative") {
        subInitiativeStore.update();
      }
    };

    const renderContextImportance = () => {
      return (
        <ContextImportanceContainer>
          <SubHeaderText text={"Why is it important?"} />
          <StyledContentEditable
            innerRef={firstImportanceRef}
            placeholder={"Type here..."}
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
            placeholder={"Type here..."}
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
            placeholder={"Type here..."}
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
        <ContextDescriptionContainer>
          <StyledContentEditable
            innerRef={descriptionRef}
            html={object.contextDescription}
            placeholder={"Type here..."}
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
        </ContextDescriptionContainer>
      );
    };

    const renderContextKeyElements = () => {
      return showKeyElementForm ? (
        <KeyElementModal
          modalOpen={showKeyElementForm}
          setModalOpen={setShowKeyElementForm}
          action={showActionType}
          setActionType={setActionType}
          store={store}
          type={type}
          element={selectedElement}
          setSelectedElement={setSelectedElement}
        />
      ) : (
        <KeyElementsTabContainer>
          {object.keyElements.length > 0 && (
            <KeyElementContentContainer>{renderKeyElementsIndex()}</KeyElementContentContainer>
          )}
          {editable && (
            <ButtonContainer
              onClick={() => {
                setShowKeyElementForm(true);
              }}
            >
              <RoundButton backgroundColor={"primary100"} size={"32px"}>
                <Icon
                  icon={"Plus"}
                  size={"16px"}
                  iconColor={baseTheme.colors.white}
                  style={{ marginLeft: "8px", marginTop: "8px" }}
                />
              </RoundButton>
              <TextDiv color={"primary100"} fontSize={"16px"} ml={"8px"}>
                Add a Key Result
              </TextDiv>
            </ButtonContainer>
          )}
        </KeyElementsTabContainer>
      );
    };

    const renderKeyElementsIndex = () => {
      return object.keyElements.map((element, index) => {
        const lastKeyElement = index == object.keyElements.length - 1;
        return (
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

    const initiativeTab = type == "annualInitiative" ? `Quartely Initiatives` : `Milestones`;

    return (
      <Container>
        {/* <Tabs defaultIndex={tabDefaultIndex()}>
          <StyledTabList>
            <StyledTab onClick={() => tabClicked(1)}>
              <StyledTabTitle tabSelected={selectedContextTab == 1}>Importance </StyledTabTitle>
            </StyledTab>
            <StyledTab onClick={() => tabClicked(2)}>
              <StyledTabTitle tabSelected={selectedContextTab == 2}>Description</StyledTabTitle>
            </StyledTab>
            <StyledTab onClick={() => tabClicked(3)}>
              <StyledTabTitle tabSelected={selectedContextTab == 3}>Key Results</StyledTabTitle>
            </StyledTab>
          </StyledTabList>

          <TabPanelContainer hideContent={hideContent}>
            <StyledTabPanel>{renderContextImportance()}</StyledTabPanel>
            <StyledTabPanel>{renderContextDescription()}</StyledTabPanel>
            <StyledTabPanel style={{ padding: "0px" }}>{renderContextKeyElements()}</StyledTabPanel>
          </TabPanelContainer>
        </Tabs> */}
        <OverviewTabsContainer>
          {type == "quarterlyGoal" ? (
            <>
              <OverviewTabs
                active={activeTab === "milestones" ? true : false}
                onClick={() => {
                  setActiveTab("milestones");
                  setComponentToRender(null);
                  setShowInitiatives(false);
                  setShowMilestones(true);
                }}
              >
                {`Milestones ${activeInitiatives > 0 ? `(${activeInitiatives})` : ""}`}
              </OverviewTabs>
            </>
          ) : (
            <OverviewTabs
              active={activeTab === "aligned initiatives" ? true : false}
              onClick={() => {
                setActiveTab("aligned initiatives");
                setComponentToRender(null);
                setShowInitiatives(true);
              }}
            >
              {`${initiativeTab} ${activeInitiatives > 0 ? `(${activeInitiatives})` : ""}`}
            </OverviewTabs>
          )}
          <OverviewTabs
            active={activeTab === "key results" ? true : false}
            onClick={() => {
              setActiveTab("key results");
              setComponentToRender(renderContextKeyElements());
              setShowInitiatives(false);
              setShowMilestones(false);
            }}
          >
            Key Results
          </OverviewTabs>
          {type == "quarterlyGoal" && (
            <OverviewTabs
              active={activeTab === "aligned initiatives" ? true : false}
              onClick={() => {
                setActiveTab("aligned initiatives");
                setComponentToRender(null);
                setShowInitiatives(true);
                setShowMilestones(false);
              }}
            >
              Supporting Initiatives
            </OverviewTabs>
          )}
        </OverviewTabsContainer>
        <Container>{componentToRender}</Container>
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
  padding: 16px;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    cursor: ${props => (!props.disabled ? "text" : "default")};
  }
`;

const ButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ContextDescriptionContainer = styled.div`
  padding: 16px;
`;

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey40};
  &: hover {
    color: ${props => props.theme.colors.greyActive};
  }
`;

type IOverviewTabs = {
  active: boolean;
};

export const OverviewTabs = styled("span")<IOverviewTabs>`
  margin-bottom: 0;
  padding: 0 15px;
  padding-bottom: 5px;
  color: ${props => (props.active ? props.theme.colors.black : props.theme.colors.greyInactive)};
  font-size: 15px;
  font-weight: bold;
  line-height: 28px;
  text-decoration: none;
  border-bottom-width: ${props => (props.active ? `1px` : `0px`)};
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
`;

export const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  margin-bottom: 24px;
`;
