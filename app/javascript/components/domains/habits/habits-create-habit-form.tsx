import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { Button, Input, Label } from "~/components/shared";
import { genRandomColor } from "~/utils";

interface ICreateHabitFormProps {
  onSubmit: () => void;
}
interface ICreateHabitFormState {
  name: string;
  frequency: number;
  color: string;
}
const defaultCreateHabitFormState = {
  name: "",
  frequency: 1,
  color: genRandomColor(),
};
export const HabitsCreateHabitForm = ({ onSubmit }: ICreateHabitFormProps): JSX.Element => {
  const { habitStore } = useMst();
  const [createHabitFormState, setCreateHabitFormState] = useState<ICreateHabitFormState>(
    defaultCreateHabitFormState,
  );
  const { name, frequency, color } = createHabitFormState;
  const { t } = useTranslation();

  const submitHabit = () => {
    habitStore.createHabit(createHabitFormState);
  };
  return (
    <StyledForm>
      <Label>
        {`${t("profile.habits.form.inputs.name")}:`}
        <StyledInput
          type={"text"}
          value={name}
          onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setCreateHabitFormState({ ...createHabitFormState, name: value })
          }
        />
      </Label>
      <Label>
        {`${t("profile.habits.form.inputs.frequency")}:`}
        <StyledInput
          type={"number"}
          onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setCreateHabitFormState({
              ...createHabitFormState,
              frequency: Number(value) > 0 ? Number(value) : null,
            })
          }
          value={frequency}
        />
      </Label>
      {/* Styling inline here as there seems to be a trick to styling height and width in
      styled-components. Avoiding that complication here. */}
      <Label style={{ width: 50 }}>
        {`${t("profile.habits.form.inputs.color")}:`}
        <StyledInput
          style={{ height: 50, width: 50 }}
          type={"color"}
          onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setCreateHabitFormState({
              ...createHabitFormState,
              color: value,
            })
          }
          value={color}
        />
      </Label>
      <Button
        onClick={() => {
          submitHabit();
          onSubmit && onSubmit();
        }}
        variant={"primary"}
      >
        {t("general.submit")}
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  margin: 25px;
  padding: 15px;
`;

const StyledInput = styled(Input)`
  margin-top: 10px;
`;
