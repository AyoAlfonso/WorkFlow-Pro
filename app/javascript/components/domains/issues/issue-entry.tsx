import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import Modal from "styled-react-modal";
import { baseTheme } from "../../../themes/base";
import { useState, useRef, useEffect } from "react";
import { Text } from "~/components/shared/text";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import {
  Avatar,
  LabelSelection,
  DefaultStyledLabel,
  Select,
  ChevronDownIcon,
  StyledLabel,
} from "~/components/shared";
import { toJS } from "mobx";
import { InitialsGenerator } from "~/components/shared/issues-and-key-activities/initials-generator";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@material-ui/core";
import { IssueModalContent } from "./issue-modal-content";
import { parseKeyActivityDueDate } from "~/utils/date-time";
import { DateButton } from "~/components/shared/date-selection/date-button";
import moment from "moment";
import { parseISO } from "date-fns";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

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
      sessionStore,
      sessionStore: { scheduledGroups },
      companyStore,
    } = useMst();
    const { issue, pageEnd, meetingId, dragHandleProps, leftShareContainer, teamId } = props;

    const { t } = useTranslation();

    const teams = R.path(["profile", "currentCompanyUserTeams"], sessionStore);

    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(null);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showPriorities, setShowPriorities] = useState<boolean>(false);
    const [spaceBelow, setSpaceBelow] = useState<number>(0);
    const [spaceRight, setSpaceRight] = useState<number>(0);
    const [issueModalOpen, setIssueModalOpen] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(issue.dueDate));
    const [numberOfUpvotes, setNumberOfUpvotes] = useState<number>(issue.cachedVotesTotal);
    const [upvoted, setUpvoted] = useState<boolean>(
      issue.upvoters.find(user => user.id === sessionStore.profile.id),
    );

    const optionsRef = useRef(null);
    const prioritiesRef = useRef(null);
    const moveRef = useRef(null);

    const isForum = companyStore.company.displayFormat == "Forum";

    useEffect(() => {
      const issueLabels = toJS(issue.labels);
      setSelectedLabel(issueLabels ? issueLabels[0] : null);
    }, [issue]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showOptions) return;

        const node = optionsRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowOptions(false);
      };

      if (showOptions) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showOptions]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showPriorities) return;

        const node = prioritiesRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowPriorities(false);
      };

      if (showPriorities) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showPriorities]);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showShareModal) return;

        const node = moveRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowShareModal(false);
      };

      if (showShareModal) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showShareModal]);

    useEffect(() => {
      const element = optionsRef.current;

      const ele = element.getBoundingClientRect();
      const height = window.innerHeight - ele.bottom;
      setSpaceBelow(height);

      const width = window.innerWidth - ele.right;
      setSpaceRight(width);
    }, [showOptions]);

    const issueRef = useRef(null);

    const currentSelectedItem = issue.scheduledGroupId
      ? scheduledGroups.find(group => group.id == issue.scheduledGroupId)
      : teams.find(team => team.id == issue.teamId);

    const renderPriorityIcon = (priority: string, size = 18, mr = 0) => {
      switch (priority) {
        case "medium":
          return (
            <Icon
              icon={"Low-Priority"}
              mr={mr}
              size={size}
              iconColor={baseTheme.colors.cautionYellow}
              style={{ marginTop: "2px" }}
            />
          );
        case "high":
          return (
            <Icon
              icon={"Medium-Priority"}
              mr={mr}
              size={size}
              iconColor={baseTheme.colors.warningRed}
              style={{ marginTop: "2px" }}
            />
          );
        case "frog":
          return (
            <Icon
              icon={"High-Priority"}
              mr={mr}
              size={size}
              iconColor={baseTheme.colors.mipBlue}
              style={{ marginTop: "2px" }}
            />
          );
        default:
          return (
            <Icon
              icon={"Priority-None"}
              mr={mr}
              size={size}
              iconColor={baseTheme.colors.greyActive}
              style={{ marginTop: "2px" }}
            />
          );
      }
    };

    const getPriorityText = text => {
      switch (text) {
        case "high":
          return "High Priority";
        case "medium":
          return "Medium Priority";
        case "frog":
          return "LynchPyn Priority";
        default:
          return "No Priority";
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

    const updateLabel = labelId => {
      issueStore.updateLabel(issue.id, labelId, meetingId || teamId ? true : false);
    };

    const renderLabel = () => {
      return (
        <LabelSelection
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          onLabelClick={setShowLabelsList}
          showLabelsList={showLabelsList}
          inlineEdit={true}
          afterLabelSelectAction={updateLabel}
          marginLeftDropdownList={"-320px"}
        />
      );
    };

    const updateDueDate = date => {
      issueStore.updateIssueState(
        issue["id"],
        "dueDate",
        R.isNil(date) ? null : moment(date).format("YYYY-MM-DD"),
      );
      issueStore.updateIssue(issue.id, meetingId || teamId ? true : false);
    };

    const priorityOptions = ["frog", "high", "medium", "low"];

    const dueDateObj = parseKeyActivityDueDate(issue);

    const issueTopicType = issue.topicType === "round_table" ? "round table" : issue.topicType;

    return (
      <Container {...dragHandleProps}>
        <LeftContainer>
          <CheckboxContainer>
            <Checkbox
              checked={issue["completedAt"] ? true : false}
              onChange={e => {
                issueStore.updateIssueStatus(
                  issue,
                  e.target.checked,
                  meetingId || teamId ? true : false,
                );
              }}
              style={{ color: baseTheme.colors.primary100 }}
              size="small"
            />
          </CheckboxContainer>
          <UpvotingContainer
            onClick={async () => {
              const res = await issueStore.upvoteIssue(issue.id);
              if (res && upvoted) {
                setNumberOfUpvotes(numberOfUpvotes - 1);
                setUpvoted(false);
              } else if (res && !upvoted) {
                setNumberOfUpvotes(numberOfUpvotes + 1);
                setUpvoted(true);
              }
            }}
          >
            <Icon
              icon="Chevron-Up"
              size="14px"
              iconColor={upvoted ? "primary100" : "greyInactive"}
              mb="0.5em"
            />
            <NumberOfVotes>{numberOfUpvotes}</NumberOfVotes>
          </UpvotingContainer>
        </LeftContainer>
        <RightContainer>
          <TopSection>
            <RowContainer topicType={issue.topicType ? true : false}>
              <TopicNameContainer>
                {isForum && issue.topicType && (
                  <TopicText>
                    {issueTopicType.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                  </TopicText>
                )}
                <IssuesName
                  onClick={() => {
                    setIssueModalOpen(true);
                  }}
                  style={{ textDecoration: issue.completedAt && "line-through" }}
                >
                  {issue.description}
                </IssuesName>
              </TopicNameContainer>

              <RightActionContainer ref={optionsRef}>
                <StyledOptionContainer onClick={() => setShowOptions(!showOptions)}>
                  <StyledOptionIcon icon={"Options"} size={"13px"} iconColor={"grey80"} />
                </StyledOptionContainer>
                {showOptions && (
                  <OptionsContainer rightDistance={spaceRight} bottomDistance={spaceBelow}>
                    <OptionContainer
                      onClick={() => {
                        setIssueModalOpen(true);
                        setShowOptions(false);
                      }}
                    >
                      <Icon icon={"Edit-2"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Edit</OptionText>
                    </OptionContainer>
                    <OptionContainer onClick={() => setShowShareModal(true)}>
                      <Icon icon={"Move2"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Move</OptionText>
                      {showShareModal && (
                        <ShareContainer ref={moveRef}>
                          <ShareTopSection>
                            <ShareIssueText>Move</ShareIssueText>
                          </ShareTopSection>

                          <DestinationContainer>
                            <SendDestinationContainer>
                              <Select
                                id="move-select"
                                name="list"
                                value={selectedTeamId || issue.teamId}
                                onChange={e => {
                                  setSelectedTeamId(parseInt(e.target.value));
                                }}
                                color={baseTheme.colors.greyActive}
                                fontSize={14}
                                pt={"0.25em"}
                                pb={"0.25em"}
                                br={"0.5em"}
                              >
                                {[{ id: null, name: "Select a List" }, ...teams].map(
                                  (value, key) => (
                                    <option key={key} value={value.id}>
                                      {value.name}
                                    </option>
                                  ),
                                )}
                              </Select>
                              <ButtonContainer>
                                <StyledButton
                                  disabled={!selectedTeamId}
                                  onClick={() => {
                                    issueStore.updateIssueState(issue.id, "teamId", selectedTeamId);
                                    issueStore.updateIssueState(issue.id, "personal", false);
                                    issueStore.updateIssue(issue.id).then(result => {
                                      if (result) {
                                        showToast(
                                          "Issue Moved Successfully.",
                                          ToastMessageConstants.SUCCESS,
                                        );
                                      }
                                      setShowOptions(false);
                                    });
                                  }}
                                >
                                  Move
                                </StyledButton>
                              </ButtonContainer>
                            </SendDestinationContainer>
                          </DestinationContainer>
                        </ShareContainer>
                      )}
                    </OptionContainer>
                    <OptionContainer
                      onClick={() => {
                        issueStore.updateIssueState(issue.id, "personal", !issue.personal);
                        issueStore.updateIssueState(issue.id, "teamId", null);
                        issueStore
                          .updateIssue(issue.id, meetingId || teamId ? true : false)
                          .then(() => setShowOptions(false));
                      }}
                    >
                      <Icon
                        icon={"Lock"}
                        size={14}
                        mr={16}
                        iconColor={issue.personal ? "mipBlue" : "greyActive"}
                      />
                      <OptionText>{issue.personal ? "Unlock" : "Lock"}</OptionText>
                    </OptionContainer>
                    <Divider />
                    <OptionContainer onClick={() => setShowPriorities(true)}>
                      {renderPriorityIcon(issue.priority, 16, 16)}
                      <OptionText>{getPriorityText(issue.priority)}</OptionText>
                      {showPriorities && (
                        <PriorityDropdownContainer ref={prioritiesRef}>
                          <PriorityTopSection></PriorityTopSection>
                          {priorityOptions.map((priority, index) => (
                            <OptionContainer
                              key={`${priority}-${index}`}
                              onClick={() => {
                                issueStore.updateIssueState(issue.id, "priority", priority);
                                issueStore
                                  .updateIssue(issue.id, meetingId || teamId ? true : false)
                                  .then(() => setShowPriorities(false));
                              }}
                            >
                              {renderPriorityIcon(priority, 14, 16)}
                              <OptionText>{getPriorityText(priority)}</OptionText>
                            </OptionContainer>
                          ))}
                        </PriorityDropdownContainer>
                      )}
                    </OptionContainer>
                    <Divider />
                    <OptionContainer
                      onClick={() =>
                        issueStore
                          .duplicateIssue(issue.id)
                          .then(res => res && setShowOptions(false))
                      }
                    >
                      <Icon icon={"Duplicate"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Duplicate</OptionText>
                    </OptionContainer>
                    <OptionContainer
                      onClick={() => issueStore.destroyIssue(issue.id, meetingId ? true : false)}
                    >
                      <Icon icon={"Delete"} size={14} mr={16} iconColor={"warningRed"} />
                      <OptionText color={baseTheme.colors.warningRed}>Delete</OptionText>
                    </OptionContainer>
                  </OptionsContainer>
                )}
                {/* {meetingId && (
                <CreateKeyActivityButtonContainer
                  onMouseEnter={() => setShowShareModal(false)}
                  onClick={() => setCreateKeyActivityModalOpen(true)}
                >
                  <Icon icon={"Tasks"} size={20} style={{ marginTop: "2px" }} />
                </CreateKeyActivityButtonContainer>
              )} */}
              </RightActionContainer>
            </RowContainer>
          </TopSection>

          <BottomRowContainer>
            <IssuePriorityContainer onClick={() => updatePriority()}>
              {renderPriorityIcon(issue.priority, 16)}
            </IssuePriorityContainer>
            {(meetingId || teamId) && (
              <AvatarContainer>
                <Avatar
                  defaultAvatarColor={issue.user.defaultAvatarColor}
                  firstName={issue.user.firstName}
                  lastName={issue.user.lastName}
                  avatarUrl={issue.user.avatarUrl}
                  size={18}
                />
              </AvatarContainer>
            )}
            {issue.personal && <Icon icon={"Lock"} mr="8px" size={16} iconColor={"mipBlue"} />}
            {isForum && (
              <DateContainer>
                <DateButtonDiv>
                  <DateButton
                    onClick={() => {
                      setShowDatePicker(true);
                      setSelectedDueDate(new Date(parseISO(issue.dueDate)));
                    }}
                    text={dueDateObj.text}
                    displayColor={dueDateObj.color}
                  />
                </DateButtonDiv>
              </DateContainer>
            )}
            <LabelContainer>{renderLabel()}</LabelContainer>
          </BottomRowContainer>

          <StyledModal
            isOpen={issueModalOpen}
            onBackgroundClick={e => {
              setIssueModalOpen(false);
            }}
          >
            <IssueModalContent issue={issue} setIssueModalOpen={setIssueModalOpen} />
          </StyledModal>
        </RightContainer>

        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultSelectedGroupId={sessionStore.getScheduledGroupIdByName("Weekly List")}
        />
        <DueDatePickerModal
          selectedDueDate={selectedDueDate}
          setSelectedDueDate={setSelectedDueDate}
          updateDueDate={updateDueDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          showDateOptions
        />
      </Container>
    );
  },
);

type RowContainerProps = {
  topicType?: boolean;
};

const RowContainer = styled.div<RowContainerProps>`
  display: flex;
  padding-top: ${props => (props.topicType ? "0.8em" : "0.3em")};
`;

const BottomRowContainer = styled("div")`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 768px) {
    padding-right: 6px;
  }
`;

const Container = styled.div`
  font-size: 14px;
  padding: 0px 0px 4px 0px;
  width: 100%;
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
  &: hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
  &:active {
    background-color: ${props => props.theme.colors.grey20};
  }
  display: flex;
  ${StyledLabel} {
    font-size: 10px;
  }
`;

const IssuePriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
  &:hover {
    cursor: pointer;
  }
`;

const ShareContainer = styled.div`
  display: block;
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 15em;
  padding: 0.5em;
  z-index: 10;
  top: 25px;
  right: 10px;
`;

const PriorityDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 15em;
  z-index: 10;
  top: 25px;
  right: 10px;
`;

const PriorityTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  margin-bottom: 0.2em;
  padding: 0 0.5em;
`;

const ShareTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const ShareIssueText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const DestinationContainer = styled.div``;

const SendDestinationContainer = styled.div`
  position: relative;
`;

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled("button")<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.grey60 : props.theme.colors.primary100};
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
  color: white;
  outline: none;
  border: none;
  border-radius: 0.25em;
  padding: 0.3em 1em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
`;

const CheckboxContainer = styled.div`
  margin-right: 0.2em;
`;

const AvatarContainer = styled.div`
  margin-top: 1.5px;
  margin-right: 8px;
`;

const RightActionContainer = styled.div`
  margin-left: auto;
  position: relative;
`;

const LabelContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  // margin-right: .5em;
`;

const IssuesName = styled(Text)`
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  width: 70%;
  cursor: pointer;
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
  pointer-events: none;
`;

const StyledOptionContainer = styled.div`
  cursor: pointer;
  padding-top: 0.3em;
`;

const TopSection = styled.div`
  margin-bottom: 5px;
  @media only screen and (max-width: 768px) {
    padding-right: 6px;
  }
`;

type OCProps = {
  bottomDistance: number;
  rightDistance: number;
};

const OptionsContainer = styled.div<OCProps>`
  position: absolute;
  right: ${props => (props.rightDistance < 200 ? "1em" : "-2em")};
  width: 20em;
  bottom: ${props => props.bottomDistance < 250 && "2em"};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em 0;
  z-index: 5;
  opacity: 1;
  border-radius: 0.625em;
  background: ${props => props.theme.colors.white};
`;

const OptionContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

type OptionTextProps = {
  color?: string;
};

const OptionText = styled.span<OptionTextProps>`
  font-size: 0.75em;
  color: ${props => (props.color ? props.color : props.theme.colors.black)};
`;
const StyledArrowIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
`;

const ShareHeader = styled.div`
  border: 1px solid #ededf2;
  display: flex;
  border-radius: 4px;
  justify-content: space-between;
  cursor: pointer;
  padding: 3px 6px;
  font-size: 13px;
  color: ${props => props.theme.colors.greyActive};
`;

const ShareDropDownContainer = styled.div`
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 4px;
  position: absolute;
  z-index: 30;
  padding: 8px 0;
  width: 100%;
  margin-top: 5px;
`;

const StyledModal = Modal.styled`
  width: 60rem;
  min-height: 6.25em;
  border-radius: 8px;
  height: 50em;
  max-height: 90%;
  overflow: auto;
  background-color: ${props => props.theme.colors.white};

  @media only screen and (max-width: 768px) {
    width: 23rem;
  }
`;

const TopicText = styled.div`
  font-size: 9px;
  color: ${props => props.theme.colors.greyActive};
  margin-bottom: 5px;
`;

const LeftContainer = styled.div`
  display: flex;
  margin-right: 15px;
`;

const UpvotingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  align-self: start;
  padding-top: 0.6em;
  cursor: pointer;
`;

const RightContainer = styled.div`
  flex-grow: 2;
`;

const TopicNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;

type DateContainerProps = {
  mr?: string;
};

const DateContainer = styled.div<DateContainerProps>`
  display: flex;
  align-items: center;
  width: inherit;
  margin-right: ${props => (props.mr ? props.mr : "0")};
`;

const DateButtonDiv = styled.div``;

const NumberOfVotes = styled.span``;
