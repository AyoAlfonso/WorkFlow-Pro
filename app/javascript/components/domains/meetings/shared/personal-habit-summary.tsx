import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { HabitsSummary } from "~/components/domains/habits/habits-summary";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

export interface IPersonalHabitProps {
  meeting: any;
}

export const PersonalHabitSummary = observer(
  (props: IPersonalHabitProps): JSX.Element => {
    const { meeting } = props;
    const { t } = useTranslation();

    const { 
      habitStore,
      companyStore,
    } = useMst();

    useEffect(() => {
      habitStore.fetchHabitsForPersonalPlanning();
      companyStore.load();
    }, [habitStore.habits, companyStore.company]);

    return (
      <Container>
        <ContainerHeaderWithText text={t("habits.reviewTitle")} />
        <HabitsContainer>
          <HabitsSummary />
        </HabitsContainer>
        {companyStore.company.displayFormat === "Company" ? (
          <PercentageChangeContainer>
            <PercentChange percentChange={habitStore.weeklyDifferenceForPersonalMeeting} />
          </PercentageChangeContainer>
        ) : (
          <PercentageChangeContainer>
            <PercentChange percentChange={habitStore.monthlyDifferenceForPersonalMeeting} />
          </PercentageChangeContainer>
        )}
      </Container>
    );
  },
);

const Container = styled(HomeContainerBorders)`
  min-width: 325px;
  width: 100%;
`;

const HabitsContainer = styled.div`
  max-height: 500px;
`;

const PercentageChangeContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.borderGrey};
`;
