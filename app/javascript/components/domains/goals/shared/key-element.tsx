import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { KeyElementsDropdownOptions } from "./key-elements/key-elements-options";
import { Checkbox, Label } from "@rebass/forms";
import ContentEditable from "react-contenteditable";
import { baseTheme } from "~/themes";
import { StripedProgressBar } from "~/components/shared/progress-bars";
import { Icon, Loading } from "~/components/shared";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";

interface IKeyElementProps {
  elementId: number;
  store: any;
  editable: boolean;
  lastKeyElement: boolean;
  focusOnLastInput: boolean;
  type: string;
  setShowKeyElementForm: any;
  setActionType: any;
  setSelectedElement: any;
  // TODO: set correct type
}

export const KeyElement = observer(
  ({
    elementId,
    store,
    editable,
    lastKeyElement,
    focusOnLastInput,
    type,
    setShowKeyElementForm,
    setActionType,
    setSelectedElement,
  }: IKeyElementProps): JSX.Element => {
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    const [element, setElement] = useState<any>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const { annualInitiativeStore, quarterlyGoalStore, subInitiativeStore } = useMst();
    const optionsRef = useRef(null);
    const keyElementTitleRef = useRef(null);
    const keyElementCompletionTargetRef = useRef(null);

    const getElement = () => {
      let item;
      if (type == "annualInitiative") {
        item = annualInitiativeStore.annualInitiative.keyElements.find(ke => ke.id == elementId);
      } else if (type == "quarterlyGoal") {
        item = quarterlyGoalStore.quarterlyGoal.keyElements.find(ke => ke.id == elementId);
      } else if (type == "subInitiative") {
        item = subInitiativeStore.subInitiative.keyElements.find(ke => ke.id == elementId);
      }
      setElement(item);
      setCheckboxValue(item["completedAt"] ? true : false);
    };

    useEffect(() => {
      if (lastKeyElement && editable && focusOnLastInput) {
        keyElementTitleRef.current.focus();
      }
      getElement();
    }, [focusOnLastInput, optionsRef]);

    if (!element) {
      return <Loading />;
    }

    // Equation for calculating progress when target>starting current: (current - starting) / target
    // Equation for calculating progress when target<starting current: (starting - current) / target

    const completion = () => {
      const starting = element.completionStartingValue;
      const target = element.completionTargetValue;
      const current =
        element.completionCurrentValue == ""
          ? element.completionStartingValue
          : element.completionCurrentValue;

      if (element.greaterThan === 1) {
        return (current / target) * 100;
      } else {
        return current <= target ? 100 : ((target - current) / target) * 100;
      }
    };

    const completionSymbol = () => {
      switch (element.completionType) {
        case "percentage":
          return "%";
        case "currency":
          return "$";
        default:
          return "";
      }
    };

    const sanitize = html => {
      const result = R.pipe(
        R.replace(/<div>/g, ""),
        R.replace(/<\/div>/g, ""),
        R.replace(/<br>/g, ""),
      )(html);
      return result;
    };

    const renderElementCompletionTargetValue = () => {
      if (element.completionType == "currency") {
        return `/ ${completionSymbol()}${element.completionTargetValue}`;
      } else {
        return `/ ${element.completionTargetValue}${completionSymbol()}`;
      }
    };

    return (
      <KeyElementContainer>
        {element.completionType === "binary" && (
          <CheckboxContainer>
            <Label>
              <Checkbox
                id={element.id}
                name={element.id}
                checked={checkboxValue}
                onChange={e => {
                  setCheckboxValue(e.target.checked);
                  store.updateKeyElementStatus(element.id, e.target.checked);
                }}
                sx={{
                  color: baseTheme.colors.primary100,
                }}
              />
            </Label>
          </CheckboxContainer>
        )}
        <ContentContainer>
          <KeyElementStyledContentEditable
            innerRef={keyElementTitleRef}
            html={sanitize(element.value)}
            disabled={!editable}
            onChange={e => {
              if (!e.target.value.includes("<div>")) {
                store.updateKeyElementValue("value", element.id, e.target.value);
              }
            }}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                keyElementTitleRef.current.blur();
              }
            }}
            onBlur={() => store.update()}
            completed={checkboxValue.toString()} //CHRIS' NOTE: YOU CANT PASS A BOOLEAN VALUE INTO STYLED COMPONENTS.
            placeholder={"Title..."}
          />
          {element.completionType !== "binary" && (
            <CompletionContainer>
              <ProgressContainer>
                <StyledContentEditable
                  innerRef={keyElementCompletionTargetRef}
                  html={sanitize(`${element.completionCurrentValue}`)}
                  disabled={!editable}
                  onChange={e => {
                    if (!e.target.value.includes("<div>")) {
                      store.updateKeyElementValue(
                        "completionCurrentValue",
                        element.id,
                        e.target.value == "" ? "" : parseInt(e.target.value),
                      );
                    }
                  }}
                  onKeyDown={key => {
                    if (key.keyCode == 13) {
                      keyElementCompletionTargetRef.current.blur();
                    }
                  }}
                  onBlur={() => store.update()}
                  placeholder={element.completionType == "numerical" ? "..." : completionSymbol()}
                />
                <CompletionTextContainer>
                  {renderElementCompletionTargetValue()}
                </CompletionTextContainer>
              </ProgressContainer>
              <ProgressBarContainer>
                <StripedProgressBar variant={"primary"} completed={completion()} />
              </ProgressBarContainer>
            </CompletionContainer>
          )}
        </ContentContainer>
        {/* <OptionsButtonContainer> */}
        {/* <StyledIcon icon={"Delete"} size={"12px"} /> */}

        <IconWrapper
          onClick={e => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
        >
          <Icon icon={"Options"} size={"16px"} iconColor={"grey60"} />
        </IconWrapper>
        {showOptions && (
          <KeyElementsDropdownOptions
            element={element}
            setShowDropdownOptions={setShowOptions}
            showOptions={showOptions}
            setShowKeyElementForm={setShowKeyElementForm}
            setActionType={setActionType}
            setSelectedElement={setSelectedElement}
            store={store}
          />
        )}
        {/* </OptionsButtonContainer> */}
      </KeyElementContainer>
    );
  },
);

const KeyElementContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 24px;
`;

const ContentContainer = styled.div`
  width: -webkit-fill-available;
  margin-right: 36px;
  width: 90%;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: 6px;
  width: 40px;
`;

const OptionsButtonContainer = styled.div`
  position: absolute;
  margin-top: 5px;
  right: 0;
  top: 0;
  &:hover {
    cursor: pointer;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  box-sizing: border-box;
  /* width: 100%; */
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
`;

type KeyElementStyledContentEditableType = {
  completed: string;
};

const KeyElementStyledContentEditable = styled(StyledContentEditable)<
  KeyElementStyledContentEditableType
>`
  width: 100%;
  text-decoration: ${props => (props.completed == "true" ? "line-through" : "")};
`;

const CompletionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
`;

const CompletionTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  margin-left: 8px;
  margin-right: 16px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 25%;
`;

const ProgressBarContainer = styled.div`
  width: 75%;
`;

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey40};
  &: hover {
    color: ${props => props.theme.colors.greyActive};
  }
`;

// TODO: Move to shared styling folder

const IconWrapper = styled.div`
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  align-self: flex-start;
  // width: 10%;
  margin-left: auto;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;
