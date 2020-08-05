import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label, Select } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";
import { useState } from "react";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../home/shared-components";

interface IIssueEntryProps {
  issue: any;
}

export const IssueEntry = observer(
  (props: IIssueEntryProps): JSX.Element => {
    const { issueStore } = useMst();
    const { issue } = props;

    const [showShareModal, setShowShareModal] = useState<boolean>(false);

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
        <ActionContainer>
          <DeleteButtonContainer onClick={() => issueStore.destroyIssue(issue.id)}>
            <Icon icon={"Delete"} size={20} style={{ marginTop: "2px" }} />
          </DeleteButtonContainer>
          <ShareButtonContainer>
            <Icon icon={"Forward"} size={24} style={{ marginTop: "2px" }} />
            {showShareModal && (
              <ShareIssueContainer>
                <ShareIssueText>Share Issue</ShareIssueText>
                <DestinationContainer>
                  <SendDestinationContainer>
                    <DestinationText>Destination</DestinationText>
                    <Select id="country" name="country" defaultValue={1}>
                      {[1, 2, 3].map((value, key) => (
                        <option key={key}>{value}</option>
                      ))}
                    </Select>
                  </SendDestinationContainer>
                </DestinationContainer>
              </ShareIssueContainer>
            )}
          </ShareButtonContainer>
        </ActionContainer>
      </Container>
    );
  },
);

const ActionContainer = styled.div`
  display: none;
  margin: auto;
`;

const DeleteButtonContainer = styled.div`
  color: ${props => props.theme.colors.grey60};
  padding-right: 3px;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

const ShareButtonContainer = styled.div`
  color: ${props => props.theme.colors.grey60};
  padding-left: 3px;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
  margin-right: 8px;
`;

const Container = styled.div`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
  &:hover ${ActionContainer} {
    display: flex;
  }
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

const ShareIssueContainer = styled(HomeContainerBorders)`
  position: absolute;
  background: white;
  color: black;
  width: 200px;
`;

const ShareIssueText = styled(Text)`
  size: 15px;
  font-weight: bold;
  padding-left: 8px;
  padding-right: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DestinationText = styled(Text)``;

const DestinationContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const SendDestinationContainer = styled.div`
  padding-left: 8px;
  padding-right: 8px;
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
