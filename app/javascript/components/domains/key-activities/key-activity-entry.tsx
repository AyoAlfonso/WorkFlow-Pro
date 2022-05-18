import { Label } from "@rebass/forms";
import { observer } from "mobx-react";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { baseTheme } from "../../../themes/base";
import { Icon } from "../../shared/icon";
import { KeyActivityPriorityIcon } from "./key-activity-priority-icon";
import { Avatar, LabelSelection, StyledLabel, Text } from "~/components/shared";
import { DateButton } from "~/components/shared/date-selection/date-button";
import { parseISO } from "date-fns";
import { Checkbox } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { parseKeyActivityDueDate } from "~/utils/date-time";
import moment from "moment";
import * as R from "ramda";
import { toJS } from "mobx";
import Modal from "styled-react-modal";
import { ScheduledGroupSelector } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";
import { KeyActivityModalContent } from "./key-activity-modal-content";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

interface IKeyActivityEntryProps {
  keyActivity: any;
  dragHandleProps?: any;
  meetingId?: string | number;
}

export const KeyActivityEntry = observer(
  ({ keyActivity, dragHandleProps, meetingId }: IKeyActivityEntryProps): JSX.Element => {
    const { keyActivityStore, sessionStore } = useMst();
    const keyActivityRef = useRef(null);
    const { t } = useTranslation();
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(keyActivity.dueDate));
    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showPriorities, setShowPriorities] = useState<boolean>(false);
    const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
    const [spaceBelow, setSpaceBelow] = useState<number>(0);
    const [spaceRight, setSpaceRight] = useState<number>(0);
    const [selectedGroupId, setSelectedGroupId] = useState<number>(keyActivity.scheduledGroupId);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(keyActivity.teamId);
    const [showMoveList, setShowMoveList] = useState<boolean>(false);
    const [keyActivityModalOpen, setKeyActivityModalOpen] = useState<boolean>(false);

    const optionsRef = useRef(null);
    const prioritiesRef = useRef(null);
    const moveRef = useRef(null);

    const teams = R.path(["profile", "currentCompanyUserTeams"], sessionStore);
    const groups = toJS(sessionStore.scheduledGroups);

    const teamName = selectedGroupId
      ? groups.find(group => group.id == selectedGroupId)?.name
      : teams.find(group => group.id == selectedTeamId)?.name;

    useEffect(() => {
      setSelectedLabel(keyActivity.labels ? keyActivity.labels[0] : null);
    }, [keyActivity]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showOptions) return;

        const node = optionsRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowOptions(false);
      };

      if (showOptions) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showOptions]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showPriorities) return;

        const node = prioritiesRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowPriorities(false);
      };

      if (showPriorities) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showPriorities]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showMoveModal) return;

        const node = moveRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowMoveModal(false);
      };

      if (showMoveModal) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showMoveModal]);

    useEffect(() => {
      const element = optionsRef.current;

      const ele = element.getBoundingClientRect();
      const height = window.innerHeight - ele.bottom;
      setSpaceBelow(height);

      const width = window.innerWidth - ele.right;
      setSpaceRight(width);
    }, [showOptions]);

    const updatePriority = () => {
      let priority = "";
      switch (keyActivity.priority) {
        case "low":
          priority = "medium";
          break;
        case "medium":
          priority = "high";
          break;
        case "high":
          priority = "frog";
          break;
        case "frog":
          priority = "low";
          break;
        default:
          priority = "";
      }
      keyActivityStore.updateKeyActivityState(keyActivity.id, "priority", priority);
      keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
    };

    const handleDescriptionChange = e => {
      if (!e.target.value.includes("<div>")) {
        keyActivityStore.updateKeyActivityState(keyActivity["id"], "description", e.target.value);
      }
    };

    const dueDateObj = parseKeyActivityDueDate(keyActivity);

    const updateDueDate = date => {
      keyActivityStore.updateKeyActivityState(
        keyActivity["id"],
        "dueDate",
        R.isNil(date) ? null : moment(date).format("YYYY-MM-DD"),
      );
      keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
    };

    const updateLabel = labelId => {
      keyActivityStore.updateLabel(keyActivity.id, labelId);
    };

    const renderLabel = () => {
      if (keyActivity.labels.length > 0) {
        return (
          <LabelSelection
            selectedLabel={selectedLabel}
            setSelectedLabel={setSelectedLabel}
            onLabelClick={setShowLabelsList}
            showLabelsList={showLabelsList}
            inlineEdit={true}
            afterLabelSelectAction={updateLabel}
          />
        );
      }
    };

    const getPriorityText = text => {
      switch (text) {
        case "high":
          return "Medium Priority";
        case "medium":
          return "Low Priority";
        case "frog":
          return "High Priority";
        default:
          return "No Priority";
      }
    };

    const priorityOptions = ["frog", "high", "medium", "low"];

    return (
      <Container dragHandleProps={dragHandleProps}>
        <TopSection>
          <RowContainer>
            <CheckboxContainer>
              <Checkbox
                checked={keyActivity["completedAt"] ? true : false}
                onChange={e => {
                  keyActivityStore.updateKeyActivityStatus(
                    keyActivity,
                    e.target.checked,
                    meetingId ? true : false,
                  );
                }}
                style={{ color: baseTheme.colors.primary100 }}
                size="small"
              />
            </CheckboxContainer>
            <TodoName
              onClick={() => {
                setKeyActivityModalOpen(true);
              }}
              style={{ textDecoration: keyActivity.completedAt && "line-through" }}
            >
              {keyActivity.description}
            </TodoName>
            <RightActionContainer ref={optionsRef}>
              <StyledOptionContainer onClick={() => setShowOptions(!showOptions)}>
                <StyledOptionIcon icon={"Options"} size={"15px"} iconColor={"grey80"} />
              </StyledOptionContainer>
              {showOptions && (
                <OptionsContainer rightDistance={spaceRight} bottomDistance={spaceBelow}>
                  <OptionContainer
                    onClick={() => {
                      setKeyActivityModalOpen(true);
                      setShowOptions(false);
                    }}
                  >
                    <Icon icon={"Edit-2"} size={14} mr={16} iconColor={"greyActive"} />
                    <OptionText>Edit</OptionText>
                  </OptionContainer>
                  <OptionWrapper>
                    <OptionContainer
                      onClick={e => {
                        e.stopPropagation();
                        setShowMoveModal(true);
                      }}
                    >
                      <Icon icon={"Move2"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Move</OptionText>
                    </OptionContainer>
                    {showMoveModal && (
                      <ShareContainer ref={moveRef}>
                        <MoveTopSection>
                          <MoveText>Move</MoveText>
                        </MoveTopSection>

                        <DestinationContainer>
                          <SendDestinationContainer>
                            <ListName onClick={() => setShowMoveList(!showMoveList)}>
                              {teamName || `Select a list`}
                              <Icon
                                icon={"Chevron-Down"}
                                size={"16px"}
                                iconColor={baseTheme.colors.primary80}
                              />
                            </ListName>
                            {showMoveList && (
                              <ScheduledGroupSelector
                                selectedGroupId={selectedGroupId}
                                setSelectedGroupId={setSelectedGroupId}
                                selectedTeamId={selectedTeamId}
                                setSelectedTeamId={setSelectedTeamId}
                                listOnly={true}
                                setShowList={() => setShowMoveList(false)}
                              />
                            )}
                            <ButtonContainer>
                              <StyledButton
                                disabled={!selectedTeamId && !selectedGroupId}
                                onClick={e => {
                                  e.stopPropagation();
                                  keyActivityStore.updateKeyActivityState(
                                    keyActivity.id,
                                    "personal",
                                    false,
                                  );
                                  keyActivityStore.updateKeyActivityState(
                                    keyActivity.id,
                                    "teamId",
                                    selectedTeamId,
                                  );
                                  keyActivityStore.updateKeyActivityState(
                                    keyActivity.id,
                                    "scheduledGroupId",
                                    selectedGroupId,
                                  );
                                  keyActivityStore
                                    .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                                    .then(result => {
                                      if (result) {
                                        showToast(
                                          "Todo Moved Successfully.",
                                          ToastMessageConstants.SUCCESS,
                                        );
                                      }
                                      setShowOptions(false);
                                    });
                                }}
                              >
                                Move
                              </StyledButton>
                            </ButtonContainer>
                          </SendDestinationContainer>
                        </DestinationContainer>
                      </ShareContainer>
                    )}
                  </OptionWrapper>
                  <OptionContainer
                    onClick={() => {
                      keyActivityStore.updateKeyActivityState(
                        keyActivity.id,
                        "personal",
                        !keyActivity.personal,
                      );
                      keyActivityStore.updateKeyActivityState(keyActivity.id, "teamId", null);
                      keyActivityStore
                        .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                        .then(() => setShowOptions(false));
                    }}
                  >
                    <Icon
                      icon={"Lock"}
                      size={14}
                      mr={16}
                      iconColor={keyActivity.personal ? "mipBlue" : "greyActive"}
                    />
                    <OptionText>{keyActivity.personal ? "Unlock" : "Lock"}</OptionText>
                  </OptionContainer>
                  <Divider />
                  <OptionWrapper>
                    <OptionContainer onClick={() => setShowPriorities(true)}>
                      <KeyActivityPriorityIcon priority={keyActivity.priority} size={16} mr={16} />
                      <OptionText>{getPriorityText(keyActivity.priority)}</OptionText>
                    </OptionContainer>
                    {showPriorities && (
                      <PriorityDropdownContainer ref={prioritiesRef}>
                        {priorityOptions.map((priority, index) => (
                          <OptionContainer
                            key={`${priority}-${index}`}
                            onClick={() => {
                              keyActivityStore.updateKeyActivityState(
                                keyActivity.id,
                                "priority",
                                priority,
                              );
                              keyActivityStore
                                .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                                .then(() => setShowPriorities(false));
                            }}
                          >
                            <KeyActivityPriorityIcon size={14} mr={16} priority={priority} />
                            <OptionText>{getPriorityText(priority)}</OptionText>
                          </OptionContainer>
                        ))}
                      </PriorityDropdownContainer>
                    )}
                  </OptionWrapper>
                  <Divider />
                  <OptionContainer
                    onClick={() => {
                      keyActivityStore
                        .duplicateKeyActivity(keyActivity.id)
                        .then(res => res && setShowOptions(false));
                    }}
                  >
                    <Icon icon={"Duplicate"} size={14} mr={16} iconColor={"greyActive"} />
                    <OptionText>Duplicate</OptionText>
                  </OptionContainer>
                  <OptionContainer
                    onClick={() =>
                      keyActivityStore.destroyKeyActivity(keyActivity.id, meetingId ? true : false)
                    }
                  >
                    <Icon icon={"Delete"} size={14} mr={16} iconColor={"warningRed"} />
                    <OptionText color={baseTheme.colors.warningRed}>Delete</OptionText>
                  </OptionContainer>
                </OptionsContainer>
              )}
            </RightActionContainer>
          </RowContainer>
        </TopSection>
        <BottomRowContainer>
          <KeyActivityPriorityContainer onClick={() => updatePriority()}>
            <KeyActivityPriorityIcon priority={keyActivity.priority} />
          </KeyActivityPriorityContainer>
          {meetingId && (
            <AvatarContainer>
              <Avatar
                defaultAvatarColor={keyActivity.user.defaultAvatarColor}
                firstName={keyActivity.user.firstName}
                lastName={keyActivity.user.lastName}
                avatarUrl={keyActivity.user.avatarUrl}
                size={18}
              />
            </AvatarContainer>
          )}
          {keyActivity.personal && (
            <Icon icon={"Lock"} size={18} mr={"0.5em"} iconColor={"mipBlue"} />
          )}
          <DateContainer>
            <DateButtonDiv>
              <DateButton
                onClick={() => {
                  setShowDatePicker(true);
                  setSelectedDueDate(new Date(parseISO(keyActivity.dueDate)));
                }}
                text={dueDateObj.text}
                displayColor={dueDateObj.color}
              />
            </DateButtonDiv>
          </DateContainer>
          <LabelContainer>{renderLabel()}</LabelContainer>
        </BottomRowContainer>

        <StyledModal
          isOpen={keyActivityModalOpen}
          onBackgroundClick={e => {
            setKeyActivityModalOpen(false);
          }}
        >
          <KeyActivityModalContent
            keyActivity={keyActivity}
            setKeyActivityModalOpen={setKeyActivityModalOpen}
          />
        </StyledModal>
        <DueDatePickerModal
          selectedDueDate={selectedDueDate}
          setSelectedDueDate={setSelectedDueDate}
          updateDueDate={updateDueDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </Container>
    );
  },
);

