import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { Button, Icon, Input, Label } from "~/components/shared";
import { baseTheme } from "~/themes";
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
  color: baseTheme.colors.primary100,
};
export const HabitsCreateHabitForm = ({ onSubmit }: ICreateHabitFormProps): JSX.Element => {
  const { habitStore } = useMst();
  const [createHabitFormState, setCreateHabitFormState] = useState<ICreateHabitFormState>(
    defaultCreateHabitFormState,
  );

  const [habitColor, setHabitColor] = useState<string>(baseTheme.colors.primary100);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const { name, frequency, color } = createHabitFormState;
  const { t } = useTranslation();

  const submitHabit = () => {
    habitStore.createHabit(createHabitFormState);
  };

  const colorArray = [
    baseTheme.colors.mipBlue,
    baseTheme.colors.primary100,
    baseTheme.colors.dimPurple,
    baseTheme.colors.grey100,
    baseTheme.colors.yellowSea,
    baseTheme.colors.warningRed,
    baseTheme.colors.successGreen,
    baseTheme.colors.cavier,
  ];

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
        <ColorContainer>
          <ColorBox
            ml={"18px"}
            backgroundColor={habitColor}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker ? (
            <ColorPickerContainer
              onBlur={() => {
                setShowColorPicker(false);
              }}
            >
              <HeaderContainer>
                <SectionText>Change Color</SectionText>
                <CloseIconContainer onClick={() => setShowColorPicker(false)}>
                  <Icon icon={"Close"} size={"16px"} iconColor={"grey60"} />
                </CloseIconContainer>
              </HeaderContainer>
              <ColorsContainer>
                {colorArray.map((color, index) => (
                  <ColorOptionContainer
                    key={index}
                    onClick={() => {
                      setHabitColor(color);
                      setCreateHabitFormState({
                        ...createHabitFormState,
                        color: color,
                      });
                      setShowColorPicker(false);
                    }}
                  >
                    <ColorBox backgroundColor={color} />
                    {habitColor == color && (
                      <CheckMarkContainer>
                        <Icon icon={"Checkmark"} size={"20px"} iconColor={"white"} />
                      </CheckMarkContainer>
                    )}
                  </ColorOptionContainer>
                ))}
              </ColorsContainer>
            </ColorPickerContainer>
          ) : (
            <></>
          )}
        </ColorContainer>
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
        small
      >
        {t("Add Habit")}
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  margin-left: 28px;
  margin-right: 28px;
  margin-top: 10px;
  margin-bottom: 25px;
  display: relative;
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
  align-items: center;
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

const ColorsContainer = styled.div`
  & :nth-child(4) {
    margin-right: 0;
  }
  & :nth-child(8) {
    margin-right: 0;
  }
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
`;

const CheckMarkContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
`;

const ColorOptionContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 8px;
`;

type ColorBoxProps = {
  backgroundColor: string;
  ml?: string;
};

const ColorBox = styled.div<ColorBoxProps>`
  height: 30px;
  width: 30px;
  display: inline-block;
  border-radius: 4px;
  background-color: ${props => props.backgroundColor && props.backgroundColor};
  margin-left: ${props => (props.ml ? props.ml : "")};
  cursor: pointer;
`;

const ColorPickerContainer = styled.div`
  padding: 0.63em;
  border-radius: 0.25em;
  height: 6.25em;
  width: 9.1em;
  display: block;
  overflow: break;
  position: absolute;
  right: 0px;
  border: box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  z-index: 20;
  background-color: ${props => props.theme.colors.white};
  margin-top: 0.63em;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ColorContainer = styled.div`
  position: relative;
`;
