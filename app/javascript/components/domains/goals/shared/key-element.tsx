/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
import {
  Avatar,
  ChevronDownIcon,
  Icon,
  Loading,
  UserSelectionDropdownList,
} from "~/components/shared";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";
import { useTranslation } from "react-i18next";
import { FormElementContainer, InputFromUnitType } from "../../scorecard/shared/modal-elements";
import moment from "moment";
import { getWeekOf } from "~/utils/date-time";
import { getDerviedStatus } from "~/utils/get-derived-status";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import { HtmlTooltip } from "~/components/shared/tooltip";

interface IKeyElementProps {
  elementId?: number;
  store?: any;
  editable: boolean;
  lastKeyElement?: boolean;
  focusOnLastInput?: boolean;
  type: string;
  setShowKeyElementForm?: any;
  setActionType?: any;
  setSelectedElement?: any;
  date?: any;
  initiativeId?: number;
  keyElement?: any;
  targetValueMargin?: string;
  object?: any;
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
    initiativeId,
    keyElement,
    targetValueMargin,
    object,
    date,
  }: IKeyElementProps): JSX.Element => {
    const {
      annualInitiativeStore,
      quarterlyGoalStore,
      subInitiativeStore,
      companyStore,
      sessionStore,
      keyElementStore,
      userStore,
    } = useMst();
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    const [element, setElement] = useState<any>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showList, setShowList] = useState<boolean>(false);
    const [showUsersList, setShowUsersList] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>(sessionStore.profile);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    const { t } = useTranslation();

    const optionsRef = useRef(null);
    const keyElementTitleRef = useRef(null);
    const keyElementCompletionTargetRef = useRef(null);
    const dropdownRef = useRef<HTMLInputElement>(null);

    const company = companyStore.company;

    const getElement = () => {
      let item;
      if (type == "annualInitiative") {
        item = annualInitiativeStore.annualInitiative.keyElements.find(ke => ke.id == elementId);
      } else if (type == "quarterlyGoal") {
        item = quarterlyGoalStore.quarterlyGoal.keyElements.find(ke => ke.id == elementId);
      } else if (type == "subInitiative") {
        item = subInitiativeStore.subInitiative.keyElements.find(ke => ke.id == elementId);
      } else if (type == "checkIn") {
        item = keyElementStore.keyElementsForWeeklyCheckin.find(ke => ke.id == elementId);
      } else if (type == "onboarding" || type == "test") {
        item = keyElement;
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

    useEffect(() => {
      if (element) {
        const owner = userStore.users.find(user => user.id == element?.ownedById);
        setSelectedUser(owner || sessionStore.profile);
      }
    }, [element?.ownedById]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showList) return;

        const node = dropdownRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowList(false);
      };

      if (showList) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showList]);

    useEffect(() => {
      if (type == "quarterlyGoal" || type == "subInitiative" || type !== "checkIn") {
        resetStatus();
      }
    }, [element, type]);

    const isLogRecent = () => {
      if (type == "onboarding") {
        return false;
      }
      const recentLogDate =
        moment(element.objectiveLogs[element.objectiveLogs?.length - 1]?.createdAt).format(
          "YYYY-MM-DD",
        ) || null;
      const currentWeekOf = getWeekOf();
      if (!recentLogDate) return false;
      if (!element.objectiveLogs[element.objectiveLogs?.length - 1]) {
        return false;
      }
      if (recentLogDate === currentWeekOf) {
        return true;
      } else {
        return moment(currentWeekOf).isBefore(recentLogDate);
      }
    };

    const updateKeyElement = async (ownedBy, showMessage = false) => {
      const keyElementParams = {
        value: element.value,
        completionType: element.completionType,
        completionTargetValue: element.completionTargetValue,
        greaterThan: element.greaterThan,
        ownedBy: ownedBy,
        completionCurrentValue: element.completionCurrentValue,
        status: element.status,
      };
      let id;

      if (type == "annualInitiative") {
        id = store.annualInitiative.id;
      } else if (type == "quarterlyGoal") {
        id = store.quarterlyGoal.id;
      } else if (type == "subInitiative") {
        id = store.subInitiative.id;
      }
      const res =
        (await type) == "checkIn"
          ? store.updateKeyElement(element.id, {
              value: element.value,
              status: element.status,
              completionCurrentValue: element.completionCurrentValue,
            })
          : store.updateKeyElement(id, element.id, keyElementParams);
      if (res && showMessage) {
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
      }
      return res;
    };

    const resetStatus = async () => {
      if (!element || element.status == "unstarted" || type == "onboarding") return;
      const isUpdated = isLogRecent();
      if (isUpdated) {
        return;
      } else {
        store?.updateKeyElementValue("status", element?.id, "unstarted");
        await updateKeyElement(selectedUser.id, false);
      }
    };

    if (!element) {
      return <></>;
    }

    const parseTarget = target => {
      let val = target.toString();
      if (val?.includes("$")) {
        val = val.split("$")[1];
      }
      if (val?.includes(",")) {
        val = val.split(",").join("");
      }
      return Number(val);
    };

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
        return Math.min(Math.max(current - starting, 0) / (target - starting), 1) * 100;
      } else {
        return current <= target
          ? 100
          : current >= target * 2
          ? 0
          : ((target + target - current) / target) * 100;
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
        return `${completionSymbol(element.completionType)}${element.completionTargetValue}`;
      } else {
        return `${element.completionTargetValue}${completionSymbol(element.completionType)}`;
      }
    };

    const statusArray = ["unstarted", "incomplete", "in_progress", "completed", "done"];

    const companyUsers = userStore.users;

    const renderUserSelectionList = (): JSX.Element => {
      return showUsersList ? (
        <div onClick={e => e.stopPropagation()}>
          <UserSelectionDropdownList
            userList={companyUsers}
            onUserSelect={updateOwnedById}
            setShowUsersList={setShowUsersList}
          />
        </div>
      ) : (
        <></>
      );
    };

    const typeForCheckIn = () => {
      if (element.elementableType === "QuarterlyGoal") {
        return "QuarterlyInitiative";
      } else if (element.elementableType === "SubInitiative") {
        return "SubInitiative";
      }
    };

    const getType = () => {
      let formattedType;
      if (type == "annualInitiative") {
        formattedType = "AnnualInitiative";
      } else if (type == "quarterlyGoal") {
        formattedType = "QuarterlyInitiative";
      } else if (type == "subInitiative") {
        formattedType = "SubInitiative";
      }
      return formattedType;
    };

    const checkWeekOf = () => {
      if (moment(date).format("MMM Do, YYYY") == moment(new Date()).format("MMM Do, YYYY")) {
        return getWeekOf();
      } else {
        return moment(date)
          .startOf("isoWeek")
          .format("YYYY-MM-DD");
      }
    };

    const createLog = () => {
      const objectiveLog = {
        ownedById: selectedUser.id,
        score: element.completionCurrentValue,
        note: "",
        objecteableId: type === "checkIn" ? element.elementableId : initiativeId,
        objecteableType: type === "checkIn" ? typeForCheckIn() : getType(),
        fiscalQuarter: company.currentFiscalQuarter,
        fiscalYear: company.currentFiscalYear,
        week: company.currentFiscalWeek,
        childType: "KeyElement",
        childId: element.id,
        status: element.status,
        weekOf: checkWeekOf(),
        adjustedDate: date,
      };

      store.createActivityLog(objectiveLog);
      company.objectivesKeyType === "KeyResults" && updateMilestoneStatus(objectiveLog.weekOf);
    };

    const updateOwnedById = newUser => {
      setSelectedUser(newUser);
      updateKeyElement(newUser.id, true);
    };

    const updateMilestoneStatus = async weekOf => {
      if (type == "checkIn") {
        const objectableType = typeForCheckIn();
        let initiative;
        let initiativeStore;

        if (objectableType === "QuarterlyInitiative") {
          initiativeStore = quarterlyGoalStore;
          initiative = await quarterlyGoalStore.getQuarterlyGoal(element.elementableId);
        } else {
          initiativeStore = subInitiativeStore;
          initiative = await subInitiativeStore.getSubInitiative(element.elementableId);
        }

        const milestoneForWeekOf =
          initiative.milestones.find(milestone => milestone.weekOf === weekOf) || null;

        if (milestoneForWeekOf) {
          const status = getDerviedStatus(initiative?.keyElements);
          initiativeStore.updateMilestoneStatus(milestoneForWeekOf.id, status);
        }
      } else {
        const milestoneForWeekOf =
          object?.milestones.find(milestone => milestone.weekOf === weekOf) || null;

        if (milestoneForWeekOf) {
          const status = getDerviedStatus(object?.keyElements);
          store.updateMilestoneStatus(milestoneForWeekOf.id, status);
        }
      }
    };

    const isEditable = async () => {
      if (type === "onboarding") return;
      if (type == "checkIn") {
        const objectableType = typeForCheckIn();
        let initiative;

        if (objectableType === "QuarterlyInitiative") {
          initiative = await quarterlyGoalStore.getQuarterlyGoal(element.elementableId);
        } else {
          initiative = await subInitiativeStore.getSubInitiative(element.elementableId);
        }

        if (
          company.currentFiscalYear <= initiative.fiscalYear &&
          company.currentFiscalQuarter < initiative.quarter
        ) {
          setDisabled(true);
          return true;
        }
      } else if (type !== "annualInitiative") {
        if (
          company.currentFiscalYear <= object.fiscalYear &&
          company.currentFiscalQuarter < object.quarter
        ) {
          setDisabled(true);
          return true;
        }
      } else if (type == "annualInitiative") {
        if (company.yearForCreatingAnnualInitiatives < object.fiscalYear) {
          setDisabled(true);
          return true;
        }
      }
    };

    const isOwner = element.ownedById == sessionStore.profile.id;

    return (
      <Container>
        <TopContainer>
          {type !== "checkIn" && (
            <AvatarContainer
              onBlur={() => updateKeyElement(selectedUser.id, true)}
              onClick={() => setShowUsersList(!showUsersList)}
            >
              <Avatar
                defaultAvatarColor={selectedUser?.defaultAvatarColor}
                avatarUrl={selectedUser?.avatarUrl}
                firstName={selectedUser?.firstName}
                lastName={selectedUser?.lastName}
                size={24}
                marginLeft={"auto"}
              />
            </AvatarContainer>
          )}
          <KeyElementStyledContentEditable
            innerRef={keyElementTitleRef}
            html={sanitize(element.value)}
            disabled={!editable || type == "checkIn" || !isOwner || disabled}
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
            onMouseEnter={async () => {
              await isEditable();
            }}
            onBlur={() => store.update()}
            completed={checkboxValue.toString()} //CHRIS' NOTE: YOU CANT PASS A BOOLEAN VALUE INTO STYLED COMPONENTS.
            placeholder={"Title..."}
          />
          <SelectionListContainer>{renderUserSelectionList()}</SelectionListContainer>
        </TopContainer>
        <KeyElementContainer>
          {element.completionType === "binary" && (
            <CompletionContainer>
              <HtmlTooltip
                arrow={true}
                open={showTooltip}
                enterDelay={500}
                leaveDelay={200}
                title={
                  <span>
                    {!isOwner
                      ? t(
                          "This Key Result doesn't belong to you. You can only update a Key Result that belong to you",
                        )
                      : t(`This Key Result is in the future. You can only update the status of Key Results
                    that have already begun.`)}
                  </span>
                }
              >
                <DropdownHeader
                  onClick={async () => {
                    const disabled = await isEditable();
                    setShowList(!disabled && editable && isOwner && !showList);
                  }}
                  onMouseEnter={async () => {
                    if (type == "onboarding") {
                      return;
                    }
                    const disabled = await isEditable();
                    setShowTooltip(!isOwner || (disabled && true));
                  }}
                  onMouseLeave={() => {
                    if (type == "onboarding") {
                      return;
                    }
                    setShowTooltip(false);
                  }}
                  ref={dropdownRef}
                  isLogRecent={isLogRecent()}
                >
                  {determineStatusLabel(element.status)}
                  <ChevronDownIcon />
                </DropdownHeader>
              </HtmlTooltip>
              {showList && (
                <DropdownListContainer>
                  <DropdownList>
                    {statusArray.map((status, index) => (
                      <StatusBadgeContainer
                        onClick={async () => {
                          store.updateKeyElementValue("status", element.id, status);
                          const res = await updateKeyElement(selectedUser.id, true);

                          if (res) {
                            createLog();
                          }
                          if (type == "checkin") {
                            setShowList(!showList);
                            return;
                          }
                          if (status === "done") {
                            store.updateKeyElementStatus(element.id, true);
                          } else {
                            store.updateKeyElementStatus(element.id, false);
                          }
                          setShowList(!showList);
                        }}
                        key={index}
                        value={status}
                      >
                        {determineStatusLabel(status)}
                      </StatusBadgeContainer>
                    ))}
                  </DropdownList>
                </DropdownListContainer>
              )}
            </CompletionContainer>
          )}
          <ContentContainer>
            {element.completionType !== "binary" && (
              <CompletionContainer>
                <HtmlTooltip
                  arrow={true}
                  open={showTooltip}
                  enterDelay={500}
                  leaveDelay={200}
                  title={
                    <span>
                      {!isOwner
                        ? t(
                            "This Key Result doesn't belong to you. You can only update a Key Result that belong to you",
                          )
                        : t(`This Key Result is in the future. You can only update the status of Key Results
                    that have already begun.`)}
                    </span>
                  }
                >
                  <DropdownHeader
                    onClick={async () => {
                      const disabled = await isEditable();
                      setShowList(!disabled && editable && isOwner && !showList);
                    }}
                    onMouseEnter={async () => {
                      if (type == "onboarding") {
                        return;
                      }
                      const disabled = await isEditable();
                      setShowTooltip(!isOwner || (disabled && true));
                    }}
                    onMouseLeave={() => {
                      setShowTooltip(false);
                    }}
                    ref={dropdownRef}
                    isLogRecent={isLogRecent()}
                  >
                    {determineStatusLabel(element.status)}
                    <ChevronDownIcon />
                  </DropdownHeader>
                </HtmlTooltip>
                {showList && (
                  <DropdownListContainer>
                    <DropdownList>
                      {statusArray.map((status, index) => (
                        <StatusBadgeContainer
                          onClick={async () => {
                            store.updateKeyElementValue("status", element.id, status);
                            const res = await updateKeyElement(selectedUser.id, true);

                            if (res) {
                              createLog();
                            }
                            setShowList(!showList);
                          }}
                          key={index}
                          value={status}
                        >
                          {determineStatusLabel(status)}
                        </StatusBadgeContainer>
                      ))}
                    </DropdownList>
                  </DropdownListContainer>
                )}
                <ValueInputContainer>
                  <InputContainer>
                    <InputFromUnitType
                      unitType={""}
                      placeholder="0"
                      onChange={e => {
                        store.updateKeyElementValue(
                          "completionCurrentValue",
                          element.id,
                          e.target.value == "" ? 0 : parseTarget(e.target.value),
                        );
                      }}
                      onMouseEnter={async () => {
                        if (type == "onboarding") {
                          return;
                        }
                        await isEditable();
                      }}
                      defaultValue={element.completionCurrentValue}
                      onBlur={() => {
                        updateKeyElement(selectedUser.id, false);
                        createLog();
                      }}
                      disabled={!editable || disabled || !isOwner}
                    />
                    <SymbolContainer>{completionSymbol(element.completionType)}</SymbolContainer>
                  </InputContainer>
                  <TargetValueContainer marginRight={targetValueMargin}>
                    <TargetValue>{`${renderElementCompletionTargetValue()}`}</TargetValue>
                  </TargetValueContainer>
                </ValueInputContainer>
                {type !== "onboarding" && type != "checkIn" && (
                  <ProgressBarContainer>
                    <StripedProgressBar variant={element.status} completed={completion()} />
                  </ProgressBarContainer>
                )}
              </CompletionContainer>
            )}
          </ContentContainer>
          {type != "onboarding" && type != "checkIn" && (
            <IconWrapper
              onClick={e => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
            >
              <Icon icon={"Options"} size={"16px"} iconColor={"grey60"} />
            </IconWrapper>
          )}
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
        </KeyElementContainer>
      </Container>
    );
  },
);

