import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps } from "styled-system";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { toJS } from "mobx";

export const FrogSelector = observer(
  (props): JSX.Element => {
    const { keyActivityStore } = useMst();
    const frogs = toJS(keyActivityStore.keyActivities);
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
            }}
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
  background-color: ${props => props.theme.colors.frog};
  border-radius: 5px;
  margin-bottom: 4px;
  padding: 4px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  &:hover {
    cursor: pointer;
    opacity: 0.85;
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
