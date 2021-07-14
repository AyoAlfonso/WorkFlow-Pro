// https://github.com/luke-wilson/basic-react-timepicker
import React from "react";
import { Select } from "~/components/shared/input";
const moment = require("moment");

export interface ITimePickerProps {
  onChange?: any;
  defaultValue?: string;
  name?: string;
  beginLimit?: string;
  endLimit?: string;
  step?: number;
  disabled?: boolean;
}

export const TimePicker = ({ ...props }: ITimePickerProps): JSX.Element => {
  const isEarlierThanEndLimit = (timeValue, endLimit, lastValue) => {
    const timeValueIsEarlier = moment(timeValue, "h:mm A").diff(moment(endLimit, "h:mm A")) < 0;
    const timeValueIsLaterThanLastValue =
      lastValue === undefined
        ? true
        : moment(lastValue, "h:mm A").diff(moment(timeValue, "h:mm A")) < 0;
    return timeValueIsEarlier && timeValueIsLaterThanLastValue;
  };

  let timeValue = props.beginLimit || "6:00 AM";
  let lastValue;
  const endLimit = props.endLimit || "6:00 PM";
  const step = props.step || 30;

  const options = [];
  options.push(
    <option key={timeValue} value={timeValue}>
      {timeValue}
    </option>,
  );

  while (isEarlierThanEndLimit(timeValue, endLimit, lastValue)) {
    lastValue = timeValue;
    timeValue = moment(timeValue, "h:mm A")
      .add(step, "minutes")
      .format("h:mm A");
    options.push(
      <option key={timeValue} value={timeValue}>
        {timeValue}
      </option>,
    );
  }
  return (
    <Select
      value={props.defaultValue}
      onChange={props.onChange}
      name={props.name}
      disabled={props.disabled}
    >
      {options}
    </Select>
  );
};
