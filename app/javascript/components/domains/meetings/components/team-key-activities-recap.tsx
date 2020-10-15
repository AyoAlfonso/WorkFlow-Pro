import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { KeyActivityEntryRecap } from "~/components/domains/key-activities/key-activity-entry-recap";

export const TeamKeyActivitiesRecap = observer(
  (props: {}): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);

    const { meetingStore, keyActivityStore } = useMst();

    useEffect(() => {
      keyActivityStore.fetchKeyActivitiesFromMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const renderOutstandingTeamKeyActivities = (): Array<JSX.Element> => {
      const teamOutstandingKeyActivities = keyActivityStore.keyActivities.filter(
        ka => !ka.completedAt,
      );
      console.log(teamOutstandingKeyActivities);
      return teamOutstandingKeyActivities.map(keyActivity => (
        <KeyActivityContainer key={keyActivity["id"]}>
          <KeyActivityEntryRecap keyActivity={keyActivity} />
        </KeyActivityContainer>
      ));
    };

    return (
      <Container>
        <KeyActivitiesHeader hideFilter={true} title={"Team's Pyns"} />
        <KeyActivitiesContainer>{renderOutstandingTeamKeyActivities()}</KeyActivitiesContainer>
      </Container>
    );
  },
);

const Container = styled(HomeContainerBorders)`
  margin-left: 15px;
  margin-right: auto;
  min-width: 525px;
  width: 50%;
  margin-top: 0;
`;

const KeyActivitiesContainer = styled.div`
  overflow-y: auto;
  height: 260px;
`;

const KeyActivityContainer = styled.div``;
