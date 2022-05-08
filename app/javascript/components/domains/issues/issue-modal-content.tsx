import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { IIssue } from "../../../models/issue";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { toJS } from "mobx";
import * as R from "ramda";
import {
  Avatar,
  Button,
  LabelSelection,
  DefaultStyledLabel,
  Select,
  Text,
  StyledLabel,
} from "~/components/shared";
import { CommentLogs } from "../shared-issues-key-activities/comment-logs";
import { StyledInput, FormElementContainer } from "../scorecard/shared/modal-elements";
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";
import { OwnedBySection } from "../goals/shared/owned-by-section";
import { OwnedBy } from "../scorecard/shared/scorecard-owned-by";
import moment from "moment";
import { parseISO } from "date-fns";
import { DateButton } from "~/components/shared/date-selection/date-button";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";
import { parseKeyActivityDueDate } from "~/utils/date-time";

interface IIssueModalContentProps {
  issue: IIssue;
  setIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetingId?: number | string;
  teamId?: number | string;
}

export const IssueModalContent = observer(
  ({ issue, setIssueModalOpen, meetingId, teamId }: IIssueModalContentProps): JSX.Element => {
    const { issueStore, sessionStore, companyStore } = useMst();

    const { commentLogs } = issueStore;

    const isForum = companyStore.company.displayFormat == "Forum";
    const teams = R.path(["profile", "currentCompanyUserTeams"], sessionStore);
    const teamName = issue.teamId ? teams.find(team => team.id == issue.teamId).name : "";

    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);
    const [description, setDescription] = useState<string>(issue.body);
    const [comment, setComment] = useState<string>("");
    const [showPriorities, setShowPriorities] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(null);
    const [commentMeta, setCommentMeta] = useState({});
    const [showTopics, setShowTopics] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(issue.dueDate));

    const issueRef = useRef(null);
    const prioritiesRef = useRef(null);
    const moveRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
      issueStore.getCommentLogs(1, "Issues", issue.id).then(meta => {
        setCommentMeta(meta);
      });
    }, []);

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

    const updateLabel = labelId => {
      issueStore.updateLabel(issue.id, labelId, meetingId || teamId ? true : false);
    };

    const priorityOptions = ["frog", "high", "medium", "low"];

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
              iconColor={baseTheme.colors.tango}
              style={{ marginTop: "2px" }}
            />
          );
        case "frog":
          return (
            <Icon
              icon={"High-Priority"}
              mr={mr}
              size={size}
              iconColor={baseTheme.colors.warningRed}
              style={{ marginTop: "2px" }}
            />
          );
        default:
          return (
            <Icon
              icon={"Priority-None"}
              mr={mr}
              size={size}
              iconColor={!mr ? baseTheme.colors.greyInactive : baseTheme.colors.greyActive}
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

    const renderLabel = () => {
      return (
        <LabelSelection
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          onLabelClick={setShowLabelsList}
          showLabelsList={showLabelsList}
          inlineEdit={true}
          afterLabelSelectAction={updateLabel}
          marginLeftDropdownList={"-80px"}
        />
      );
    };

    const handleChange = html => {
      setDescription(html);
    };

    const updateDueDate = date => {
      issueStore.updateIssueState(
        issue["id"],
        "dueDate",
        R.isNil(date) ? null : moment(date).format("YYYY-MM-DD"),
      );
      issueStore.updateIssue(issue.id, meetingId || teamId ? true : false);
    };

    const dueDateObj = parseKeyActivityDueDate(issue);

    const postComment = () => {
      const commentLog = {
        ownedById: sessionStore.profile.id,
        note: comment,
        parentType: "Issues",
        parentId: issue.id,
      };

      issueStore.createCommentLog(commentLog);
    };

    const getLogs = pageNumber => {
      return issueStore.getCommentLogs(pageNumber, "Issues", issue.id).then(meta => {
        setCommentMeta(meta);
      });
    };

    const topicTypesArray = ["exploration", "brainstorm", "round table", "learning"];

    const issueTopicType = issue.topicType === "round_table" ? "round table" : issue.topicType;

    const renderHeader = (): JSX.Element => {
      return (
        <HeaderContainer>
          <IconsContainer>
            <TopLeftIconContainer>
              {isForum && issue.topicType && (
                <TopicContainer>
                  <TopicText onClick={() => setShowTopics(!showTopics)}>
                    {issueTopicType.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                  </TopicText>
                  {showTopics && (
                    <TopicTypeSelectionContainer>
                      {topicTypesArray.map((topic, index) => {
                        const formattedTopic = topic === "round table" ? "round_table" : topic;
                        return (
                          <TopicTypeOption
                            key={`topic-${index}`}
                            onClick={() => {
                              issueStore.updateIssueState(issue.id, "topicType", formattedTopic);
                              issueStore
                                .updateIssue(issue.id, meetingId || teamId ? true : false)
                                .then(() => setShowTopics(false));
                            }}
                          >
                            {topic.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                          </TopicTypeOption>
                        );
                      })}
                    </TopicTypeSelectionContainer>
                  )}
                </TopicContainer>
              )}
              <ListContainer>
                <Icon icon={"List"} size={"16px"} iconColor={"primary100"} mr="6px" />
                <ListText>{teamName || `My Issues`}</ListText>
              </ListContainer>
            </TopLeftIconContainer>
            <IconContainer ref={optionsRef} ml="auto" display="flex">
              <StyledOptionContainer onClick={() => setShowOptions(!showOptions)}>
                <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
                {showOptions && (
                  <OptionsContainer>
                    <OptionContainer
                      onClick={e => {
                        e.stopPropagation();
                        setShowShareModal(true);
                      }}
                    >
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
                                  e.stopPropagation();
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
                                    issueStore.updateIssueState(issue.id, "personal", false);
                                    issueStore.updateIssueState(issue.id, "teamId", selectedTeamId);
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
                        issueStore.updateIssueState(issue.id, "teamId", null);
                        issueStore.updateIssueState(issue.id, "personal", true);
                        issueStore
                          .updateIssue(issue.id, meetingId || teamId ? true : false)
                          .then(() => setShowOptions(false));
                      }}
                    >
                      <Icon icon={"Lock"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Lock</OptionText>
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
              </StyledOptionContainer>

              <IconContainer cursor="pointer" onClick={() => setIssueModalOpen(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} ml="8px" />
              </IconContainer>
            </IconContainer>
          </IconsContainer>
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
          <BottomRowContainer>
            <IconContainer
              onClick={() => setShowPriorities(true)}
              display="flex"
              cursor="pointer"
              mr="0.5em"
            >
              <PriorityContainer>
                {renderPriorityIcon(issue.priority)}
                {showPriorities && (
                  <PriorityDropdownContainer ref={prioritiesRef}>
                    <PriorityTopSection>
                      <PriorityIconContainer
                        onClick={e => {
                          e.stopPropagation();
                          setShowPriorities(false);
                        }}
                      >
                        <Icon icon="Close" size={12} iconColor={"greyInactive"} />
                      </PriorityIconContainer>
                    </PriorityTopSection>
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
              </PriorityContainer>
              <PriorityText>{getPriorityText(issue.priority)}</PriorityText>
            </IconContainer>
            {isForum && (
              <DateContainer mr="0.5em">
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
            {issue.personal && (
              <Icon icon={"Lock"} ml={"0.5em"} mr={"0.5em"} size={18} iconColor={"mipBlue"} />
            )}
            <AvatarContainer>
              <Avatar
                defaultAvatarColor={issue.user.defaultAvatarColor}
                firstName={issue.user.firstName}
                lastName={issue.user.lastName}
                avatarUrl={issue.user.avatarUrl}
                size={25}
              />
            </AvatarContainer>
            <OwnedByContainer>
              <OwnedBy ownedBy={issue.user} size={25} disabled={true} />
            </OwnedByContainer>
          </BottomRowContainer>
        </HeaderContainer>
      );
    };

    return (
      <Container>
        {renderHeader()}
        <SectionContainer>
          <SubHeader>Description</SubHeader>
          <TrixEditorContainer
            onBlur={() => {
              issueStore.updateIssueState(issue.id, "body", description);
              issueStore.updateIssue(issue.id, meetingId || teamId ? true : false);
            }}
          >
            <ReactQuill
              onBlur={() => {
                issueStore.updateIssueState(issue.id, "body", description);
                issueStore.updateIssue(issue.id, meetingId || teamId ? true : false);
              }}
              className="trix-objective-modal"
              theme="snow"
              modules={{
                toolbar: DndItems,
              }}
              placeholder={"Add a description..."}
              value={description}
              onChange={(content, delta, source, editor) => {
                handleChange(editor.getHTML());
              }}
            />
          </TrixEditorContainer>
        </SectionContainer>
        <SectionContainer>
          <SubHeader>Comments</SubHeader>
          <FormElementContainer>
            <StyledInput
              placeholder={"Add a comment..."}
              onChange={e => {
                setComment(e.target.value);
              }}
              value={comment}
            />
            {comment && (
              <PostButton
                small
                variant="primary"
                onClick={() => {
                  postComment();
                  setComment("");
                }}
              >
                Comment
              </PostButton>
            )}
          </FormElementContainer>
          <CommentLogs
            comments={commentLogs}
            store={issueStore}
            meta={commentMeta}
            getLogs={getLogs}
          />
        </SectionContainer>
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

const Container = styled.div`
  min-width: 15em;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 1.875em;
  overflow: auto;
  padding-left: auto;
  padding-right: auto;

  ${DefaultStyledLabel} {
    display: block;
    font-size: 13px;
  }

  ${StyledLabel} {
    font-size: 13px;
  }
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 2em;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

type IconContainerProps = {
  ml?: string;
  display?: string;
  cursor?: string;
  mr?: string;
};

const IconContainer = styled.div<IconContainerProps>`
  margin-left: ${props => (props.ml ? props.ml : "none")};
  margin-right: ${props => (props.mr ? props.mr : "none")};
  display: ${props => (props.display ? props.display : "block")};
  align-items: center;
  cursor: ${props => (props.cursor ? props.cursor : "default")};
`;

const ListText = styled.span`
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  font-family: Exo;
  font-weight: bold;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media only screen and (max-width: 768px) {
    max-width: 75px;
  }
`;

const StyledOptionContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
  pointer-events: none;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 1.25em;
  font-weight: bold;
  font-family: Exo;
  margin-bottom: 1em;
  margin-top: 1em;
  color: ${props => props.theme.colors.black};
`;

const BottomRowContainer = styled.div`
  display: flex;
  align-items: center;

  // @media only screen and (max-width: 768px) {
  //  display: block;
  // }
`;

const LabelContainer = styled.div`
  margin-right: 0.5em;
`;

const PriorityContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.borderGrey};
  display: flex;
  width: 2em;
  height: 1.5em;
  position: relative;
  align-items: center;
  border-radius: 2px;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`;

const AvatarContainer = styled.div`
  margin-left: 8px;
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const OwnedByContainer = styled.div`
  margin-left: 8px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const SubHeader = styled.p`
  margin-bottom: 1em;
  font-size: 1em;
  font-weight: bold;
`;

const SectionContainer = styled.div`
  margin-bottom: 2em;
`;

const TrixEditorContainer = styled.div`
  width: 100%;
`;

const PostButton = styled(Button)`
  margin-top: 10px;
  font-size: 14px;
`;

const PriorityDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 15em;
  z-index: 10;
  top: 25px;
  left: 20px;
`;

const PriorityTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  margin-bottom: 0.2em;
  padding: 0 0.5em;
`;

const PriorityIconContainer = styled.div`
  margin-left: auto;
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

const OptionText = styled.span`
  font-size: 0.75em;
  color: ${props => props.theme.colors.black};
`;

const OptionsContainer = styled.div`
  position: absolute;
  right: -1em;
  margin-top: 0.5em;
  // border: 1px solid black;
  width: 20em;
  box-shadow: 0px 3px 6px #00000029;
  // height: 800px;
  padding: 1em 0;
  z-index: 5;
  opacity: 1;
  border-radius: 0.625em;
  background: ${props => props.theme.colors.white};

  @media only screen and (max-width: 768px) {
    right: -2em;
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
`;

const StyledArrowIcon = styled(Icon)`
  transform: rotate(90deg);
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

const ShareTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const ShareIssueText = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  margin: 0;
`;

const DestinationContainer = styled.div``;

const SendDestinationContainer = styled.div``;

const ButtonContainer = styled.div`
  margin-top: 1em;
`;

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled("button")<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.grey60 : props.theme.colors.primary100};
  width: 64px;
  padding: 0;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
  color: white;
  outline: none;
  border: none;
  padding: 0.4em 0;
  border-radius: 4px;
`;

const PriorityText = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-left: 0.5em;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const TopLeftIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TopicText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 0.2em 0.5em;
  margin-right: 0.5em;
  border-radius: 4px;
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  font-family: Exo;
  font-weight: bold;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    max-width: 6em;
  }
`;

const TopicContainer = styled.div`
  position: relative;
`;

const ListContainer = styled.div`
  align-items: center;
  display: flex;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  border-radius: 4px;
  padding: 0.2em 0.5em;
  height: 20px;
  @media only screen and (max-width: 768px) {
    max-width: 6em;
  }
`;

const TopicTypeSelectionContainer = styled.div`
  position: absolute;
  width: 6em;
  background: ${baseTheme.colors.white};
  border-radius: 4px;
  z-index: 5;
  box-shadow: 0px 3px 6px #00000029;
  margin-top: 0.5em;
`;

const TopicTypeOption = styled.span`
  display: block;
  color: ${baseTheme.colors.black};
  font-size: 14px;
  padding: 0.5em;

  &: hover {
    color: ${baseTheme.colors.white};
    background: ${baseTheme.colors.primary100};
  }
`;

type DateContainerProps = {
  mr?: string;
};

const DateContainer = styled.div<DateContainerProps>`
  display: flex;
  align-items: center;
  width: inherit;
  margin-left: 6px;
  margin-right: ${props => (props.mr ? props.mr : "0")};
  // padding: 0px 0px 0px 10px;
  // border: 1px solid ${props => props.theme.colors.borderGrey};
  // height: 1.5em;
  // padding: 0 0.5em;
`;

const DateButtonDiv = styled.div``;
