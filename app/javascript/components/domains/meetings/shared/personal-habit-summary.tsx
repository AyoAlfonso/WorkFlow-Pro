import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "~/components/shared/percent-change";

export interface IPersonalHabitProps {}

export const PersonalHabitSummary = (props: IPersonalHabitProps): JSX.Element => {
  return (
    <Container>
      <Text>Personal Habit Summary</Text>
      <PercentChange percentChange={0} />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)``;
