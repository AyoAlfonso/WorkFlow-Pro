import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { KeyActivitiesContainer } from "~/components/domains/key-activities/key-activities-container";
import { TodaysPrioritiesContainer } from "~/components/domains/todays-priorities/todays-priorities-container";

export const DailyPlanning = (props: {}): JSX.Element => {
  return (
    <PrioritiesContainer>
      <PrioritiesHeaderContainer>
        <TodaysPrioritiesContainer />
        <KeyActivitiesContainer />
      </PrioritiesHeaderContainer>
    </PrioritiesContainer>
  );
};
const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 80%;
  min-width: 480px;
  margin-right: 20px;
  margin-left: 5px;
  margin-top: 0px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 20%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
