import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps } from "styled-system";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MultiSelector } from "~/components/domains/journal/multi-selector";
import { Text } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";
import { sortByPosition } from "~/utils/sorting";

export interface IMIPSelectorProps {}

export const MIPSelector = observer(
  (props): JSX.Element => {
    const { keyActivityStore, sessionStore } = useMst();
    const todaysPriorities = keyActivityStore.todaysPriorities;
    const nextActivities = keyActivityStore.nextActivities;
    const masterKeyActivities = keyActivityStore.incompleteMasterKeyActivities;

    if (R.isNil(keyActivityStore.keyActivities)) {
      return <Loading />;
    }

    const [optionsChecked, setOptionsChecked] = useState<Array<any>>(todaysPriorities);
    const [completed, setCompleted] = useState<boolean>(false);

    const keyActivityOptions = R.pipe(
      R.concat(
        nextActivities.length > 0 ? nextActivities.slice(0, 10) : masterKeyActivities.slice(0, 10),
      ),
      R.sortBy(R.prop("createdAt")),
    )(optionsChecked);

    const CHECKED_LIMIT = 3;

    const updateOptionsChecked = option => {
      const lastPosition =
        optionsChecked.length > 0
          ? sortByPosition(optionsChecked)[optionsChecked.length - 1].position + 1
          : option.position;
      keyActivityStore.updateKeyActivityState(option.id, "position", lastPosition);
      if (optionsChecked.includes(option)) {
        keyActivityStore.startLoading("weekly-activities");

        keyActivityStore.updateKeyActivityState(
          option.id,
          "scheduledGroupId",
          sessionStore.getScheduledGroupIdByName("Weekly List"),
        );
        setOptionsChecked(optionsChecked.filter(opt => opt.id !== option.id));
      } else if (optionsChecked.length < CHECKED_LIMIT) {
        keyActivityStore.startLoading("todays-priorities");

        keyActivityStore.updateKeyActivityState(
          option.id,
          "scheduledGroupId",
          sessionStore.getScheduledGroupIdByName("Today"),
        );
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
            checkboxColor={completed ? "grey40" : "primary100"}
            disabled={completed}
          />
        </MultiSelectContainer>
        <NextStepContainer>
          <NextStepButton
            color={completed ? "grey40" : "primary100"}
            onClick={() => {
              if (!completed) {
                setCompleted(true);
                props.triggerNextStep({
                  trigger: R.path(["step", "metadata", "trigger"], props),
                  value: optionsChecked,
                });
              }
            }}
          >
            Continue
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

const NextStepButton = styled.div<ColorProps>`
  ${color}
  cursor: pointer;
  font-size: 12px;
`;

const NextStepContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
