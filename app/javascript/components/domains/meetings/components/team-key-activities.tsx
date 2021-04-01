import * as React from "react";
import styled from "styled-components";
import * as moment from "moment";
import { Heading } from "~/components/shared";
import {
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";
import { useTranslation } from "react-i18next";

export const TeamKeyActivities = (props: {}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <KeyActivitiesWrapperContainer width={"100%"}>
      <SingleListContainer>
        <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"}>
          {t("meeting.teamsPyns")}
        </Heading>
        <KeyActivityListSubHeaderContainer>
          {moment()
            .subtract(1, "days")
            .format("MMMM D")}
        </KeyActivityListSubHeaderContainer>
        <TeamKeyActivitiesBody />
      </SingleListContainer>
    </KeyActivitiesWrapperContainer>
  );
};

const SingleListContainer = styled.div`
  width: 100%;
  margin-right: 20px;
`;
