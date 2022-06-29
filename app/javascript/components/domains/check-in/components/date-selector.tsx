import { addDays } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

interface DateSelectorProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateSelector = ({ date, setDate }: DateSelectorProps): JSX.Element => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isDisabled = date.toDateString() == new Date().toDateString();
  const backDisabled = date.toDateString() == addDays(new Date(), -365.4).toDateString();

  return (
    <Container>
      <IconContainer disabled={backDisabled} onClick={() => setDate(addDays(date, -1))}>
        <Icon
          icon={"Chevron-Left"}
          size={"12px"}
          iconColor={backDisabled ? "greyInactive" : "greyActive"}
        />
      </IconContainer>
      <DateContainer onClick={() => setShowDatePicker(true)}>
        {date.toDateString()}
        <Icon icon={"Chevron-Down"} size={"12px"} iconColor={"grey100"} />
      </DateContainer>
      <IconContainer disabled={isDisabled} onClick={() => setDate(addDays(date, 1))}>
        <RightIcon
          icon={"Chevron-Left"}
          size={"12px"}
          iconColor={isDisabled ? "greyInactive" : "greyActive"}
        />
      </IconContainer>
      <DueDatePickerModal
        selectedDueDate={date}
        setSelectedDueDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        headerString={"Select Date"}
        minDate={addDays(new Date(), -365.4)}
        maxDate={new Date()}
        hideClearButton={true}
      />
    </Container>
  );
};

export default DateSelector;

const Container = styled.div`
  display: flex;
  margin-bottom: 1em;
  align-items: center;
`;

type IconContainerProps = {
  disabled?: boolean;
};

const IconContainer = styled.div<IconContainerProps>`
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const DateContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.borderGrey};
  color: ${props => props.theme.colors.grey100};
  padding: 0.5em 1em;
  font-size: 0.75em;
  font-weight: bold;
  margin: 0 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  gap: 0 1em;
  cursor: pointer;
`;

const RightIcon = styled(Icon)`
  transform: rotate(180deg);
`;
