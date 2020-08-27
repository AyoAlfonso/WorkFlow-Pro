import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { KeyActivitiesContainer } from "~/components/domains/key-activities/key-activities-container";
import { TodaysPrioritiesHeader } from "~/components/domains/todays-priorities/todays-priorities-header";

export const DailyPlanning = (props: {}): JSX.Element => {
  return (
    <PrioritiesContainer>
      <PrioritiesHeaderContainer>
        <TodayPrioritiesHeaderContainer>
          <TodaysPrioritiesHeader />
        </TodayPrioritiesHeaderContainer>
        <KeyActivitiesContainer />
      </PrioritiesHeaderContainer>
    </PrioritiesContainer>
  );
};

const Container = styled.div`
  display: flex;
  height: 420px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PrioritiesContainer = styled(HomeContainerBorders)`
  width: 40%;
  min-width: 480px;
  margin-right: 20px;
  margin-left: 5px;
`;

const NonPrioritiesEndContainer = styled(HomeContainerBorders)`
  width: 20%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const NonPrioritiesContainer = styled(NonPrioritiesEndContainer)`
  margin-right: 20px;
`;

const PrioritiesHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