const {
  warningRed,
  tango,
  finePine,
  grey30,
  grey10,
  almostPink,
  lightYellow,
  lightFinePine,
  primary100,
  primary20,
} = baseTheme.colors;

export const completionSymbol = type => {
  switch (type) {
    case "percentage":
      return "%";
    case "currency":
      return "$";
    default:
      return "";
  }
};

export const determineStatusLabel = (status: string) => {
  switch (status) {
    case "incomplete":
      return (
        <StatusBadge color={warningRed} backgroundColor={almostPink}>
          Behind
        </StatusBadge>
      );
    case "in_progress":
      return (
        <StatusBadge color={tango} backgroundColor={lightYellow}>
          Needs Attention
        </StatusBadge>
      );
    case "completed":
      return (
        <StatusBadge color={finePine} backgroundColor={lightFinePine}>
          On Track
        </StatusBadge>
      );
    case "done":
      return (
        <StatusBadge color={primary100} backgroundColor={primary20}>
          Completed
        </StatusBadge>
      );
    default:
      return (
        <StatusBadge color={grey30} backgroundColor={grey10}>
          None
        </StatusBadge>
      );
  }
};

const KeyElementContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 30px;
  align-items: center;
`;

// TODO: Move to shared styling folder

const IconWrapper = styled.div`
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  margin-left: auto;
  display: none;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

