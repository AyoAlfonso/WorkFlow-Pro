import * as React from "react";
import * as R from "ramda";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import {
  KeyActivitiesList,
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
  KeyActivitiesListContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../../key-activities/create-key-activity-button";

import { useTranslation } from "react-i18next";

export const PersonalKeyActivitiesWeekly = observer(
  (props: {}): JSX.Element => {
    const {
      keyActivityStore,
      sessionStore,
      sessionStore: { scheduledGroups },
    } = useMst();
    const { t } = useTranslation();
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const selectedFilterGroupIdWeekly = sessionStore.getScheduledGroupIdByName("Weekly List");
    const selectedFilterGroupIdBacklog = sessionStore.getScheduledGroupIdByName("Backlog");

    return (
      <KeyActivitiesWrapperContainer width={"100%"}>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesHeader title={t("keyActivities.weeklyListTitle")} />
          <KeyActivitiesListContainer>
            <CreateKeyActivityButton
              onButtonClick={() => {
                setCreateKeyActivityModalOpen(true);
              }}
            />
            <KeyActivitiesList
              keyActivities={keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
                "Weekly List",
              )}
              droppableId={`scheduled-group-activities-${selectedFilterGroupIdWeekly}`}
            />
          </KeyActivitiesListContainer>
        </KeyActivityColumnStyleListContainer>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesHeader title={t("keyActivities.backlogListTitle")} />
          <KeyActivitiesListContainer>
            <CreateKeyActivityButton
              onButtonClick={() => {
                setCreateKeyActivityModalOpen(true);
              }}
            />
            <KeyActivitiesList
              keyActivities={keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
                "Backlog",
              )}
              droppableId={`scheduled-group-activities-${selectedFilterGroupIdBacklog}`}
            />
          </KeyActivitiesListContainer>
        </KeyActivityColumnStyleListContainer>
      </KeyActivitiesWrapperContainer>
    );
  },
);
