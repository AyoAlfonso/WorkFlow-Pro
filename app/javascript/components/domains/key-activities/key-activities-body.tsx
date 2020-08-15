import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Icon } from "../../shared/icon";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateKeyActivityModal } from "./create-key-activity-modal";
import { KeyActivityEntry } from "./key-activity-entry";
import { baseTheme } from "~/themes";

interface IKeyActivitiesBodyProps {
  showAllKeyActivities: boolean;
}

export const KeyActivitiesBody = observer(
  (props: IKeyActivitiesBodyProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { showAllKeyActivities } = props;
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    const outstandingMasterActivities = masterKeyActivities.filter(
      keyActivity => !keyActivity.completedAt,
    );
    const completedMasterActivities = masterKeyActivities.filter(
      keyActivity => keyActivity.completedAt,
    );

    useEffect(() => {
      keyActivityStore.fetchKeyActivities();
    }, []);

    const renderKeyActivitiesList = (): any => {
      if (showAllKeyActivities) {
        return (
          <>
            {renderOutstandingMasterActivitiesList()}
            {renderCompletedMasterActivitiesList()}
          </>
        );
      } else {
        return weeklyKeyActivities.map((keyActivity, index) => (
          <KeyActivityContainer key={keyActivity["id"]}>
            <KeyActivityEntry keyActivity={keyActivity} />
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
            <KeyActivityEntry keyActivity={keyActivity} />
          </KeyActivityContainer>
        );
      });
    };

    const renderCompletedMasterActivitiesList = (): Array<JSX.Element> => {
      return completedMasterActivities.map((keyActivity, index) => (
        <KeyActivityContainer key={keyActivity["id"]}>
          <KeyActivityEntry keyActivity={keyActivity} />
        </KeyActivityContainer>
      ));
    };

    return (
      <Container>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
        />
        <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
          <AddNewKeyActivityPlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewKeyActivityPlus>
          <AddNewKeyActivityText> Add New Key Activity</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>
        <KeyActivitiesContainer>{renderKeyActivitiesList()}</KeyActivitiesContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  ${color}
  padding: 0px 0px 6px 10px;
  border-left: ${props => `1px solid ${props.theme.colors.grey40}`};
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

type KeyActivityContainerType = {
  borderBottom?: string;
};
const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;
