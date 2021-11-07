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
import { space, SpaceProps, color, ColorProps } from "styled-system";
interface ITeamKeyActivitiesBody {
  meeting?: boolean;
  includeAvatar?: boolean;
  showOnlyOpen?: boolean;
}

export const TeamKeyActivitiesBody = observer(
  ({
    meeting = false,
    includeAvatar = false,
    showOnlyOpen,
  }: ITeamKeyActivitiesBody): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showOpenActivities, setShowOpenActivities] = useState<boolean>(true);

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
    const keyActivitiesToShow = showOpenActivities
      ? todaysKeyActivities.filter(ka => ka.completedAt === null)
      : todaysKeyActivities.filter(ka => ka.completedAt);
    const todayFilterGroupId = scheduledGroups.find(group => group.name == "Today").id;
    return (
      <>
        <KeyActivitiesListContainer>
          {!showOnlyOpen ? (
            <FilterContainer>
              <FilterOptions
                onClick={() => setShowOpenActivities(true)}
                mr={"15px"}
                color={showOpenActivities ? "primary100" : "grey40"}
              >
                Open
              </FilterOptions>
              <FilterOptions
                onClick={() => setShowOpenActivities(false)}
                color={!showOpenActivities ? "primary100" : "grey40"}
              >
                Closed
              </FilterOptions>
            </FilterContainer>
          ) : (
            <></>
          )}
          <CreateKeyActivityButton
            meeting={meeting}
            onButtonClick={() => {
              setCreateKeyActivityModalOpen(true);
            }}
          />
          <KeyActivitiesListStyleContainer>
            {keyActivitiesToShow.map(ka => (
              <KeyActivityRecord
                key={ka.id}
                keyActivity={ka}
                noBorder={meeting}
                meetingId={meeting && meetingStore.currentMeeting.id}
                includeAvatar={includeAvatar}
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
  height: inherit;
  overflow-y: auto;
  margin-top: 16px;
`;

export const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: 16px;
  justify-content: flex-end;
  align-items: center;
`;

export const FilterOptions = styled.p<ColorProps & SpaceProps>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;
