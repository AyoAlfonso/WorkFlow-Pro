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
  KeyElementsFormHeader,
  KeyElementFormBackButtonContainer,
} from "./key-elements/key-element-containers";
import { KeyElementForm } from "./key-element-form";
import { KeyElementModal } from "./key-element-modal";
import { Text, TextDiv } from "~/components/shared";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";
import { HtmlTooltip } from "~/components/shared/tooltip";
import { DateSelector } from "./date-selector";
import { set } from "immutable";
import { sortByDate } from "~/utils/sorting";

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
    const { t } = useTranslation();
    const {
      sessionStore,
      annualInitiativeStore,
      quarterlyGoalStore,
      subInitiativeStore,
      companyStore,
    } = useMst();

    const { company } = companyStore;

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

    const defaultActiveTab = () => {
      if (company?.objectivesKeyType === "KeyResults") {
        setShowMilestones && setShowMilestones(false);
        type == "subInitiative" && setShowInitiatives(false);
        if (type == "quarterlyGoal" || type == "subInitiative") {
          return "key results";
        } else {
          return "aligned initiatives";
        }
      } else {
        if (type == "quarterlyGoal") {
          return "milestones";
        } else {
          return "aligned initiatives";
        }
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
    const editable = currentUser?.id == object.ownedById && !disabled;
    const [activeTab, setActiveTab] = useState(defaultActiveTab());
    const [selectedDate, setSelectedDate] = useState<any>(new Date());
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

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
      return (
        <KeyElementsTabContainer>
          {object?.keyElements.length > 0 && (
            <KeyElementContentContainer>{renderKeyElementsIndex()}</KeyElementContentContainer>
          )}
          {editable && (
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
          )}
        </KeyElementsTabContainer>
      );
    };

    const renderKeyElementsIndex = () => {
      let initiative;

      if (type != "annualInitiative") {
        initiative = object;
      }

      const minDate = initiative?.milestones[0]?.weekOf;
      return (
        <>
          {type === "annualInitiative" ? (
            <></>
          ) : (
            <DateContainer>
              <HtmlTooltip
                arrow={true}
                open={showTooltip}
                enterDelay={500}
                leaveDelay={200}
                title={<span>{t<string>("keyElement.dateToolTip")}</span>}
              >
                <DateDiv
                  onMouseEnter={() => {
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setShowTooltip(false);
                  }}
                >
                  <DateText>Date</DateText>
                  <DateSelector
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    minDate={minDate}
                  />
                </DateDiv>
              </HtmlTooltip>
            </DateContainer>
          )}
          {object?.keyElements.map((element, index) => {
            const lastKeyElement = index == object?.keyElements.length - 1;
            return (
              <KeyElement
                elementId={element.id}
                store={store}
                editable={true}
                key={element.id}
                lastKeyElement={lastKeyElement}
                focusOnLastInput={focusOnLastInput}
                type={type}
                setShowKeyElementForm={setShowKeyElementForm}
                setActionType={setActionType}
                setSelectedElement={setSelectedElement}
                date={selectedDate}
                initiativeId={object.id}
                object={object}
              />
            );
          })}
        </>
      );
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
        {showKeyElementForm && (
          <KeyElementModal
            modalOpen={showKeyElementForm}
            setModalOpen={setShowKeyElementForm}
            action={showActionType}
            setActionType={setActionType}
            store={store}
            type={type}
            element={selectedElement}
            setSelectedElement={setSelectedElement}
            item={type === "annualInitiative" ? null : object}
          />
        )}
        <OverviewTabsContainer>
          {type == "quarterlyGoal" ? (
            <>
              {company?.objectivesKeyType != "KeyResults" && (
                <OverviewTabs
                  active={activeTab === "milestones" ? true : false}
                  onClick={() => {
                    setActiveTab("milestones");
                    setShowInitiatives(false);
                    setShowMilestones(true);
                  }}
                >
                  Milestones
                </OverviewTabs>
              )}
            </>
          ) : type === "subInitiative" && company?.objectivesKeyType == "KeyResults" ? (
            <></>
          ) : (
            <OverviewTabs
              active={activeTab === "aligned initiatives" ? true : false}
              onClick={() => {
                setActiveTab("aligned initiatives");
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
              setShowInitiatives(false);
              setShowMilestones && setShowMilestones(false);
            }}
          >
            Key Results
          </OverviewTabs>
          {type == "quarterlyGoal" && (
            <OverviewTabs
              active={activeTab === "aligned initiatives" ? true : false}
              onClick={() => {
                setActiveTab("aligned initiatives");
                setShowInitiatives(true);
                setShowMilestones(false);
              }}
            >
              {`Supporting Initiatives ${activeInitiatives > 0 ? `(${activeInitiatives})` : ""}`}
            </OverviewTabs>
          )}
        </OverviewTabsContainer>
        <Container>{activeTab === "key results" && renderContextKeyElements()}</Container>
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

const StyledButton = styled(Button)`
  display: flex;
  visibility: hidden;
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

const KeyElementsTabContainer = styled.div`
  height: 100%;
  width: 100%;
  &: hover ${StyledButton} {
    visibility: visible;
  };
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
  cursor: pointer;
`;

export const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  margin-bottom: 24px;
`;

const DateContainer = styled.div`
  margin-bottom: 60px;
  margin-top: -30px;
  width: fit-content;
`;

const DateText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const DateDiv = styled.div`
  position: relative;
`;
