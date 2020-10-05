import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";

export const TeamKeyActivities = observer(
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

    return (
      <Container>
        <KeyActivitiesHeader hideFilter={true} title={"Team's Pyns"} />
        <TeamKeyActivitiesBody />
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
