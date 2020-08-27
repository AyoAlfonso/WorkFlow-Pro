import * as React from "react";
import styled from "styled-components";
import { TodaysPrioritiesBody } from "./todays-priorities-body";
import { TodaysPrioritiesHeader } from "./todays-priorities-header";

export const TodaysPrioritiesContainer = (): JSX.Element => {
  return (
    <TodayPrioritiesHeaderContainer>
      <TodaysPrioritiesHeader />
      <TodaysPrioritiesBody />
    </TodayPrioritiesHeaderContainer>
  );
};

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
