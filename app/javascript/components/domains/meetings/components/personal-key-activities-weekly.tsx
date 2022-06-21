import * as React from "react";
import * as R from "ramda";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import {
  KeyActivitiesList,
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
  KeyActivitiesListContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../../key-activities/create-key-activity-button";
import { KeyActivitiesSubHeader } from "../../key-activities/key-activities-sub-header";

import { useTranslation } from "react-i18next";

export const PersonalKeyActivitiesWeekly = observer(
  (props: {}): JSX.Element => {
    const {
      keyActivityStore,
      sessionStore,
      sessionStore: { scheduledGroups },
    } = useMst();
    const { t } = useTranslation();
    const [weeklyFilterDropdownOpen, setWeeklyFilterDropdownOpen] = useState<boolean>(false);
    const [backlogFilterDropdownOpen, setBacklogFilterDropdownOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [selectedFilterGroupId, setSelectedFilterGroupId] = useState<number>(null);
    const selectedFilterGroupIdWeekly = sessionStore.getScheduledGroupIdByName("Weekly List");
    const selectedFilterGroupIdBacklog = sessionStore.getScheduledGroupIdByName("Backlog");

    return (
      <KeyActivitiesWrapperContainer width={"100%"}>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesSubHeader
            header={t<string>("keyActivities.weeklyListTitle")}
            subText={t<string>("keyActivities.weeklyListDescription")}
            sortFilterOpen={weeklyFilterDropdownOpen}
            setFilterOpen={setWeeklyFilterDropdownOpen}
            scheduledGroupId={selectedFilterGroupIdWeekly}
          />
          <KeyActivitiesListContainer>
            <CreateKeyActivityButton
              onButtonClick={() => {
                setSelectedFilterGroupId(selectedFilterGroupIdWeekly);
                setCreateKeyActivityModalOpen(true);
              }}
            />
            <KeyActivitiesList
              keyActivities={keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
                "Weekly List",
              )}
              droppableId={`scheduled-group-activities-${selectedFilterGroupIdWeekly}`}
              mobile={false}
            />
          </KeyActivitiesListContainer>
        </KeyActivityColumnStyleListContainer>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesSubHeader
            header={t<string>("keyActivities.backlogTitle")}
            subText={t<string>("keyActivities.backlogDescription")}
            sortFilterOpen={backlogFilterDropdownOpen}
            setFilterOpen={setBacklogFilterDropdownOpen}
            scheduledGroupId={selectedFilterGroupIdBacklog}
          />
          <KeyActivitiesListContainer>
            <CreateKeyActivityButton
              onButtonClick={() => {
                setSelectedFilterGroupId(selectedFilterGroupIdBacklog);
                setCreateKeyActivityModalOpen(true);
              }}
            />
            <KeyActivitiesList
              keyActivities={keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
                "Backlog",
              )}
              droppableId={`scheduled-group-activities-${selectedFilterGroupIdBacklog}`}
              mobile={false}
            />
          </KeyActivitiesListContainer>
        </KeyActivityColumnStyleListContainer>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultSelectedGroupId={selectedFilterGroupId}
        />
      </KeyActivitiesWrapperContainer>
    );
  },
);
