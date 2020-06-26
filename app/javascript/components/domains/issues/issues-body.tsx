import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/Icon";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateIssueModal } from "./create-issue-modal";

interface IIssuesBodyProps {
  showAllIssues: boolean;
}

export const IssuesBody = observer(
  (props: IIssuesBodyProps): JSX.Element => {
    const { issueStore } = useMst();
    const { showAllIssues } = props;
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const allIssues = issueStore.allIssues;

    useEffect(() => {
      issueStore.fetchIssues();
    }, []);

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showAllIssues ? allIssues : openIssues;
      return issues.map((issue, index) => (
        <IssueContainer key={issue["id"]}>
          <CheckboxContainer key={issue["id"]}>
            <Checkbox
              key={issue["id"]}
              checked={issue["completedAt"]}
              onClick={() => {
                console.log("TODO: MAKE API CALL TO UPDATE STATUS OF ISSUE");
                setTimeout(() => {
                  issueStore.updateIssueStatus(issue.id);
                }, 1000);
              }}
            />
          </CheckboxContainer>

          <IssueText text-decoration={issue.completedAt && "line-through"}>
            {issue.description}
          </IssueText>
        </IssueContainer>
      ));
    };

    return (
      <Container>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
          <AddNewIssueText> Add New Issue</AddNewIssueText>
        </AddNewIssueContainer>
        <IssuesContainer>{renderIssuesList()}</IssuesContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  padding: 0px 0px 15px 10px;
`;

const AddNewIssuePlus = styled.p`
  ${color}
  font-size: 14px;
  color: grey80;
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 14px;
  margin-left: 21px;
  color: grey80;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: -5px;
  height: 45px;
  &:hover ${AddNewIssueText} {
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const IssuesContainer = styled.div`
  overflow-y: auto;
  height: 290px;
`;

const IssueContainer = styled.div`
  display: flex;
  font-size: 14px;
  width: 98%;
  height: 35px;
`;

const IssueText = styled.p`
  margin-left: 10px;
  width: 210px;
  margin-top: auto;
  margin-bottom: auto;
  text-decoration: ${props => props["text-decoration"]};
`;

const CheckboxContainer = props => (
  <Label
    {...props}
    sx={{
      width: "auto",
      marginTop: "auto",
      marginBottom: "auto",
    }}
  >
    {props.children}
  </Label>
);
