import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";

import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../../key-activities/create-key-activity-button";
import {
  KeyActivitiesList,
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
} from "../../key-activities/key-activities-list";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { useParams } from "react-router-dom";
import { Loading } from "~/components/shared";
import { color } from "styled-system";
interface ITeamKeyActivitiesBody {
  meeting?: boolean;
}

export const TeamKeyActivitiesBody = observer(
  ({ meeting = false }: ITeamKeyActivitiesBody): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const {
      meetingStore,
      keyActivityStore,
      sessionStore,
      sessionStore: { scheduledGroups },
    } = useMst();
    const { t } = useTranslation();
    const { meeting_id: meetingId } = useParams();

    useEffect(() => {
      keyActivityStore.fetchKeyActivitiesFromMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    //show todays pyns for all users
    // const todaysKeyActivities = keyActivityStore.keyActivitiesByScheduledGroupName("Today");
    const todaysKeyActivities = keyActivityStore.keyActivitiesFromMeeting;

    const todayFilterGroupId = scheduledGroups.find(group => group.name == "Today").id;
    return (
      <>
        <KeyActivitiesListContainer>
          <CreateKeyActivityButton
            meeting={meeting}
            onButtonClick={() => {
              setCreateKeyActivityModalOpen(true);
            }}
          />
          <KeyActivitiesListStyleContainer>
            {todaysKeyActivities.map(ka => (
              <KeyActivityRecord
                key={ka.id}
                keyActivity={ka}
                noBorder={meeting}
                meetingId={meeting && meetingStore.currentMeeting.id}
              />
            ))}
          </KeyActivitiesListStyleContainer>
        </KeyActivitiesListContainer>

        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          todayModalClicked={false}
          defaultSelectedGroupId={sessionStore.getScheduledGroupIdByName("Weekly List")}
          todayFilterGroupId={todayFilterGroupId}
          meetingId={meetingId}
        />
      </>
    );
  },
);

const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;

const KeyActivitiesListStyleContainer = styled.div`
  margin-top: 16px;
  height: inherit;
  overflow-y: auto;
`;
