import * as React from "react";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import styled from "styled-components";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared";
import { color } from "styled-system";
import { KeyActivityEntry } from "../../key-activities/key-activity-entry";
import { baseTheme } from "~/themes";
import { Loading } from "~/components/shared/loading";

export const TeamKeyActivities = observer(
  (props: {}): JSX.Element => {
    const [showAllKeyActivities, setShowAllKeyActivities] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const { meetingStore, keyActivityStore } = useMst();

    useEffect(() => {
      keyActivityStore.fetchKeyActivitiesFromMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    const outstandingMasterActivities = masterKeyActivities.filter(ka => !ka.completedAt);
    const completedMasterActivities = masterKeyActivities.filter(ka => ka.completedAt);

    const renderKeyActivitiesList = (): any => {
      if (showAllKeyActivities) {
        return (
          <>
            {renderOutstandingMasterActivitiesList()}
            {renderCompletedMasterActivitiesList()}
          </>
        );
      } else {
        return weeklyKeyActivities.map(keyActivity => (
          <KeyActivityContainer key={keyActivity["id"]}>
            <KeyActivityEntry
              keyActivity={keyActivity}
              meetingId={meetingStore.currentMeeting.id}
            />
          </KeyActivityContainer>
        ));
      }
    };

    const renderOutstandingMasterActivitiesList = (): Array<JSX.Element> => {
      const completedMasterActivitiesPresent = completedMasterActivities.length > 0;
      return outstandingMasterActivities.map((keyActivity, index) => {
        const lastElement = index == outstandingMasterActivities.length - 1;

        return (
          <KeyActivityContainer
            key={keyActivity["id"]}
            borderBottom={
              completedMasterActivitiesPresent &&
              lastElement &&
              `1px solid ${baseTheme.colors.grey40}`
            }
          >
            <KeyActivityEntry
              keyActivity={keyActivity}
              meetingId={meetingStore.currentMeeting.id}
            />
          </KeyActivityContainer>
        );
      });
    };

    const renderCompletedMasterActivitiesList = (): Array<JSX.Element> => {
      return completedMasterActivities.map((keyActivity, index) => (
        <KeyActivityContainer key={keyActivity["id"]}>
          <KeyActivityEntry keyActivity={keyActivity} meetingId={meetingStore.currentMeeting.id} />
        </KeyActivityContainer>
      ));
    };

    const renderKeyActivityBody = () => {
      return (
        <KeyActivityBodyContainer>
          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            meetingId={meetingStore.currentMeeting.id}
            defaultTypeAsWeekly={true}
          />
          <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
            <AddNewKeyActivityPlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewKeyActivityPlus>
            <AddNewKeyActivityText> Add New Key Activity</AddNewKeyActivityText>
          </AddNewKeyActivityContainer>
          <KeyActivitiesContainer>{renderKeyActivitiesList()}</KeyActivitiesContainer>
        </KeyActivityBodyContainer>
      );
    };

    return (
      <Container>
        <KeyActivitiesHeader
          showAllKeyActivities={showAllKeyActivities}
          setShowAllKeyActivities={setShowAllKeyActivities}
          title={"Team's Key Activities"}
        />
        {renderKeyActivityBody()}
      </Container>
    );
  },
);

const Container = styled(HomeContainerBorders)`
  margin-left: 15px;
  margin-right: auto;
  min-width: 525px;
  width: 50%;
  margin-top: 0;
`;

const KeyActivityBodyContainer = styled.div`
  padding: 0px 0px 6px 10px;
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 14pt;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewKeyActivityText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const KeyActivitiesContainer = styled.div`
  overflow-y: auto;
  height: 260px;
`;

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};
