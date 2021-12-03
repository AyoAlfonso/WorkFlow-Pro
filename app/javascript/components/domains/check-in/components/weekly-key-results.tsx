import * as React from "react";
import * as R from "ramda";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Loading } from "~/components/shared/loading";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import * as moment from "moment";
import { useTranslation } from "react-i18next";
import { EmptyState } from "./empty-state";
import { KeyElement } from "../../goals/shared/key-element";

export const WeeklyKeyResults = observer(
  (props): JSX.Element => {
    const { keyElementStore } = useMst();
    const { t } = useTranslation();

    const { weekOf } = useParams();
    const { keyElementsForWeeklyCheckin } = keyElementStore;

    useEffect(() => {
      keyElementStore.getKeyElementsForWeeklyCheckIn();
    }, []);

    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>
            What's the status on your Key Results from week of{" "}
            <u>{moment(weekOf).format("MMMM D")}</u>?
          </StyledHeader>
        </Container>
      );
    };

    const renderLoading = () => (
      <LoadingContainer>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </LoadingContainer>
    );

    const renderMilestones = (): JSX.Element => {
      return (
        <>
          {R.isNil(keyElementsForWeeklyCheckin) ? (
            renderLoading()
          ) : (
            <>
              {renderHeading()}
              {keyElementsForWeeklyCheckin?.map((kr, index) => {
                const lastKeyElement = index == keyElementsForWeeklyCheckin.length - 1;
                return (
                  <Container key={kr.id}>
                    <KeyElement
                      elementId={kr.id}
                      store={keyElementStore}
                      editable={true}
                      lastKeyElement={lastKeyElement}
                      type={"checkIn"}
                    />
                  </Container>
                );
              })}
            </>
          )}
        </>
      );
    };
    return (
      <>
        {!R.isEmpty(keyElementsForWeeklyCheckin) ? (
          <>{renderMilestones()}</>
        ) : (
          <EmptyState
            heading={t("weeklyCheckIn.milestones.emptyText")}
            infoText={t("weeklyCheckIn.milestones.create")}
          />
        )}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LoadingContainer = styled.div`
  height: 100%;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const StyledText = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;
