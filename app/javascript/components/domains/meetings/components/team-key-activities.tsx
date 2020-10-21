import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";
import { useTranslation } from "react-i18next";

export const TeamKeyActivities = (props: {}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Container>
      <KeyActivitiesHeader hideFilter={true} title={t("meeting.teamsPyns")} />
      <TeamKeyActivitiesBody />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-left: 15px;
  margin-right: auto;
  min-width: 525px;
  width: 50%;
  margin-top: 0;
`;
