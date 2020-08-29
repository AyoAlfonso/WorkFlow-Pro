import * as React from "react";
import styled from "styled-components";
import { TodaysPrioritiesBody } from "./todays-priorities-body";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";

export const TodaysPrioritiesContainer = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <TodayPrioritiesHeaderContainer>
      <ContainerHeaderWithText text={t("keyActivities.prioritiesTitle")} />
      <TodaysPrioritiesBody />
    </TodayPrioritiesHeaderContainer>
  );
};

const TodayPrioritiesHeaderContainer = styled.div`
  width: 50%;
`;
