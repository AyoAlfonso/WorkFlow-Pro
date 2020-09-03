import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { HabitsSummary } from "~/components/domains/habits/habits-summary";
export interface IPersonalHabitProps {
  meeting: any;
}

export const PersonalHabitSummary = (props: IPersonalHabitProps): JSX.Element => {
  const { meeting } = props;
  const { t } = useTranslation();

  return (
    <Container>
      <ContainerHeaderWithText text={t("habits.reviewTitle")} />
      <HabitsContainer>
        <HabitsSummary />
      </HabitsContainer>

      <PercentageChangeContainer>
        <PercentChange percentChange={meeting.habitsPercentageIncreaseFromPreviousWeek} />
      </PercentageChangeContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  min-width: 325px;
`;

const HabitsContainer = styled.div`
  max-height: 500px;
`;

const PercentageChangeContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.borderGrey};
`;