const TopSection = styled.div`
  @media only screen and (max-width: 768px) {
    padding-right: 6px;
  }
`;

const TodoName = styled(Text)`
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
  width: 70%;
  cursor: pointer;
`;

const RightActionContainer = styled.div`
  margin-left: auto;
  position: relative;
`;

const StyledOptionContainer = styled.div`
  cursor: pointer;
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
  pointer-events: none;
`;

type ContainerProps = {
  dragHandleProps?: any;
};

const Container = styled.div<ContainerProps>`
  font-size: 14px;
  padding: 4px 0px 4px 0px;
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
  &: hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
  &:active {
    background-color: ${props => props.dragHandleProps && props.theme.colors.grey20};
  }

  ${StyledLabel} {
    font-size: 10px;
  }
`;

type OCProps = {
  bottomDistance: number;
  rightDistance: number;
};

const OptionsContainer = styled.div<OCProps>`
  position: absolute;
  right: ${props => (props.rightDistance < 200 ? "1em" : "-2em")};
  width: 20em;
  bottom: ${props => props.bottomDistance < 250 && "2em"};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em 0;
  z-index: 5;
  opacity: 1;
  border-radius: 0.625em;
  background: ${props => props.theme.colors.white};

  @media only screen and (max-width: 280px) {
    width: 14rem;
  }
`;

