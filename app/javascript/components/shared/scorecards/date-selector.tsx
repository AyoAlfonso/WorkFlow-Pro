import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import Popup from "reactjs-popup";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Calendar } from "react-date-range";
import { addDays } from "date-fns";
import { baseTheme } from "~/themes";
import { Button } from "~/components/shared/button";
import { getWeekNumber } from "~/utils/date-time";

interface IDueDateSelectorProps {
  selectedDueDate: Date;
  setSelectedDueDate: any;
  setCurrentWeek: any;
  maxDate: Date;
  fiscalYearStart: string;
  setOneYearBack: any;
}

export const DueDateSelector = ({
  selectedDueDate,
  setSelectedDueDate,
  setCurrentWeek,
  setOneYearBack,
  maxDate,
  fiscalYearStart,
}: IDueDateSelectorProps): JSX.Element => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  return (
    <Container>
      <DueDateSelectionContainer>
        <Popup
          arrow={false}
          closeOnDocumentClick
          contentStyle={{
            border: "none",
            borderRadius: "6px",
            padding: 0,
            width: "auto",
          }}
          on="click"
          onClose={() => {}}
          onOpen={() => {}}
          open={showDatePicker}
          position="bottom right"
          trigger={
            <DueDateButtonContainer
              onClick={() => {
                setShowDatePicker(!showDatePicker);
              }}
              dateSelected={!R.isNil(selectedDueDate)}
            >
              <Icon icon={"Deadline-Calendar"} iconColor={"inherit"} size={"16px"} mr={"8px"} />

              <TextContainer>
                {R.isNil(selectedDueDate)
                  ? t("datePicker.dueDate")
                  : moment(selectedDueDate).format("MMM Do, YYYY")}
              </TextContainer>
            </DueDateButtonContainer>
          }
        >
          <Calendar
            showDateDisplay={true}
            showMonthAndYearPickers={false}
            showSelectionPreview={true}
            direction={"vertical"}
            calendarFocus={"backwards"}
            minDate={addDays(maxDate, -90)}
            maxDate={maxDate}
            scroll={{
              enabled: true,
              calendarWidth: 320,
              monthWidth: 320,
            }}
            color={baseTheme.colors.primary100}
            rangeColors={[baseTheme.colors.primary100]}
            date={selectedDueDate}
            shownDate={selectedDueDate}
            onChange={date => {
              setSelectedDueDate(date);
              setCurrentWeek(getWeekNumber(date, fiscalYearStart).num);
              setOneYearBack(getWeekNumber(date, fiscalYearStart).repeat);
            }}
          />
        </Popup>
      </DueDateSelectionContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

type IDueDateButtonContainer = {
  dateSelected?: boolean;
};

const DueDateButtonContainer = styled.div<IDueDateButtonContainer>`
  display: flex;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
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

const DueDateSelectionContainer = styled.div`
  border-radius: 6px;
`;
