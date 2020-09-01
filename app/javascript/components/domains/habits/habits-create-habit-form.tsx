import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { Button, Input, Label } from "~/components/shared";
import { genRandomColor } from "~/utils";
import { Text } from "~/components/shared/text";

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
      <NameAndColorContainer>
        <NameInputContainer>
          <StyledInput
            type={"text"}
            value={name}
            placeholder={t("profile.habits.form.placeholder")}
            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
              setCreateHabitFormState({ ...createHabitFormState, name: value })
            }
          />
        </NameInputContainer>
        {/* Styling inline here as there seems to be a trick to styling height and width in
      styled-components. Avoiding that complication here. */}
        <StyledColorInput
          style={{
            height: 60,
            width: 60,
            marginTop: "auto",
            marginBottom: "auto",
            border: "none",
            paddingTop: 7,
            paddingBottom: 12,
          }}
          type={"color"}
          onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setCreateHabitFormState({
              ...createHabitFormState,
              color: value,
            })
          }
          value={color}
        />
      </NameAndColorContainer>

      <FrequencyContainer>
        <SectionText> Repeat </SectionText>
        <FrequencyInput
          type={"number"}
          onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setCreateHabitFormState({
              ...createHabitFormState,
              frequency: Number(value) > 0 ? Number(value) : null,
            })
          }
          value={frequency}
        />
        <FrequencyTextTime>times each week</FrequencyTextTime>
      </FrequencyContainer>
      <Button
        disabled={!createHabitFormState["name"]}
        onClick={() => {
          submitHabit();
          onSubmit && onSubmit();
        }}
        variant={"primary"}
      >
        {t("general.save")}
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  margin-left: 28px;
  margin-right: 28px;
  margin-top: 10px;
  margin-bottom: 25px;
`;

const StyledInput = styled(Input)`
  margin-top: 10px;
`;

const StyledColorInput = styled(StyledInput)`
  &: focus {
    outline: none;
  }
`;

const NameAndColorContainer = styled.div`
  display: flex;
`;

const NameInputContainer = styled.div`
  margin-right: 16px;
  width: 90%;
`;

const FrequencyContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const SectionText = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
`;

const FrequencyTextTime = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
`;

const FrequencyInput = styled(Input)`
  width: 50px;
  margin-bottom: 0;
  margin-left: 8px;
  margin-right: 8px;
`;
