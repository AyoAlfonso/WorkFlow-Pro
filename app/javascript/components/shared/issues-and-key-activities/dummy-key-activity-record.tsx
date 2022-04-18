import { Checkbox, Label } from "@rebass/forms";
import { observer } from "mobx-react";
import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Avatar } from "~/components/shared/avatar";
import { baseTheme } from "../../../themes/base";
import { Icon } from "../../shared/icon";
import { LabelSelection, DefaultStyledLabel } from "~/components/shared";
import { DateButton } from "~/components/shared/date-selection/date-button";
import { addDays, parseISO } from "date-fns";
import Popup from "reactjs-popup";
import { Calendar } from "react-date-range";
import { Button } from "~/components/shared/button";
import { useTranslation } from "react-i18next";
import { parseKeyActivityDueDate } from "~/utils/date-time";
import moment from "moment";
import * as R from "ramda";
import { KeyActivityPriorityIcon } from "~/components/domains/key-activities/key-activity-priority-icon";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";

interface IKeyActivityRecordProps {
  keyActivity: any;
  dragHandleProps?: any;
  meetingId?: string | number;
  disabled?: boolean;
  noBorder?: boolean;
  includeAvatar?: boolean;
}

export const KeyActivityRecord = observer(
  ({
    keyActivity,
    dragHandleProps,
    meetingId,
    disabled,
    noBorder,
    includeAvatar = false,
  }: IKeyActivityRecordProps): JSX.Element => {
    const { keyActivityStore, meetingStore } = useMst();
    const keyActivityRef = useRef(null);
    const { t } = useTranslation();
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(keyActivity.dueDate));
    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);

    if (!keyActivity) {
      return <></>;
    }
    const { user } = keyActivity;

    useEffect(() => {
      setSelectedLabel(
        keyActivity.labels && keyActivity.labels.length > 0 ? keyActivity.labels[0] : null,
      );
    }, [keyActivity]);

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
      return (
        <LabelSelection
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          onLabelClick={setShowLabelsList}
          showLabelsList={showLabelsList}
          inlineEdit={true}
          afterLabelSelectAction={updateLabel}
          marginLeftDropdownList="-300px"
        />
      );
    };

    return (
      <Container>
        <RowContainer>
          <CheckboxContainer key={keyActivity["id"]}>
            <Checkbox
              key={keyActivity["id"]}
              checked={keyActivity["completedAt"] ? true : false}
              sx={{
                color: baseTheme.colors.primary100,
              }}
              onChange={e => {
                keyActivityStore.updateKeyActivityStatus(
                  keyActivity,
                  e.target.checked,
                  meetingId ? true : false,
                );
              }}
              disabled={disabled}
            />
          </CheckboxContainer>
          <InputContainer>
            <StyledContentEditable
              innerRef={keyActivityRef}
              html={keyActivity.description}
              onChange={e => handleDescriptionChange(e)}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  keyActivityRef.current.blur();
                }
              }}
              style={{
                textDecoration: keyActivity.completedAt && "line-through",
                cursor: "text",
              }}
              onBlur={() => {
                keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
              }}
              disabled={disabled}
            />
          </InputContainer>

          <RightContainer>
            {keyActivity.personal && <Icon icon={"Lock"} size={18} iconColor={"mipBlue"} />}
            {!disabled && (
              <ActionContainer>
                <ActionSubContainer>
                  <DeleteButtonContainer
                    onClick={() =>
                      keyActivityStore.destroyKeyActivity(keyActivity.id, meetingId ? true : false)
                    }
                  >
                    <Icon icon={"Delete"} size={20} style={{ marginTop: "2px" }} />
                  </DeleteButtonContainer>
                </ActionSubContainer>
              </ActionContainer>
            )}
          </RightContainer>
        </RowContainer>

        <BottomRowContainer>
          <KeyActivityPriorityContainer
            onClick={() => {
              if (!disabled) {
                updatePriority();
              }
            }}
          >
            <KeyActivityPriorityIcon priority={keyActivity.priority} />
          </KeyActivityPriorityContainer>
          {includeAvatar && (
            <AvatarContainer>
              <Avatar
                defaultAvatarColor={user.defaultAvatarColor}
                avatarUrl={user.avatarUrl}
                firstName={user.firstName}
                lastName={user.lastName}
                size={24}
                marginLeft={"auto"}
              />
            </AvatarContainer>
          )}

          <DateContainer>
            <Popup
              disabled={disabled}
              arrow={false}
              closeOnDocumentClick
              contentStyle={{
                border: "none",
                borderRadius: "6px",
                padding: 0,
                width: "auto",
                marginLeft: "175px",
              }}
              on="click"
              onClose={() => {}}
              onOpen={() => {}}
              open={showDatePicker}
              position="bottom center"
              trigger={
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
              }
            >
              <>
                <Calendar
                  showDateDisplay={false}
                  showMonthAndYearPickers={false}
                  showSelectionPreview={true}
                  direction={"vertical"}
                  shownDate={new Date()}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 30)}
                  scroll={{
                    enabled: true,
                    calendarWidth: 320,
                    monthWidth: 320,
                  }}
                  rangeColors={[baseTheme.colors.primary80]}
                  date={selectedDueDate}
                  onChange={date => {
                    setSelectedDueDate(date);
                    updateDueDate(date);
                  }}
                />
                <Button
                  variant={"primary"}
                  small
                  onClick={() => {
                    setSelectedDueDate(null);
                    updateDueDate(null);
                  }}
                  mx={"auto"}
                  my={"8px"}
                >
                  {t("datePicker.clearDate")}
                </Button>
              </>
            </Popup>
          </DateContainer>
          {renderLabel()}
        </BottomRowContainer>
      </Container>
    );
  },
);

const DeleteButtonContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey60};
  display: none;
  margin-left: 8px;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

type ContainerProps = {
  dragHandleProps?: any;
  noBorder?: any;
};

const Container = styled(HomeContainerBorders)<ContainerProps>`
  font-size: 14px;
  width: inherit;
  padding: 4px 0px 4px 0px;
  box-shadow: ${props => props.noBorder && "none"};
  &:hover ${DeleteButtonContainer} {
    display: block;
  }
  &:hover ${DefaultStyledLabel} {
    display: block;
  }
  margin: 10px 0px;
  padding-left: 12px;
  padding-right: 12px;
  &:active {
    background-color: ${props => props.dragHandleProps && props.theme.colors.grey20};
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: auto;
  font-size: 14px;
  padding: 4px 0px 4px 0px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  width: inherit;
  padding: 0px 0px 0px 10px;
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

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  min-width: 105px;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  word-break: break-word;
`;

const CheckboxContainer = props => (
  <Label
    {...props}
    sx={{
      width: "auto",
      marginTop: "auto",
      marginBottom: "auto",
    }}
  >
    {props.children}
  </Label>
);

export const AvatarContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
  margin-right: 4px;
`;

const ActionContainer = styled.div`
  display: flex;
`;

export const ActionSubContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const RowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled(RowContainer)`
  margin-top: -4px;
  margin-left: 36px;
`;

const RightContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

// const AvatarContainer = styled.div`
//   margin-left: 15px;
//   &: hover {
//     cursor: pointer;
//   }
// `;
