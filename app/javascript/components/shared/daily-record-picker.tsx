import * as React from "react";
import styled from "styled-components";
import { Text, Icon } from "~/components/shared";
import moment from "moment";
import { Calendar } from "react-date-range";
import { addDays } from "date-fns";

import { todaysDateFull, yesterdaysDateFull } from "~/lib/date-helpers";

export const DailyRecordPicker = ({
  showCalendar,
  setShowCalendar,
  selectedDateFilter,
  setSelectedDateFilter,
  retrieveData,
}): JSX.Element => {
  const renderDatePickerIcon = () => {
    const notTodayOrYesterday = !(
      selectedDateFilter == todaysDateFull || selectedDateFilter == yesterdaysDateFull
    );

    return (
      <DatePickerContainer>
        <Icon
          icon={"Deadline-Calendar"}
          size={"16px"}
          iconColor={notTodayOrYesterday ? "primary100" : "grey60"}
        />
        <DatePickerText type={"small"} selected={notTodayOrYesterday}>
          {moment(selectedDateFilter).format("YYYY-MM-DD")}
        </DatePickerText>
        <Icon
          icon={"Chevron-Down"}
          size={"10px"}
          iconColor={notTodayOrYesterday ? "primary100" : "grey60"}
        />
      </DatePickerContainer>
    );
  };

  return (
    <FilterContainer>
      <FilterWrapper>
        <DatePickerWrapper onClick={() => setShowCalendar(!showCalendar)}>
          {renderDatePickerIcon()}
        </DatePickerWrapper>

        {showCalendar && (
          <CalendarContainer>
            <Calendar
              showDateDisplay={false}
              showMonthAndYearPickers={false}
              showSelectionPreview={true}
              direction={"vertical"}
              shownDate={new Date()}
              minDate={addDays(new Date(), -14)}
              maxDate={new Date()}
              scroll={{
                enabled: true,
                calendarWidth: 320,
                monthWidth: 320,
              }}
              date={moment(selectedDateFilter).toDate()}
              onChange={date => {
                setShowCalendar(false);
                retrieveData(moment(date).format("YYYY-MM-DD"));
                // setSelectedDateFilter(moment(date).format("YYYY-MM-DD")); should be doen by the retrieve data function
              }}
            />
          </CalendarContainer>
        )}

        <FilterText
          onClick={() => retrieveData(todaysDateFull)}
          selected={selectedDateFilter == todaysDateFull}
          type={"small"}
        >
          Today
        </FilterText>
        <FilterText
          onClick={() => retrieveData(yesterdaysDateFull)}
          selected={selectedDateFilter == yesterdaysDateFull}
          type={"small"}
        >
          Yesterday
        </FilterText>
      </FilterWrapper>
    </FilterContainer>
  );
};

type FilterTextProps = {
  selected: boolean;
};

const FilterContainer = styled.div`
  display: flex;
  margin-right: 16px;
`;

const FilterWrapper = styled.div`
  margin-left: auto;
  display: flex;
`;

const FilterText = styled(Text)<FilterTextProps>`
  color: ${props => (props.selected ? props.theme.colors.primary100 : props.theme.colors.grey60)};
  margin-left: 8px;
  margin-top: auto;
  margin-bottom: auto;
  &:hover {
    cursor: pointer;
  }
`;

const DatePickerContainer = styled.div`
  display: flex;
`;

type DatePickerTextProps = {
  selected: boolean;
};

const DatePickerText = styled(Text)<DatePickerTextProps>`
  color: ${props => (props.selected ? props.theme.colors.primary100 : props.theme.colors.grey60)};
  margin-left: 8px;
  margin-right: 4px;
`;

const DatePickerWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const CalendarContainer = styled.div`
  position: fixed;
  margin-top: 30px;
  margin-left: -150px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
`;
