import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/Icon";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateIssueModal } from "./create-issue-modal";
import { baseTheme } from "../../../themes/base";

interface IIssuesBodyProps {
  showOpenIssues: boolean;
}

export const IssuesBody = observer(
  (props: IIssuesBodyProps): JSX.Element => {
    const { issueStore } = useMst();
    const { showOpenIssues } = props;
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    useEffect(() => {
      issueStore.fetchIssues();
    }, []);

    const renderPriorityIcon = (priority: string) => {
      switch (priority) {
        case "medium":
          return <Icon icon={"Priority-High"} size={12} color={baseTheme.colors.cautionYellow} />;
        case "high":
          return <Icon icon={"Priority-Urgent"} size={12} color={baseTheme.colors.warningRed} />;
        default:
          return <></>;
      }
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return issues.map((issue, index) => (
        <IssueContainer key={issue["id"]}>
          <CheckboxContainer key={issue["id"]}>
            <Checkbox
              key={issue["id"]}
              checked={issue["completedAt"] ? true : false}
              onChange={e => {
                issueStore.updateIssueStatus(issue.id, e.target.checked);
              }}
            />
          </CheckboxContainer>

          <IssueText text-decoration={issue.completedAt && "line-through"}>
            {issue.description}
          </IssueText>
          <IssuePriorityContainer>{renderPriorityIcon(issue.priority)}</IssuePriorityContainer>
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

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
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

const IssuePriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  right: 0;
  margin-right: 10px;
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
