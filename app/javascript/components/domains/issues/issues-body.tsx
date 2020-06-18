import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";

interface IIssuesBodyProps {
  showAllIssues: boolean;
}

export const IssuesBody = (props: IIssuesBodyProps): JSX.Element => {
  const { issueStore } = useMst();
  const { showAllIssues } = props;
  const [openIssues, setOpenIssues] = useState<Array<any>>([]);
  const [allIssues, setAllIssues] = useState<Array<any>>([]);

  useEffect(() => {
    issueStore.fetchIssues().then(() => {
      setOpenIssues(issueStore.openIssues);
      setAllIssues(issueStore.allIssues);
    });
  }, []);

  const renderIssuesList = (): Array<JSX.Element> => {
    const issues = showAllIssues ? allIssues : openIssues;
    return issues.map((issue, index) => (
      <IssueContainer key={index}>
        <div> BOX </div>
        <IssueText>{issue.description}</IssueText>
      </IssueContainer>
    ));
  };

  return (
    <Container>
      <AddNewIssueContainer>
        <AddNewIssuePlus>+</AddNewIssuePlus>
        <AddNewIssueText> Add New Issue</AddNewIssueText>
      </AddNewIssueContainer>
      <IssuesContainer>{renderIssuesList()}</IssuesContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px 0px 15px 10px;
`;

const AddNewIssuePlus = styled.p`
  font-size: 14px;
  color: #c4c4c4;
`;

const AddNewIssueText = styled.p`
  font-size: 14px;
  margin-left: 10px;
  color: #c4c4c4;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  &:hover ${AddNewIssueText} {
    color: #000000;
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: #4a96ed;
  }
`;

const IssuesContainer = styled.div`
  overflow-y: auto;
  height: 290px;
`;

const IssueContainer = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 10px;
`;

const IssueText = styled.div`
  margin-left: 10px;
`;
