import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Calendar } from "react-date-range";
import { addDays } from "date-fns";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { baseTheme } from "~/themes";

interface IDateSelectorProps {
  selectedDate: any;
  setSelectedDate: any;
  minDate: any;
}

export const DateSelector = ({
  selectedDate,
  setSelectedDate,
  minDate,
}: IDateSelectorProps): JSX.Element => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [minEditableDate, setMinEditableDate] = useState<any>(moment(minDate).toDate());

  return (
    <DateSelectionContainer>
      <Popup
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
          <DateButtonContainer
            onClick={() => {
              setShowDatePicker(!showDatePicker);
            }}
            dateSelected={!R.isNil(selectedDate)}
          >
            <Icon icon={"Deadline-Calendar"} iconColor={"inherit"} size={"16px"} mr={"8px"} />

            <TextContainer>
              {moment(selectedDate).format("MMM Do, YYYY") ===
              moment(new Date()).format("MMM Do, YYYY")
                ? "Today"
                : moment(selectedDate).format("MMM Do, YYYY")}
            </TextContainer>
          </DateButtonContainer>
        }
      >
        <>
          <Calendar
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            showSelectionPreview={true}
            direction={"vertical"}
            calendarFocus={"backwards"}
            minDate={moment(minDate).toDate() || addDays(selectedDate, -90)}
            maxDate={new Date()}
            scroll={{
              enabled: true,
              calendarWidth: 320,
              monthWidth: 320,
            }}
            rangeColors={[baseTheme.colors.primary80]}
            date={selectedDate}
            onChange={date => {
              setSelectedDate(date);
              setTimeout(() => {
                setShowDatePicker(!showDatePicker);
              });
            }}
          />
          <Button
            variant={"primary"}
            small
            onClick={() => {
              setSelectedDate(null);
            }}
            mx={"auto"}
            my={"8px"}
          >
            {t("datePicker.clearDate")}
          </Button>
        </>
      </Popup>
    </DateSelectionContainer>
  );
};

const DateSelectionContainer = styled.div`
  border-radius: 6px;
  position: absolute;
`;

type IDueDateButtonContainer = {
  dateSelected?: boolean;
};

const DateButtonContainer = styled.div<IDueDateButtonContainer>`
  display: flex;
  align-items: center;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  width: 130px;
  &: hover {
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  font-size: 12px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.greyActive};
`;
