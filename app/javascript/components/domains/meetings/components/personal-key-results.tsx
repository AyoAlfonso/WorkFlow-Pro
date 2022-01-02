import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Text } from "~/components/shared/text";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";
import { Loading } from "~/components/shared/loading";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ColumnContainerParent, ColumnContainer } from "~/components/shared/styles/row-style";
import { KeyElement } from "../../goals/shared/key-element";
import { Avatar } from "~/components/shared";

interface IPersonalKeyResultsProps {
  meetingType?: string;
}

export const PersonalKeyResults = observer(
  ({ meetingType }: IPersonalKeyResultsProps): JSX.Element => {
    const { keyElementStore, userStore } = useMst();
    const { keyElementsForWeeklyCheckin } = keyElementStore;

    const [loading, setLoading] = useState<boolean>(true);

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
      keyElementStore.getKeyElementsForWeeklyCheckIn().then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const groupKrs = () => {
      const keyElements = sortedKeyElements;
      const index = Object.values(keyElements);
      const map = index.map(arry => arry);
      return map;
    };

    const renderKeyResults = (): JSX.Element[] => {
      return (
        keyElementsForWeeklyCheckin &&
        groupKrs().map((groupedKrs: Array<any>, index) => {
          const user = userStore.users.find(user => user.id == groupedKrs[0]["elementableOwnedBy"]);
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
                <StyledTitle>{groupedKrs[0]["elementableContextDescription"]}</StyledTitle>
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
                    noValueMargin={true}
                  />
                );
              })}
            </Container>
          );
        })
      );
    };

    return (
      <ColumnContainerParent>
        <ColumnContainer>
          {meetingType == "personal_weekly" ? (
            <HomeKeyActivities weeklyOnly={true} width={"100%"} />
          ) : (
            <HomeKeyActivities todayOnly={true} width={"100%"} />
          )}
        </ColumnContainer>
        <ColumnContainer>{renderKeyResults()}</ColumnContainer>
      </ColumnContainerParent>
    );
  },
);

const Container = styled.div`
  margin-bottom: 50px;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const StyledTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;
