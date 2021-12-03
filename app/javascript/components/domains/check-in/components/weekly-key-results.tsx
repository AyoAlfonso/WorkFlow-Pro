import * as React from "react";
import * as R from "ramda";
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useEffect } from "react";
>>>>>>> 5e295842 (added weekly key results)
import { observer } from "mobx-react";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Loading } from "~/components/shared/loading";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import * as moment from "moment";
<<<<<<< HEAD
import { Avatar } from "~/components/shared";
=======
>>>>>>> 5e295842 (added weekly key results)
import { useTranslation } from "react-i18next";
import { EmptyState } from "./empty-state";
import { KeyElement } from "../../goals/shared/key-element";

export const WeeklyKeyResults = observer(
  (props): JSX.Element => {
<<<<<<< HEAD
    const { keyElementStore, userStore } = useMst();
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
=======
    const { keyElementStore } = useMst();
    const { t } = useTranslation();

    const { weekOf } = useParams();
    const { keyElementsForWeeklyCheckin } = keyElementStore;
>>>>>>> 5e295842 (added weekly key results)

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

<<<<<<< HEAD
    const groupKrs = () => {
      const keyElements = sortedKeyElements;
      const index = Object.values(keyElements);
      const map = index.map(arry => arry);
      return map;
    };

    const renderKeyElements = (): JSX.Element => {
=======
    const renderMilestones = (): JSX.Element => {
>>>>>>> 5e295842 (added weekly key results)
      return (
        <>
          {R.isNil(keyElementsForWeeklyCheckin) ? (
            renderLoading()
          ) : (
            <>
              {renderHeading()}
<<<<<<< HEAD
              {keyElementsForWeeklyCheckin &&
                groupKrs().map((groupedKrs: Array<any>, index) => {
                  const user = userStore.users.find(
                    user => user.id == groupedKrs[0]["elementableOwnedBy"],
                  );
                  return (
                    <Container key={index}>
                      <TopSection>
                        <Avatar
                          defaultAvatarColor={user?.defaultAvatarColor}
                          avatarUrl={user?.avatarUrl}
                          firstName={user?.firstName}
                          lastName={user?.lastName}
                          size={24}
                          marginLeft={"0"}
                        />
                        <StyledText>{groupedKrs[0]["elementableContextDescription"]}</StyledText>
                      </TopSection>
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
                  );
                })}
=======
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
>>>>>>> 5e295842 (added weekly key results)
            </>
          )}
        </>
      );
    };
    return (
      <>
        {!R.isEmpty(keyElementsForWeeklyCheckin) ? (
<<<<<<< HEAD
          <>{renderKeyElements()}</>
        ) : (
          <EmptyState
            heading={t("weeklyCheckIn.keyResults.emptyText")}
            infoText={t("weeklyCheckIn.keyResults.create")}
=======
          <>{renderMilestones()}</>
        ) : (
          <EmptyState
            heading={t("weeklyCheckIn.milestones.emptyText")}
            infoText={t("weeklyCheckIn.milestones.create")}
>>>>>>> 5e295842 (added weekly key results)
          />
        )}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
<<<<<<< HEAD
  padding-top: 15px;
  padding-bottom: 10px;
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
    padding-top: 15px;
    padding-bottom: 10px;
=======
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
>>>>>>> 5e295842 (added weekly key results)
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
<<<<<<< HEAD
  font-size: 18px;
=======
  font-size: 16px;
>>>>>>> 5e295842 (added weekly key results)
  font-weight: bold;
  margin-left: 5px;
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;
<<<<<<< HEAD

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;
=======
>>>>>>> 5e295842 (added weekly key results)
