import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps } from "styled-system";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { toJS } from "mobx";

export const FrogSelector = observer(
  (props): JSX.Element => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const { keyActivityStore } = useMst();
    const frogs = toJS(keyActivityStore.keyActivities).slice(0, 3);
    return (
      <FrogSelectContainer>
        {frogs.map(frog => (
          <FrogButton
            key={frog.id}
            onClick={() => {
              props.triggerNextStep({
                trigger: R.path(["step", "metadata", "trigger"], props),
                value: frog.id,
              });
              setDisabled(true);
            }}
            disabled={disabled}
          >
            {frog.description}
          </FrogButton>
        ))}
      </FrogSelectContainer>
    );
  },
);

const FrogSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FrogButton = styled.button<ColorProps>`
  ${color}
  color: white;
  background-color: ${props =>
    props.disabled ? props.theme.colors.grey20 : props.theme.colors.primary80};
  border: 0px solid white;
  border-radius: 5px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  font-family: Lato;
  font-size: 12px;
  margin-bottom: 7px;
  padding: 4px;
  &:hover {
    cursor: pointer;
    opacity: ${props => (props.disabled ? 1.0 : 0.85)};
  }
  &:focus {
    outline: 0;
  }
  &:active {
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transform: translate(1px, 1px);
  }
  transition: all ease 0.1s;
`;
