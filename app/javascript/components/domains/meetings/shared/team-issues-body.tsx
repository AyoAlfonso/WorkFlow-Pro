import * as React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { Icon, Loading } from "~/components/shared";
import { IssueEntry } from "../../issues/issue-entry";
import { useMst } from "~/setup/root";
import * as R from "ramda";

interface ITeamIssuesBodyProps {
  showOpenIssues: boolean;
  teamId: number | string;
  meetingId?: number | string;
}

export const TeamIssuesBody = observer(
  (props: ITeamIssuesBodyProps): JSX.Element => {
    const {
      issueStore,
      companyStore: { company },
    } = useMst();
    const { showOpenIssues, teamId, meetingId } = props;
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    if (R.isNil(company)) {
      return <Loading />;
    }

    useEffect(() => {
      if (teamId) {
        issueStore.fetchIssuesForTeam(teamId);
      } else {
        issueStore.fetchIssues();
      }
    }, []);

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return issues.map((issue, index) => (
        <IssueContainer key={issue["id"]}>
          <IssueEntry issue={issue} pageEnd={true} meetingId={meetingId} teamId={teamId} />
        </IssueContainer>
      ));
    };

    return (
      <Container meeting={meetingId ? true : false}>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
          teamId={teamId}
        />
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
          <AddNewIssueText>
            {`Add a New ${company.displayFormat == "Forum" ? "Parking Lot" : "Issue"}`}
          </AddNewIssueText>
        </AddNewIssueContainer>
        <IssuesContainer meeting={meetingId ? true : false}>{renderIssuesList()}</IssuesContainer>
      </Container>
    );
  },
);

type ContainerProps = {
  meeting: boolean;
};

const Container = styled.div<ContainerProps>`
  padding: 0px 0px 15px 0px;
  height: ${props => props.meeting && "inherit"};
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: -5px;
  padding-left: 4px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type IssuesContainerProps = {
  meeting: boolean;
};

const IssuesContainer = styled.div<IssuesContainerProps>`
  overflow-y: auto;
  height: ${props => (props.meeting ? "inherit" : "260px")};
  overflow-x: hidden;
`;

const IssueContainer = styled.div``;
