import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
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
}

export const KeyElement = observer(
  ({
    elementId,
    store,
    editable,
    lastKeyElement,
    focusOnLastInput,
    type,
  }: IKeyElementProps): JSX.Element => {
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    const [element, setElement] = useState<any>(null);

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
      const current = element.completionCurrentValue;

      if (target >= starting) {
        return Math.min(Math.max(current - starting, 0) / (target - starting), 1) * 100;
      } else {
        return Math.min(Math.max(starting - current, 0) / (starting - target), 1) * 100;
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
                        parseInt(e.target.value),
                      );
                    }
                  }}
                  onKeyDown={key => {
                    if (key.keyCode == 13) {
                      keyElementCompletionTargetRef.current.blur();
                    }
                  }}
                  onBlur={() => store.update()}
                  placeholder={completionSymbol()}
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
        <OptionsButtonContainer
          onClick={() => {
            if (confirm(`Are you sure you want to delete this key result?`)) {
              store.deleteKeyElement(element.id);
            }
          }}
        >
          <StyledIcon icon={"Delete"} size={"12px"} />
        </OptionsButtonContainer>
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
