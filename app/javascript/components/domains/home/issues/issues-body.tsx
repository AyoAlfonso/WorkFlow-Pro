import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

export const IssuesBody = observer(
  (): JSX.Element => {
    const renderIssuesList = (): Array<JSX.Element> => {
      const placeholderIssues = [
        "MaRS Health Innovation Week",
        "The project manager at Southlake is not responsive",
        "Test Item 1",
        "Test Item 2",
        "Test Item 3",
        "Test Item 4",
        "Test Item 5",
        "Test Item 6",
        "Test Item 7",
        "Test Item 8",
        "Test Item 9",
        "Test Item 10",
        "Test Item 11"
      ];

      return placeholderIssues.map((issue, index) => (
        <IssueContainer key={index}>
          <div> BOX </div>
          <IssueText>{issue}</IssueText>
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
  }
);

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
