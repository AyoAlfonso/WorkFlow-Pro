import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";

interface IIssueEntryProps {
  issue: any;
}

export const IssueEntry = observer(
  (props: IIssueEntryProps): JSX.Element => {
    const { issueStore } = useMst();
    const { issue } = props;

    const renderPriorityIcon = (priority: string) => {
      switch (priority) {
        case "medium":
          return (
            <Icon
              icon={"Priority-High"}
              size={24}
              iconColor={baseTheme.colors.cautionYellow}
              style={{ marginTop: "2px" }}
            />
          );
        case "high":
          return (
            <Icon
              icon={"Priority-Urgent"}
              size={24}
              iconColor={baseTheme.colors.warningRed}
              style={{ marginTop: "2px" }}
            />
          );
        default:
          return <EmptyIconContainer />;
      }
    };

    const updatePriority = () => {
      let priority = "";
      switch (issue.priority) {
        case "low":
          priority = "medium";
          break;
        case "medium":
          priority = "high";
          break;
        case "high":
          priority = "low";
          break;
        default:
          priority = "";
      }
      issueStore.updateIssueState(issue.id, "priority", priority);
      issueStore.updateIssue(issue.id);
    };

    return (
      <Container>
        <CheckboxContainer key={issue["id"]}>
          <Checkbox
            key={issue["id"]}
            checked={issue["completedAt"] ? true : false}
            onChange={e => {
              issueStore.updateIssueStatus(issue, e.target.checked);
            }}
          />
        </CheckboxContainer>

        <IssuePriorityContainer onClick={() => updatePriority()}>
          {renderPriorityIcon(issue.priority)}
        </IssuePriorityContainer>
        <StyledContentEditable
          html={issue.description}
          onChange={e => issueStore.updateIssueState(issue["id"], "description", e.target.value)}
          style={{ textDecoration: issue.completedAt && "line-through" }}
          onBlur={() => issueStore.updateIssue(issue.id)}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
`;

const IssuePriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14pt;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  width: 160px;
  margin-top: auto;
  margin-bottom: auto;
`;

const EmptyIconContainer = styled.div`
  width: 24px;
  height: 24px;
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
