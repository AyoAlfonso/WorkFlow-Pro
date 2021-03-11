import * as React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Heading } from "~/components/shared";
import { Button } from "~/components/shared/button";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/key-activity-record";

export const YesterdayInReview = observer(
  (props: {}): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { t } = useTranslation();

    const finishedYesterdayPyns = keyActivityStore.completedYesterday;
    const remainingPyns = keyActivityStore.todaysPrioritiesFromPreviousDays;

    return (
      <Container>
        <ListContainer>
          <StyledHeading type={"h2"} fontSize={"20px"}>
            {t("keyActivities.yesterdayTitle")}
          </StyledHeading>
          <SubHeaderContainer>
            {moment()
              .subtract(1, "days")
              .format("MMMM D")}
          </SubHeaderContainer>
          <KeyActivitiesListContainer>
            {finishedYesterdayPyns.map(ka => (
              <KeyActivityRecord keyActivity={ka} disabled={true} />
            ))}
          </KeyActivitiesListContainer>
        </ListContainer>
        <ListContainer>
          <StyledHeading type={"h2"} fontSize={"20px"}>
            {t("keyActivities.yesterdayRemainingTitle")}
          </StyledHeading>
          <SubHeaderContainer>{t("keyActivities.yesterdayUnfinishedText")}</SubHeaderContainer>
          <KeyActivitiesListContainer>
            {remainingPyns.map(ka => (
              <KeyActivityRecord keyActivity={ka} />
            ))}
          </KeyActivitiesListContainer>
          <ButtonContainer>
            <MarkDoneButton
              small
              variant={"primary"}
              onClick={() => keyActivityStore.markAllYesterdayDone()}
            >
              {t("keyActivities.markAllYesterdayDone")}
            </MarkDoneButton>
          </ButtonContainer>
        </ListContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 70%;
`;

const ListContainer = styled.div`
  width: 50%;
  margin-right: 20px;
`;

const StyledHeading = styled(Heading)`
  font-weight: bold;
`;

const SubHeaderContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
  margin-top: auto;
  margin-bottom: auto;
`;

const KeyActivitiesListContainer = styled.div`
  margin-top: 16px;
  height: 100%;
`;

const MarkDoneButton = styled(Button)``;

const ButtonContainer = styled.div`
  display: flex;
  direction: rtl;
`;
