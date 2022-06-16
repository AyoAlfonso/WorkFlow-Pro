import * as React from "react";
import styled from "styled-components";
import { today } from "~/lib/date-helpers";
import { Heading } from "~/components/shared";
import {
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { observer } from "mobx-react";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";
import { useTranslation } from "react-i18next";

interface ITeamKeyActivitiesProps {
  meeting: any;
}

export const TeamKeyActivities = observer(
  ({ meeting }: ITeamKeyActivitiesProps): JSX.Element => {
    const { t } = useTranslation();
    return (
      <KeyActivitiesWrapperContainer width={"100%"}>
        <SingleListContainer>
          <KeyActivitiesHeader title={t<string>("meeting.teamsPyns")} />
          <KeyActivityListSubHeaderContainer>{today}</KeyActivityListSubHeaderContainer>
          <TeamKeyActivitiesBody meeting={meeting} includeAvatar={true} />
        </SingleListContainer>
      </KeyActivitiesWrapperContainer>
    );
  },
);

const SingleListContainer = styled.div`
  width: 100%;
  // margin-right: 20px;
`;
