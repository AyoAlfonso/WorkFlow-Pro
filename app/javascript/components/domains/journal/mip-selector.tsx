import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MultiSelector } from "~/components/domains/journal/multi-selector";
import { Text } from "~/components/shared/text";

export interface IMIPSelectorProps {}

export const MIPSelector = observer(
  (props): JSX.Element => {
    const [optionsChecked, setOptionsChecked] = useState<Array<any>>([]);

    const { keyActivityStore } = useMst();
    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    const keyActivityOptions =
      weeklyKeyActivities.length > 0
        ? weeklyKeyActivities.slice(0, 10)
        : masterKeyActivities.slice(0, 10);

    const updateOptionsChecked = option => {
      if (optionsChecked.includes(option)) {
        setOptionsChecked(optionsChecked.filter(opt => opt.id !== option.id));
      } else if (optionsChecked.length < 3) {
        setOptionsChecked(optionsChecked.concat(option));
      }
    };

    return (
      <Container>
        <MultiSelectContainer>
          <Text color={"primary60"} fontSize={"12px"}>
            Select Up to 3
          </Text>
          <MultiSelector
            options={keyActivityOptions}
            optionsChecked={optionsChecked}
            setOptionsChecked={updateOptionsChecked}
            checkedLimit={3}
          />
        </MultiSelectContainer>
        <NextStepContainer>
          <NextStepButton
            onClick={() => {
              props.triggerNextStep({
                trigger: R.path(["step", "metadata", "trigger"], props),
                value: optionsChecked,
              });
            }}
          >
            Done
          </NextStepButton>
        </NextStepContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
`;

const MultiSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NextStepButton = styled.div`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  font-size: 12px;
`;

const NextStepContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
