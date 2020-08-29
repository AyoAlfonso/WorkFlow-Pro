import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { HabitsSummary } from "~/components/domains/habits/habits-summary";
export interface IPersonalHabitProps {}

export const PersonalHabitSummary = (props: IPersonalHabitProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Container>
      <ContainerHeaderWithText text={t("habits.reviewTitle")} />
      <HabitsSummary />
      <PercentChange percentChange={0} />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  min-width: 240px;
  width: 40%;
`;
