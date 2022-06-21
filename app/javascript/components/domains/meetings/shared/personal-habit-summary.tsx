import * as React from "react";
import { isNil } from "ramda";
import { useEffect } from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "~/components/shared/percent-change";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { HabitsSummary } from "~/components/domains/habits/habits-summary";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";

export interface IPersonalHabitProps {
  meeting: any;
}

export const PersonalHabitSummary = observer(
  (props: IPersonalHabitProps): JSX.Element => {
    const { meeting } = props;
    const { t } = useTranslation();

    const { habitStore, companyStore } = useMst();

    useEffect(() => {
      habitStore.fetchHabitsForPersonalPlanning();
      companyStore.load();
    }, [habitStore.habits, companyStore.company]);

    if (isNil(companyStore.company)) {
      return <Loading />;
    }

    return (
      <Container>
        <ContainerHeaderWithText text={t<string>("habits.reviewTitle")} />
        <HabitsContainer>
          <HabitsSummary />
        </HabitsContainer>
        {companyStore.company.displayFormat === "Company" ? (
          <PercentChange
            percentChange={habitStore.weeklyDifferenceForPersonalMeeting}
            periodDesc="week"
          />
        ) : (
          <PercentChange
            percentChange={habitStore.monthlyDifferenceForPersonalMeeting}
            periodDesc="month"
          />
        )}
      </Container>
    );
  },
);

const Container = styled.div`
  min-width: 325px;
  width: 100%;
`;

const HabitsContainer = styled.div`
  max-height: 500px;
`;
