import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/icon";
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
          return (
            <Icon
              icon={"Priority-High"}
              size={24}
              color={baseTheme.colors.cautionYellow}
              style={{ marginTop: "2px" }}
            />
          );
        case "high":
          return (
            <Icon
              icon={"Priority-Urgent"}
              size={24}
              color={baseTheme.colors.warningRed}
              style={{ marginTop: "2px" }}
            />
          );
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
                issueStore.updateIssueStatus(issue, e.target.checked);
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

const IssueContainer = styled.div`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
`;

const IssueText = styled.p`
  font-size: 14pt;
  font-weight: 400;
  line-height: 20px;
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  text-decoration: ${props => props["text-decoration"]};
`;

const IssuePriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 10px;
`;

const CheckboxContainer = props => (
  <Label
    {...props}
    sx={{
      width: "20px",
      marginTop: "auto",
      marginBottom: "auto",
    }}
  >
    {props.children}
  </Label>
);
