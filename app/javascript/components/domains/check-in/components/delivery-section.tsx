import React, { useState } from "react";
import styled from "styled-components";
import { Label, Select } from "~/components/shared/input";
import { Icon } from "~/components/shared";
import { cadenceOptions, timelineLabels } from "../data/response-data";
import moment from "moment";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

interface DeliverySectionProps {
  cadence: string;
  setCadence: React.Dispatch<React.SetStateAction<string>>;
  checkinTime: string;
  setCheckinTime: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  checkinDay: string;
  setCheckinDay: React.Dispatch<React.SetStateAction<string>>;
  timezone: string;
  setTimezone: React.Dispatch<React.SetStateAction<string>>;
  reminderUnit: string;
  setReminderUnit: React.Dispatch<React.SetStateAction<string>>;
  reminderValue: string;
  setReminderValue: React.Dispatch<React.SetStateAction<string>>;
}

export const DeliverySection = ({
  cadence,
  setCadence,
  checkinTime,
  setCheckinTime,
  selectedDate,
  setSelectedDate,
  checkinDay,
  setCheckinDay,
  timezone,
  setTimezone,
  reminderUnit,
  setReminderUnit,
  reminderValue,
  setReminderValue,
}: DeliverySectionProps): JSX.Element => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const reminderOptions = ["Hour(s)", "Day(s)"];
  const timeOptions = timelineLabels("06:00", 30, "minutes");
  const dayOptions = moment.weekdays();
  const ShowOnlyTime = cadence == "Every Weekday" || cadence == "Daily";
  const showDateTime = cadence == "Once" || cadence == "Monthly" || cadence == "Quarterly";
  const showDayTime = cadence == "Weekly" || cadence == "Bi-weekly";
  const [input, setInput] = useState<string>("1");
  // console.log(reminderObject);
  return (
    <Container>
      <FormGroup>
        <Label>What's the cadence of this Check-in?</Label>
        <Select onChange={e => setCadence(e.target.value)} value={cadence}>
          {cadenceOptions.map((type, index) => (
            <option key={`option-${index}`} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>When should we ask them to respond?</Label>
        {ShowOnlyTime && (
          <Select onChange={e => setCheckinTime(e.target.value)} value={checkinTime}>
            {timeOptions.map((time, index) => (
              <option key={`option-${index}`} value={time}>
                {time}
              </option>
            ))}
          </Select>
        )}
        {showDateTime && (
          <DateTimeContainer>
            <DateContainer onClick={() => setShowDatePicker(true)}>
              {selectedDate.toDateString()}
            </DateContainer>
            <Select onChange={e => setCheckinTime(e.target.value)} value={checkinTime}>
              {timeOptions.map((time, index) => (
                <option key={`option-${index}`} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </DateTimeContainer>
        )}
        {showDayTime && (
          <DateTimeContainer>
            <Select onChange={e => setCheckinDay(e.target.value)} value={checkinDay}>
              {dayOptions.map((day, index) => (
                <option key={`option-${index}`} value={day}>
                  {day}
                </option>
              ))}
            </Select>
            <Select onChange={e => setCheckinTime(e.target.value)} value={checkinTime}>
              {timeOptions.map((time, index) => (
                <option key={`option-${index}`} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </DateTimeContainer>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Time zone</Label>
        <div>
          <RadioContainer>
            <RadioLabel htmlFor="accountTime">Account time zone</RadioLabel>
            <RadioInput
              type="radio"
              id="accountTime"
              name="accountTime"
              value="accountTimeZone"
              checked={timezone === "accountTimeZone"}
              onChange={e => setTimezone(e.target.value)}
            />
          </RadioContainer>

          <RadioContainer>
            <RadioLabel htmlFor="userTime">User time zone</RadioLabel>
            <RadioInput
              type="radio"
              id="userTime"
              name="userTime"
              value="userTimeZone"
              checked={timezone === "userTimeZone"}
              onChange={e => setTimezone(e.target.value)}
            />
          </RadioContainer>
        </div>
      </FormGroup>
      <FormGroup>
        <Label>Send reminder to non-responders after</Label>
        <Flex>
          <InputField
            type="number"
            value={reminderValue}
            onChange={e => {
              if (reminderUnit == "Hour(s)" && Number(e.target.value) > 24) {
                return;
              } else if (reminderUnit == "Day(s)" && Number(e.target.value) > 31) {
                return;
              } else {
                setReminderValue(e.target.value);
              }
            }}
          />
          <Select onChange={e => setReminderUnit(e.target.value)} value={reminderUnit}>
            {reminderOptions.map((type, index) => (
              <option key={`option-${index}`} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <IconContainer onClick={() => setReminderValue("")}>
            <Icon icon={"Close"} size="12px" iconColor={"grey100"} />
          </IconContainer>
        </Flex>
      </FormGroup>
      <DueDatePickerModal
        selectedDueDate={selectedDate}
        setSelectedDueDate={setSelectedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
    </Container>
  );
};

const Container = styled.div``;

const FormGroup = styled.div`
  margin-bottom: 1em;
`;

const Flex = styled.div`
  display: grid;
  grid-template-columns: 43% 43% auto;
  gap: 0.5em;
`;

const DateTimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5em;
`;

const DateContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.greyInactive};
  border-radius: 4px;
  padding: 0.5em;
  color: ${props => props.theme.colors.black};
  cursor: pointer;
`;

const InputField = styled.input`
  border: 1px solid ${props => props.theme.colors.greyInactive};
  border-radius: 4px;
  padding-left: 0.5em;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  &::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;
`;

const RadioInput = styled.input`
  height: 16px;
  width: 16px;
`;

const RadioLabel = styled.label``;

const IconContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  cursor: pointer;
`;
