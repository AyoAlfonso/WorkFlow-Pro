import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label, Select } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";
import { useState, useRef } from "react";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../home/shared-components";
import { Button } from "rebass";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { Avatar } from "~/components/shared";

interface IIssueEntryProps {
  issue: any;
  meeting?: boolean;
  pageEnd?: boolean;
  meetingId?: number | string;
  dragHandleProps?: any;
}

export const IssueEntry = observer(
  (props: IIssueEntryProps): JSX.Element => {
    const { issueStore, teamStore } = useMst();
    const { issue, meeting, pageEnd, meetingId, dragHandleProps } = props;

    const teams = teamStore.teams;

    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(null);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const issueRef = useRef(null);

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
          return (
            <Icon
              icon={"Priority-Empty"}
              size={24}
              iconColor={baseTheme.colors.greyInactive}
              style={{ marginTop: "2px" }}
            />
          );
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
      issueStore.updateIssue(issue.id, meetingId ? true : false);
    };

    return (
      <Container onMouseEnter={() => setShowShareModal(false)} {...dragHandleProps}>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultTypeAsWeekly={true}
        />

        <LeftActionsContainer>
          <CheckboxContainer key={issue["id"]}>
            <Checkbox
              key={issue["id"]}
              checked={issue["completedAt"] ? true : false}
              onChange={e => {
                issueStore.updateIssueStatus(
                  issue,
                  e.target.checked,
                  meetingId || meeting ? true : false,
                );
              }}
              sx={{
                color: baseTheme.colors.primary100,
              }}
            />
          </CheckboxContainer>

          <IssuePriorityContainer onClick={() => updatePriority()}>
            {renderPriorityIcon(issue.priority)}
          </IssuePriorityContainer>
        </LeftActionsContainer>

        <StyledContentEditable
          innerRef={issueRef}
          meeting={meeting}
          html={issue.description}
          onChange={e => {
            if (!e.target.value.includes("<div>")) {
              issueStore.updateIssueState(issue["id"], "description", e.target.value);
            }
          }}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              issueRef.current.blur();
            }
          }}
          style={{ textDecoration: issue.completedAt && "line-through", cursor: "text" }}
          onBlur={() => issueStore.updateIssue(issue.id, meetingId || meeting ? true : false)}
        />

        <ActionContainer>
          <ActionSubContainer>
            <ActionsDisplayContainer>
              {(meetingId || meeting) && (
                <AvatarContainer>
                  <Avatar
                    defaultAvatarColor={issue.user.defaultAvatarColor}
                    firstName={issue.user.firstName}
                    lastName={issue.user.lastName}
                    avatarUrl={issue.user.avatarUrl}
                    size={25}
                  />
                </AvatarContainer>
              )}

              <DeleteButtonContainer
                onClick={() => issueStore.destroyIssue(issue.id, meetingId ? true : false)}
                onMouseEnter={() => setShowShareModal(false)}
              >
                <Icon icon={"Delete"} size={20} style={{ marginTop: "2px" }} />
              </DeleteButtonContainer>
              <ShareButtonContainer onMouseEnter={() => setShowShareModal(true)}>
                <Icon icon={"Forward"} size={24} style={{ marginTop: "3px" }} />
                {showShareModal && (
                  <ShareIssueContainer pageEnd={pageEnd}>
                    <ShareIssueText>Share Issue</ShareIssueText>
                    <DestinationContainer>
                      <SendDestinationContainer>
                        <DestinationText>Destination</DestinationText>
                        <Select
                          id="country"
                          name="country"
                          value={selectedTeamId}
                          onChange={e => setSelectedTeamId(parseInt(e.target.value))}
                          style={{
                            borderRadius: "5px",
                            border: `1px solid ${baseTheme.colors.grey60}`,
                          }}
                        >
                          {[{ id: null, name: "" }, ...teams].map((value, key) => (
                            <option key={key} value={value.id}>
                              {value.name}
                            </option>
                          ))}
                        </Select>
                        <ButtonContainer>
                          <StyledButton
                            disabled={!selectedTeamId}
                            onClick={() => {
                              issueStore.updateIssueState(issue.id, "teamId", selectedTeamId);
                              issueStore.updateIssue(issue.id).then(result => {
                                if (result) {
                                  showToast(
                                    "Issue shared with team.",
                                    ToastMessageConstants.SUCCESS,
                                  );
                                }
                              });
                            }}
                          >
                            Share
                          </StyledButton>
                        </ButtonContainer>
                      </SendDestinationContainer>
                    </DestinationContainer>
                  </ShareIssueContainer>
                )}
              </ShareButtonContainer>
              {meeting && (
                <CreateKeyActivityButtonContainer
                  onMouseEnter={() => setShowShareModal(false)}
                  onClick={() => setCreateKeyActivityModalOpen(true)}
                >
                  <Icon icon={"Tasks"} size={20} style={{ marginTop: "2px" }} />
                </CreateKeyActivityButtonContainer>
              )}
            </ActionsDisplayContainer>
          </ActionSubContainer>
        </ActionContainer>
      </Container>
    );
  },
);

const ActionContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 4px;
  width: 110px;
`;

const ActionsDisplayContainer = styled.div`
  display: none;
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
  position: relative;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

const CreateKeyActivityButtonContainer = styled.div`
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
  margin-left: 8px;
  margin-right: 8px;
  &:hover ${ActionsDisplayContainer} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
  }
  &:active {
    background-color: ${props => props.theme.colors.grey20};
  }
`;

const IssuePriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  &:hover {
    cursor: pointer;
  }
`;

type StyledContentEditableProps = {
  meeting?: boolean;
};

const StyledContentEditable = styled(ContentEditable)<StyledContentEditableProps>`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  min-width: ${props => (props.meeting ? "95px" : "105px")};
  margin-top: auto;
  margin-bottom: auto;
  width: 90%;
`;

type ShareIssueContainerType = {
  pageEnd?: boolean;
};

const ShareIssueContainer = styled(HomeContainerBorders)<ShareIssueContainerType>`
  display: block;
  position: absolute;
  background: white;
  color: black;
  width: 200px;
  margin-left: ${props => props.pageEnd && "-180px"};
  z-index: 2;
`;

const ShareIssueText = styled(Text)`
  size: 15px;
  font-weight: bold;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DestinationText = styled(Text)``;

const DestinationContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const SendDestinationContainer = styled.div`
  padding-left: 12px;
  padding-right: 12px;
`;

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled(Button)<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.grey60 : props.theme.colors.primary100};
  width: 100px;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
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

const AvatarContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
`;

const LeftActionsContainer = styled.div`
  display: flex;
`;

const ActionSubContainer = styled.div`
  margin-left: auto;
  display: flex;
`;
