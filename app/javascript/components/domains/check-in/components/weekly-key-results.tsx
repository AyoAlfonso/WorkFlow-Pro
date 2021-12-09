import * as React from "react";
import * as R from "ramda";
import { useEffect, useState } from "react";
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
import { array } from "mobx-state-tree/dist/internal";

export const WeeklyKeyResults = observer(
  (props): JSX.Element => {
    const { keyElementStore } = useMst();
    const { keyElementsForWeeklyCheckin } = keyElementStore;
    const { t } = useTranslation();

    const { weekOf } = useParams();

    const groupBy = objectArray => {
      return objectArray.reduce(function(acc, obj) {
        const key = `${obj["elementableType"]}` + "_" + `${obj["elementableId"]}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    };

    const sortedKeyElements = keyElementsForWeeklyCheckin && groupBy(keyElementsForWeeklyCheckin);

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

    const groupKrs = () => {
      const keyElements = sortedKeyElements;
      const index = Object.values(keyElements);
      const map = index.map(arry => arry);
      return map;
    };

    const renderMilestones = (): JSX.Element => {
      return (
        <>
          {R.isNil(keyElementsForWeeklyCheckin) ? (
            renderLoading()
          ) : (
            <>
              {renderHeading()}
              {keyElementsForWeeklyCheckin &&
                groupKrs().map((groupedKrs: Array<any>, index) => (
                  <Container key={index}>
                    <div>{groupedKrs[0]["elementableId"]}</div>
                    {groupedKrs.map((kr, index) => {
                      const lastKeyElement = index == keyElementsForWeeklyCheckin.length - 1;
                      return (
                        <KeyElement
                          elementId={kr.id}
                          key={kr.id}
                          store={keyElementStore}
                          editable={true}
                          lastKeyElement={lastKeyElement}
                          type={"checkIn"}
                        />
                      );
                    })}
                  </Container>
                ))}
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
  padding-top: 15px;
  padding-bottom: 10px;
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
    padding-top: 15px;
    padding-bottom: 10px;
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
