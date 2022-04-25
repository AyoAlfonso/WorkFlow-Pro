import * as React from "react";
import styled from "styled-components";
import { DateRange } from "react-date-range";
import moment from "moment";
import { addDays } from "date-fns";
import Modal from "styled-react-modal";
import { baseTheme } from "~/themes";
import { Icon } from "../../shared/icon";
import { Button } from "~/components/shared/button";

interface IDateRangeSelectorModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDateSelect: any;
  dateFilter: any;
  setDateFilter: any;
}

export const DateRangeSelectorModal = ({
  handleDateSelect,
  dateFilter,
  open,
  setOpen,
  setDateFilter,
}: IDateRangeSelectorModalProps) => {
  return (
    <DatePickerModal isOpen={open} onBackgroundClick={() => setOpen(false)}>
      <DatePickerModalHeaderContainer>
        <DatePickerModalHeader>Select Date Range</DatePickerModalHeader>
        <DateModalIconContainer onClick={() => setOpen(false)}>
          <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} ml="8px" />
        </DateModalIconContainer>
      </DatePickerModalHeaderContainer>
      <DateRange
        showDateDisplay={false}
        showMonthAndYearPickers={false}
        ranges={[...Object.values(dateFilter)]}
        onChange={ranges => {
          setDateFilter({
            ...ranges,
          });
        }}
        showSelectionPreview={true}
        direction={"vertical"}
        maxDate={new Date()}
        scroll={{
          enabled: true,
          calendarWidth: 320,
          monthWidth: 320,
        }}
        rangeColors={[baseTheme.colors.primary80]}
      />
      <Button
        variant={"primary"}
        small
        onClick={() => {
          handleDateSelect(dateFilter);
        }}
        ml="0.5em"
        mt="0.5em"
      >
        Done
      </Button>
    </DatePickerModal>
  );
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
  padding-right: 0.5em;
`;

const DatePickerModalHeader = styled.h1`
  font-size: 18px;
`;

const DateModalIconContainer = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
