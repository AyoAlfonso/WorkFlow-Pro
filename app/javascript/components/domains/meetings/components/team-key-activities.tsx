import * as React from "react";
import styled from "styled-components";
import { today } from "~/lib/date-helpers";
import { Heading } from "~/components/shared";
import {
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";
import { useTranslation } from "react-i18next";

export const TeamKeyActivities = (props: {}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <KeyActivitiesWrapperContainer width={"100%"}>
      <SingleListContainer>
        <KeyActivitiesHeader title={t("meeting.teamsPyns")} />
        <KeyActivityListSubHeaderContainer>{today}</KeyActivityListSubHeaderContainer>
        <TeamKeyActivitiesBody />
      </SingleListContainer>
    </KeyActivitiesWrapperContainer>
  );
};

const SingleListContainer = styled.div`
  width: 100%;
  // margin-right: 20px;
`;
