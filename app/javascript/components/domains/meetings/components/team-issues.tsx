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
import { IssuesHeader } from "../../issues/issues-header";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { IssueEntry } from "../../issues/issue-entry";

export const TeamIssues = observer(
  (props: {}): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const { meetingStore, issueStore } = useMst();

    useEffect(() => {
      issueStore.fetchIssuesForMeeting(meetingStore.currentMeeting.id).then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return issues.map((issue, index) => (
        <IssueContainer key={issue["id"]}>
          <IssueEntry issue={issue} meetingId={meetingStore.currentMeeting.id} />
        </IssueContainer>
      ));
    };

    const renderIssuesBody = () => {
      return (
        <IssuesBodyContainer>
          <CreateIssueModal
            createIssueModalOpen={createIssueModalOpen}
            setCreateIssueModalOpen={setCreateIssueModalOpen}
            teamId={meetingStore.currentMeeting.teamId}
          />
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewIssuePlus>
            <AddNewIssueText> Add New Issue</AddNewIssueText>
          </AddNewIssueContainer>
          <IssuesContainer>{renderIssuesList()}</IssuesContainer>
        </IssuesBodyContainer>
      );
    };

    return (
      <Container>
        <IssuesHeader
          showOpenIssues={showOpenIssues}
          setShowOpenIssues={setShowOpenIssues}
          issuesText={"Team's Issues"}
        />
        {renderIssuesBody()}
      </Container>
    );
  },
);

const Container = styled(HomeContainerBorders)`
  margin-left: auto;
  margin-right: auto;
  min-width: 500px;
  width: 50%;
`;

const IssuesBodyContainer = styled.div`
  padding: 0px 0px 6px 10px;
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 14pt;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const IssuesContainer = styled.div`
  overflow-y: auto;
  height: 260px;
`;

const IssueContainer = styled.div<IssueContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
`;

type IssueContainerType = {
  borderBottom?: string;
};
