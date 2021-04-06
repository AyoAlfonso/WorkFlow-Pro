import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { useMst } from "~/setup/root";
import { Icon, Loading } from "~/components/shared";
import { color } from "styled-system";
import { KeyActivityEntry } from "../../key-activities/key-activity-entry";
import { baseTheme } from "~/themes";
import { useTranslation } from "react-i18next";

interface ITeamKeyActivitiesBody {
  meeting?: boolean;
}

export const TeamKeyActivitiesBody = observer(
  ({ meeting = false }: ITeamKeyActivitiesBody): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const { meetingStore, keyActivityStore } = useMst();
    const { t } = useTranslation();

    useEffect(() => {
      keyActivityStore.fetchKeyActivitiesFromMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const masterKeyActivities = keyActivityStore.keyActivitiesFromMeeting;

    const outstandingMasterActivities = masterKeyActivities.filter(ka => !ka.completedAt);
    const completedMasterActivities = masterKeyActivities.filter(ka => ka.completedAt);

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

    return (
      <KeyActivityBodyContainer meeting={meeting}>
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
          <AddNewKeyActivityText> {t("keyActivities.addTitle")}</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>
        <KeyActivitiesContainer meeting={meeting}>
          {renderOutstandingMasterActivitiesList()}
          {renderCompletedMasterActivitiesList()}
        </KeyActivitiesContainer>
      </KeyActivityBodyContainer>
    );
  },
);

type KeyActivityBodyContainerProps = {
  meeting: boolean;
};

const KeyActivityBodyContainer = styled.div<KeyActivityBodyContainerProps>`
  height: ${props => props.meeting && "inherit"};
  padding: 0px 0px 6px 10px;
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: -5px;
  padding-left: 4px;
  &:hover ${AddNewKeyActivityText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type KeyActivitiesContainerProps = {
  meeting: boolean;
};

const KeyActivitiesContainer = styled.div<KeyActivitiesContainerProps>`
  overflow-y: auto;
  height: ${props => (props.meeting ? "inherit" : "260px")};
`;

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};
