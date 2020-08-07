import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps } from "styled-system";
import { IconButton } from "../../shared/icon-button";

export const EmotionSelector = (props): JSX.Element => {
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
          iconColor={emotion.color}
          shadow={true}
          onClick={() => {
            props.triggerNextStep({
              value: emotion.value,
              trigger: emotion.trigger,
            });
          }}
        />
      ))}
    </EmotionButtonsContainer>
  );
};

const EmotionButtonsContainer = styled.div`
  display: flex;
`;
