import * as React from "react";
import { yesterday } from "~/lib/date-helpers";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import { Button } from "~/components/shared/button";
import {
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";
import { useState } from "react";

export const YesterdayInReview = observer(
  (props: {}): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { t } = useTranslation();

    const finishedYesterdayPyns = keyActivityStore.completedYesterday;
    const remainingPyns = keyActivityStore.todaysPrioritiesFromPreviousDays;

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    return (
      <KeyActivitiesWrapperContainer width={"100%"}>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesHeader title={t("keyActivities.yesterdayTitle")} />
          <KeyActivityListSubHeaderContainer>{yesterday}</KeyActivityListSubHeaderContainer>
          <KeyActivitiesListStyleContainer>
            {finishedYesterdayPyns.map(ka => (
              <KeyActivityRecord keyActivity={ka} disabled={true} />
            ))}
          </KeyActivitiesListStyleContainer>
        </KeyActivityColumnStyleListContainer>
        <KeyActivityColumnStyleListContainer>
          <KeyActivitiesHeader title={t("keyActivities.yesterdayRemainingTitle")} />
          <KeyActivityListSubHeaderContainer>
            {t("keyActivities.yesterdayUnfinishedText")}
          </KeyActivityListSubHeaderContainer>
          <KeyActivitiesListStyleContainer>
            {remainingPyns.map(ka => (
              <KeyActivityRecord keyActivity={ka} />
            ))}
          </KeyActivitiesListStyleContainer>
          <ButtonContainer>
            <MarkDoneButton
              small
              variant={"primary"}
              disabled={buttonDisabled}
              onClick={() => {
                setButtonDisabled(true);
                keyActivityStore.markAllYesterdayDone().then(() => {
                  setButtonDisabled(false);
                });
              }}
            >
              {t("keyActivities.markAllYesterdayDone")}
            </MarkDoneButton>
          </ButtonContainer>
        </KeyActivityColumnStyleListContainer>
      </KeyActivitiesWrapperContainer>
    );
  },
);

const KeyActivitiesListStyleContainer = styled.div`
  margin-top: 16px;
`;

const MarkDoneButton = styled(Button)`
  width: 100%;
  margin-left: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;
