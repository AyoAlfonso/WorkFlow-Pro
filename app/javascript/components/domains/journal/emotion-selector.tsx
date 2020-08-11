import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { IconButton } from "../../shared/icon-button";
import { baseTheme } from "../../../themes/base";

export const EmotionSelector = (props): JSX.Element => {
  const [disabled, setDisabled] = useState<boolean>(false);
  return (
    <EmotionButtonsContainer>
      {props.step.metadata.emotions.map((emotion, index) => (
        <IconButton
          key={index}
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"5px"}
          bg={"white"}
          iconName={emotion.icon}
          iconSize={"30px"}
          iconColor={disabled ? baseTheme.colors.grey20 : emotion.color}
          shadow={true}
          onClick={() => {
            props.triggerNextStep({
              value: emotion.value,
              trigger: emotion.trigger,
            });
            setDisabled(true);
          }}
          disabled={disabled}
        />
      ))}
    </EmotionButtonsContainer>
  );
};

const EmotionButtonsContainer = styled.div`
  display: flex;
`;