const Container = styled.div`
  &: hover ${IconWrapper} {
    display: block;
  };
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
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
  padding-left: 0px;
  border: none;
  font-weight: bold;
  font-size: 14px;
  box-shadow: none;
  text-decoration: ${props => (props.completed == "true" ? "line-through" : "")};
`;

const CompletionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 8px;
  position: relative;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const CompletionTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  margin-left: 8px;
  margin-right: 16px;
`;

const ProgressBarContainer = styled.div`
  width: 20em;
`;

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey40};
  &: hover {
    color: ${props => props.theme.colors.greyActive};
  }
`;

type DropdownHeaderProps = {
  isLogRecent: boolean;
};

const DropdownHeader = styled("div")<DropdownHeaderProps>`
  border: 1px solid
    ${props =>
      props.isLogRecent ? props.theme.colors.successGreen : props.theme.colors.greyInactive};
  min-width: 145px;
  padding: 8px 0px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  margin-right: 20px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 20px;
    width: 145px;
  }
`;

type StatusBadgeProps = {
  backgroundColor: string;
  color: string;
};

const StatusBadge = styled("span")<StatusBadgeProps>`
  display: inline-block;
  font-size: 12px;
  border-radius: 3px;
  padding: 2px;
  margin: 0 16px;
  font-weight: bold;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
`;

