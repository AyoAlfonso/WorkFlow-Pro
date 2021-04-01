import * as React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Heading } from "~/components/shared";
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
          <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"}>
            {t("keyActivities.yesterdayTitle")}
          </Heading>
          <KeyActivityListSubHeaderContainer>
            {moment().format("MMMM D")}
          </KeyActivityListSubHeaderContainer>
          <KeyActivitiesListStyleContainer>
            {finishedYesterdayPyns.map(ka => (
              <KeyActivityRecord keyActivity={ka} disabled={true} />
            ))}
          </KeyActivitiesListStyleContainer>
        </KeyActivityColumnStyleListContainer>
        <KeyActivityColumnStyleListContainer>
          <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"}>
            {t("keyActivities.yesterdayRemainingTitle")}
          </Heading>
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
