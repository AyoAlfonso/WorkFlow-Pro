import * as React from "react";
import styled from "styled-components";
import { Calendar } from "react-date-range";
import moment from "moment";
import { addDays } from "date-fns";
import { Icon } from "../../shared/icon";
import Modal from "styled-react-modal";
import { baseTheme } from "../../../themes/base";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/shared/button";

interface IDueDatePickerModalProps {
  selectedDueDate: Date;
  setSelectedDueDate: React.Dispatch<React.SetStateAction<Date>>;
  updateDueDate?: any;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDateOptions?: boolean;
  headerString?: string;
  minDate?: Date;
  maxDate?: Date;
  hideClearButton?: boolean;
}

export const DueDatePickerModal = ({
  selectedDueDate,
  setSelectedDueDate,
  updateDueDate,
  showDatePicker,
  setShowDatePicker,
  showDateOptions,
  headerString,
  minDate,
  maxDate,
  hideClearButton,
}: IDueDatePickerModalProps): JSX.Element => {
  const { t } = useTranslation();

  const today = new Date();
  const nextMonth = moment(today)
    .add(1, "month")
    .toDate();
  const threeMonths = moment(today)
    .add(3, "month")
    .toDate();
  const sixMonths = moment(today)
    .add(6, "month")
    .toDate();

  const formattedDueDate = moment(selectedDueDate).format("YYYY-MM-DD");

  return (
    <DatePickerModal
      isOpen={showDatePicker}
      onBackgroundClick={e => {
        setShowDatePicker(false);
      }}
    >
      <DatePickerModalHeaderContainer>
        <DatePickerModalHeader>
          {headerString ? headerString : `Select Due Date`}
        </DatePickerModalHeader>
        <DateModalIconContainer onClick={() => setShowDatePicker(false)}>
          <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} ml="8px" />
        </DateModalIconContainer>
      </DatePickerModalHeaderContainer>
      {showDateOptions && (
        <DateOptionsContainer>
          <DateOptionContainer
            onClick={() => {
              setSelectedDueDate(today);
              updateDueDate(today);
            }}
          >
            <DateOptions selected={formattedDueDate == moment(today).format("YYYY-MM-DD")}>
              Today
            </DateOptions>
          </DateOptionContainer>
          <DateOptionContainer
            onClick={() => {
              setSelectedDueDate(nextMonth);
              updateDueDate(nextMonth);
            }}
          >
            <DateOptions selected={formattedDueDate == moment(nextMonth).format("YYYY-MM-DD")}>
              Next Month
            </DateOptions>
          </DateOptionContainer>
          <DateOptionContainer
            onClick={() => {
              setSelectedDueDate(threeMonths);
              updateDueDate(threeMonths);
            }}
          >
            <DateOptions selected={formattedDueDate == moment(threeMonths).format("YYYY-MM-DD")}>
              In 3 Months
            </DateOptions>
          </DateOptionContainer>
          <DateOptionContainer
            onClick={() => {
              setSelectedDueDate(sixMonths);
              updateDueDate(sixMonths);
            }}
          >
            <DateOptions selected={formattedDueDate == moment(sixMonths).format("YYYY-MM-DD")}>
              In 6 Months
            </DateOptions>
          </DateOptionContainer>
        </DateOptionsContainer>
      )}
      <>
        <Calendar
          showDateDisplay={false}
          showMonthAndYearPickers={false}
          showSelectionPreview={true}
          direction={"vertical"}
          shownDate={new Date()}
          minDate={minDate ? minDate : new Date()}
          maxDate={maxDate ? maxDate : addDays(new Date(), 365.4)}
          scroll={{
            enabled: true,
            calendarWidth: 320,
            monthWidth: 320,
          }}
          rangeColors={[baseTheme.colors.primary80]}
          date={selectedDueDate}
          onChange={date => {
            setSelectedDueDate(date);
            updateDueDate && updateDueDate(date);
            setShowDatePicker(false);
          }}
        />
        <DatePickerModalButtonContainer>
          <Button
            variant={"primary"}
            small
            onClick={() => {
              setShowDatePicker(false);
            }}
            mr="1em"
          >
            Done
          </Button>
          {!hideClearButton && (
            <Button
              variant={"redOutline"}
              small
              onClick={() => {
                setSelectedDueDate(null);
                updateDueDate(null);
                setShowDatePicker(false);
              }}
            >
              {t<string>("datePicker.clearDate")}
            </Button>
          )}
        </DatePickerModalButtonContainer>
      </>
    </DatePickerModal>
  );
};

type DateContainerProps = {
  mr?: string;
};

const DatePickerModal = Modal.styled`
  width: fit-content;
  border-radius: 8px;
  height: fit-content;
  background-color: ${props => props.theme.colors.white};
  padding: 0.5em 0;
`;

const DatePickerModalHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 0.5em;
`;

const DateModalIconContainer = styled.div`
  position: absolute;
  right: 1em;
  cursor: pointer;
`;

const DatePickerModalHeader = styled.h1`
  // text-align: center;
  font-size: 18px;
  // margin: 0.5em auto;
`;

const DatePickerModalButtonContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5em;
  // justify-content: center;
`;

const DateOptionsContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.borderGrey};
`;

const DateOptionContainer = styled.div`
  padding: 0.5em;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  cursor: pointer;
`;

type DateOptionsProps = {
  selected?: boolean;
};

const DateOptions = styled.span<DateOptionsProps>`
  color: ${props => (props.selected ? props.theme.colors.primary100 : props.theme.colors.black)};
  font-size: 12px;
  padding: 0.3em;
  background: ${props => props.selected && props.theme.colors.backgroundBlue};

  &:hover {
    color: ${props => props.theme.colors.primary100};
    background: ${props => props.theme.colors.backgroundBlue};
  }
`;
