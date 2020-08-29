import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { KeyActivitiesBody } from "~/components/domains/key-activities/key-activities-body";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";

export const PersonalKeyActivities = (props: {}): JSX.Element => {
  return (
    <Container>
      <IndividualContainer>
        <KeyActivitiesHeader title={"Weekly Activity List"} />
        <KeyActivitiesBody showAllKeyActivities={false} borderLeft={"none"} />
      </IndividualContainer>
      <IndividualContainer>
        <KeyActivitiesHeader title={"Master Activity List"} />
        <KeyActivitiesBody showAllKeyActivities={true} borderLeft={"none"} />
      </IndividualContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 420px;
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: -5px;
`;

const IndividualContainer = styled(HomeContainerBorders)`
  width: 40%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  margin-left: 5px;
`;
