import * as React from "react";

import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Heading } from "~/components/shared";
import { KeyActivitiesList } from "~/components/domains/key-activities/key-activities-list";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";

export const YesterdayInReview = observer(
  (props: {}): JSX.Element => {
    const { keyActivityStore } = useMst();

    const todaysKeyActivities = keyActivityStore.keyActivitiesByScheduledGroupName("Today");
    return (
      <Container>
        <ListContainer>
          <StyledHeading type={"h2"} fontSize={"20px"}>
            Finished Yesterday
          </StyledHeading>
          <KeyActivitiesListContainer></KeyActivitiesListContainer>
        </ListContainer>
        <ListContainer>
          <StyledHeading type={"h2"} fontSize={"20px"}>
            Remaining Pyns
          </StyledHeading>
          <KeyActivitiesListContainer></KeyActivitiesListContainer>
        </ListContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 70%;
`;

const ListContainer = styled.div`
  width: 50%;
  margin-right: 20px;
`;

const StyledHeading = styled(Heading)`
  font-weight: bold;
`;

const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;