const OptionWrapper = styled.div`
  position: relative;
`;

const OptionContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

type OptionTextProps = {
  color?: string;
};

const OptionText = styled.span<OptionTextProps>`
  font-size: 0.75em;
  color: ${props => (props.color ? props.color : props.theme.colors.black)};
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
`;

const PriorityDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 15em;
  z-index: 10;
  top: 25px;
  right: 10px;
`;

type DateContainerProps = {
  mr?: string;
};

const DateContainer = styled.div<DateContainerProps>`
  display: flex;
  align-items: center;
  width: inherit;
  margin-right: ${props => (props.mr ? props.mr : "0")};
`;

const DateButtonDiv = styled.div``;

export const KeyActivityPriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
  &:hover {
    cursor: pointer;
  }
`;

const LabelContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  // margin-right: .5em;
`;

const CheckboxContainer = styled.div``;

export const AvatarContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BottomRowContainer = styled(RowContainer)`
  // margin-top: -4px;
  margin-left: 36px;

  @media only screen and (max-width: 768px) {
    padding-right: 6px;
  }
`;

const ShareContainer = styled.div`
  display: block;
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 15em;
  padding: 0.5em;
  z-index: 10;
  top: 25px;
  right: 10px;
`;

const MoveTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const MoveText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const DestinationContainer = styled.div``;

const SendDestinationContainer = styled.div`
  position: relative;
`;

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled("button")<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.grey60 : props.theme.colors.primary100};
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
  color: white;
  outline: none;
  border: none;
  border-radius: 0.25em;
  padding: 0.3em 1em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
`;

const ListName = styled.div`
  font-size: 14px;
  border: 1px solid ${props => props.theme.colors.greyInactive};
  display: flex;
  align-items: center;
  padding: 0.3em 0.4em;
  border-radius: 4px;
  justify-content: space-between;
`;

const StyledModal = Modal.styled`
  width: 60rem;
  min-height: 6.25em;
  border-radius: 8px;
  height: 50em;
  max-height: 90%;
  overflow: auto;
  background-color: ${props => props.theme.colors.white};

  @media only screen and (max-width: 768px) {
    width: 23rem;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 1em;
  cursor: pointer;
`;
