import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import {
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";

interface OutstandingTodosProps {
  disabled?: boolean;
}

export const OutstandingTodos = observer(
  ({ disabled }: OutstandingTodosProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { t } = useTranslation();

    const remainingPyns = keyActivityStore.todaysPrioritiesFromPreviousDays;
    return (
      <KeyActivitiesWrapperContainer width={"100%"} disabled={disabled}>
        <Container>
          <KeyActivitiesHeader title={t("keyActivities.outstandingTitle")} />
          <KeyActivityListSubHeaderContainer>
            {t<string>("keyActivities.yesterdayUnfinishedText")}
          </KeyActivityListSubHeaderContainer>
          {remainingPyns.map(ka => (
            <KeyActivityRecord keyActivity={ka} />
          ))}
        </Container>
      </KeyActivitiesWrapperContainer>
    );
  },
);

export const Container = styled.div`
  width: 100%;
`;
