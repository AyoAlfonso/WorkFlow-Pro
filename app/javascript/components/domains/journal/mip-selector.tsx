import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MultiSelector } from "~/components/domains/journal/multi-selector";
import { Text } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";

export interface IMIPSelectorProps {}

export const MIPSelector = observer(
  (props): JSX.Element => {
    const { keyActivityStore } = useMst();
    const todaysPriorities = keyActivityStore.todaysPriorities;
    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    if (R.isNil(todaysPriorities) || R.isNil(weeklyKeyActivities) || R.isNil(masterKeyActivities)) {
      return <Loading />;
    }

    const [optionsChecked, setOptionsChecked] = useState<Array<any>>(todaysPriorities);

    const keyActivityOptions = optionsChecked
      .concat(
        weeklyKeyActivities.length > 0
          ? weeklyKeyActivities.slice(0, 10)
          : masterKeyActivities.slice(0, 10),
      )
      .sort();

    const CHECKED_LIMIT = 3;

    const updateOptionsChecked = option => {
      if (optionsChecked.includes(option)) {
        keyActivityStore.startLoading("weekly-activities");
        keyActivityStore.updateKeyActivityState(option.id, "weeklyList", true);
        keyActivityStore.updateKeyActivityState(option.id, "todaysPriority", false);
        setOptionsChecked(optionsChecked.filter(opt => opt.id !== option.id));
      } else if (optionsChecked.length < CHECKED_LIMIT) {
        keyActivityStore.startLoading("todays-priorities");
        keyActivityStore.updateKeyActivityState(option.id, "weeklyList", false);
        keyActivityStore.updateKeyActivityState(option.id, "todaysPriority", true);
        setOptionsChecked(optionsChecked.concat(option));
      }
      keyActivityStore.updateKeyActivity(option.id);
    };

    return (
      <Container>
        <MultiSelectContainer>
          <Text color={"primary60"} fontSize={"12px"}>
            {`Select Up to ${CHECKED_LIMIT}`}
          </Text>
          <MultiSelector
            options={keyActivityOptions}
            optionsChecked={optionsChecked}
            setOptionsChecked={updateOptionsChecked}
            checkedLimit={CHECKED_LIMIT}
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