const DropdownListContainer = styled("div")`
  position: absolute;
  margin-top: 30px;
  @media only screen and (max-width: 768px) {
    margin-top: -20px;
  }
`;

const DropdownList = styled("ul")`
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 8px 0px;
  position: absolute;
  margin-top: 3px;
  width: 145px;
`;

type StatusBadgeContainerProps = {
  key: number;
  value: string;
  onClick: () => void;
};

const StatusBadgeContainer = styled("li")<StatusBadgeContainerProps>`
  list-style: none;
  padding: 5px 0px;
  cursor: pointer;
  &:hover {
    background-color: #f6f6f6;
  }
`;

const ValueInputContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const TargetValue = styled.span`
  font-weight: bold;
  display: inline-block;
`;

type ITargetValueContainer = {
  marginRight?: string;
};

const TargetValueContainer = styled.div<ITargetValueContainer>`
  width: 3em;
  margin-left: 50px;
  margin-right: ${props => (props.marginRight ? props.marginRight : "50px")};
  text-align: center;
  @media only screen and (max-width: 768px) {
    display: inline;
  }
`;

const TargetValueContainerMobile = styled.span`
  display: none;
  @media only screen and (max-width: 768px) {
    display: inline;
  }
`;

const AvatarContainer = styled.div`
  margin-right: 10px;
  &: hover {
    cursor: pointer;
  }
`;

const SymbolContainer = styled.span`
  position: absolute;
  top: 9px;
  right: 7px;
  font-size: 14px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 145px;
  @media only screen and (max-width: 768px) {
    width: 148px;
  }
`;

const SelectionListContainer = styled.div`
  position: absolute;
  margin-left: 50px;
  margin-top: 20px;
`;
