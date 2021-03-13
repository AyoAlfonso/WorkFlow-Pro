import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label, Select } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";
import { useState, useRef, useEffect } from "react";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../home/shared-components";
import { Button } from "rebass";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { Avatar, LabelSelection } from "~/components/shared";
import { toJS } from "mobx";
import { InitialsGenerator } from "~/components/shared/issues-and-key-activities/initials-generator";

interface IIssueEntryProps {
  issue: any;
  pageEnd?: boolean;
  meetingId?: number | string;
  dragHandleProps?: any;
  leftShareContainer?: boolean;
  teamId?: number | string;
}

export const IssueEntry = observer(
  (props: IIssueEntryProps): JSX.Element => {
    const {
      issueStore,
      teamStore,
      sessionStore: { scheduledGroups },
    } = useMst();
    const { issue, pageEnd, meetingId, dragHandleProps, leftShareContainer, teamId } = props;

    const teams = teamStore.teams;

    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(null);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);

    useEffect(() => {
      const issueLabels = toJS(issue.labels);
      setSelectedLabel(issueLabels ? issueLabels[0] : null);
    }, [issue]);

    const issueRef = useRef(null);

    const currentSelectedItem = issue.scheduledGroupId
      ? scheduledGroups.find(group => group.id == issue.scheduledGroupId)
      : teams.find(team => team.id == issue.teamId);

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
        case "frog":
          return (
            <Icon
              icon={"Priority-MIP"}
              size={24}
              iconColor={baseTheme.colors.mipBlue}
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
          priority = "frog";
          break;
        case "frog":
          priority = "low";
          break;
        default:
          priority = "";
      }
      issueStore.updateIssueState(issue.id, "priority", priority);
      issueStore.updateIssue(issue.id, meetingId || teamId ? true : false);
    };

    const updateLabel = labelName => {
      issueStore.updateLabel(issue.id, labelName);
    };

    const renderLabel = () => {
      if (issue.labels.length > 0) {
        return (
          <LabelSelection
            selectedLabel={selectedLabel}
            setSelectedLabel={setSelectedLabel}
            onLabelClick={setShowLabelsList}
            showLabelsList={showLabelsList}
            inlineEdit={true}
            afterLabelSelectAction={updateLabel}
          />
        );
      }
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
                issueStore.updateIssueStatus(issue, e.target.checked, meetingId ? true : false);
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

        <RightContainer>
          <RowWrapper>
            <StyledContentEditable
              innerRef={issueRef}
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
              style={{
                textDecoration: issue.completedAt && "line-through",
                cursor: "text",
                minWidth: meetingId ? "95px" : "105px",
              }}
              onBlur={() => issueStore.updateIssue(issue.id, meetingId ? true : false)}
            />

            <RightActionContainer>
              {issue.personal && <Icon icon={"Lock"} size={18} iconColor={"mipBlue"} />}

              <ActionContainer meeting={meetingId ? true : false}>
                <ActionSubContainer>
                  <ActionsDisplayContainer>
                    {meetingId && (
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
                    {!issue.personal && (
                      <ShareButtonContainer onMouseEnter={() => setShowShareModal(true)}>
                        <Icon icon={"Forward"} size={24} style={{ marginTop: "3px" }} />
                        {showShareModal && (
                          <ShareIssueContainer
                            pageEnd={pageEnd}
                            leftShareContainer={leftShareContainer}
                          >
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
                                      issueStore.updateIssueState(
                                        issue.id,
                                        "teamId",
                                        selectedTeamId,
                                      );
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
                    )}
                    {meetingId && (
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
            </RightActionContainer>
          </RowWrapper>
          <RowWrapper>
            {currentSelectedItem && (
              <InitialsWrapper>
                <InitialsGenerator name={currentSelectedItem.name} />
              </InitialsWrapper>
            )}
            {renderLabel()}
          </RowWrapper>
        </RightContainer>
      </Container>
    );
  },
);

type ActionContainerProps = {
  meeting: boolean;
};

const ActionContainer = styled.div<ActionContainerProps>`
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 4px;
  margin-right: 4px;
  display: none;
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
  width: 100%;
  padding: 6px 0px 6px 0px;
  margin-left: 8px;
  margin-right: 8px;
  &: hover ${ActionContainer} {
    display: block;
  }
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

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
  width: 90%;
`;

type ShareIssueContainerType = {
  pageEnd?: boolean;
  leftShareContainer?: boolean;
};

const ShareIssueContainer = styled(HomeContainerBorders)<ShareIssueContainerType>`
  display: block;
  position: absolute;
  background: white;
  color: black;
  width: 200px;
  margin-left: ${props => props.pageEnd && "-180px"};
  z-index: 2;
  right: ${props => props.leftShareContainer && "5px"};
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

const RowWrapper = styled.div`
  display: flex;
`;

const RightContainer = styled.div`
  width: -webkit-fill-available;
`;

const InitialsWrapper = styled.div`
  margin-left: 12px;
`;

const RightActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;
