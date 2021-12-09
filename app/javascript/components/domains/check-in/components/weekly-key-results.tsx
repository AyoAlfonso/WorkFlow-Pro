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
import { Avatar } from "~/components/shared";
import { useTranslation } from "react-i18next";
import { EmptyState } from "./empty-state";
import { KeyElement } from "../../goals/shared/key-element";

export const WeeklyKeyResults = observer(
  (props): JSX.Element => {
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
        <Loading />
      </LoadingContainer>
    );

    const groupKrs = () => {
      const keyElements = sortedKeyElements;
      const index = Object.values(keyElements);
      const map = index.map(arry => arry);
      return map;
    };

    const renderKeyElements = (): JSX.Element => {
      return (
        <>
          {R.isNil(keyElementsForWeeklyCheckin) ? (
            renderLoading()
          ) : (
            <>
              {renderHeading()}
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
                          size={20}
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
            </>
          )}
        </>
      );
    };
    return (
      <>
        {!R.isEmpty(keyElementsForWeeklyCheckin) ? (
          <>{renderKeyElements()}</>
        ) : (
          <EmptyState
            heading={t("weeklyCheckIn.keyResults.emptyText")}
            infoText={t("weeklyCheckIn.keyResults.create")}
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
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
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

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;
