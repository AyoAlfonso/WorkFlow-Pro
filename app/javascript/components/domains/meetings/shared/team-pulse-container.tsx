import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { IMeeting } from "~/models/meeting";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { TeamPulseBody } from "../components/team-pulse-body";

export interface ITeamPulseProps {
  meeting: IMeeting;
  title?: string;
}

export const TeamPulseContainer = observer(
  ({ meeting, title }: ITeamPulseProps): JSX.Element => {
    const { t } = useTranslation();
    const { companyStore } = useMst();

    useEffect(() => {
      companyStore.load();
    }, []);

    return (
      <Container>
        <ContainerHeaderWithText text={title ? title : t("teams.teamsPulseTitle")} />
        <TeamPulseBody meeting={meeting} />
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
`;
