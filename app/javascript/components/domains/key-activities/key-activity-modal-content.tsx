import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { IKeyActivity } from "~/models/key-activity";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "../../../themes/base";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { toJS } from "mobx";
import * as R from "ramda";
import {
  Avatar,
  Button,
  LabelSelection,
  DefaultStyledLabel,
  Text,
  StyledLabel,
  UserSelectionDropdownList,
} from "~/components/shared";
import { StyledInput, FormElementContainer } from "../scorecard/shared/modal-elements";
import { DateButton } from "~/components/shared/date-selection/date-button";
import { addDays, parseISO } from "date-fns";
import Popup from "reactjs-popup";
import { Calendar } from "react-date-range";
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";
import { OwnedBySection } from "../goals/shared/owned-by-section";
import { OwnedBy } from "../scorecard/shared/scorecard-owned-by";
import moment from "moment";
import { parseKeyActivityDueDate } from "~/utils/date-time";
import { useTranslation } from "react-i18next";
import { KeyActivityPriorityIcon } from "./key-activity-priority-icon";
import { ScheduledGroupSelector } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";
import { CommentLogs } from "../shared-issues-key-activities/comment-logs";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

interface IKeyActivityModalContentProps {
  keyActivity: IKeyActivity;
  setKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetingId?: string | number;
}

export const KeyActivityModalContent = observer(
  ({
    keyActivity,
    setKeyActivityModalOpen,
    meetingId,
  }: IKeyActivityModalContentProps): JSX.Element => {
    const { keyActivityStore, sessionStore, userStore } = useMst();
    const { t } = useTranslation();

    const { commentLogs } = keyActivityStore;

    const keyActivityUser =
      keyActivity.userId && userStore.users.find(user => user.id == keyActivity.userId);

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showPriorities, setShowPriorities] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(keyActivity.body);
    const [comment, setComment] = useState<string>("");
    const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
    const [selectedLabel, setSelectedLabel] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(keyActivity.dueDate));
    const [spaceBelow, setSpaceBelow] = useState<number>(0);
    const [spaceRight, setSpaceRight] = useState<number>(0);
    const [selectedGroupId, setSelectedGroupId] = useState<number>(keyActivity.scheduledGroupId);
    const [selectedTeamId, setSelectedTeamId] = useState<number>(keyActivity.teamId);
    const [showMoveList, setShowMoveList] = useState<boolean>(false);
    const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
    const [commentMeta, setCommentMeta] = useState({});
    const [showUsersList, setShowUsersList] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState(keyActivity.user || keyActivityUser);

    const optionsRef = useRef(null);
    const prioritiesRef = useRef(null);
    const keyActivityRef = useRef(null);
    const moveRef = useRef(null);

    const teams = R.path(["profile", "currentCompanyUserTeams"], sessionStore);
    const groups = toJS(sessionStore.scheduledGroups);
    const companyUsers = userStore.users;

    const ListName = keyActivity.scheduledGroupId
      ? groups.find(group => group.id == keyActivity.scheduledGroupId)?.name
      : teams.find(group => group.id == keyActivity.teamId)?.name;

    const selectedGroupName = selectedGroupId
      ? groups.find(group => group.id == selectedGroupId)?.name
      : teams.find(group => group.id == selectedTeamId)?.name;

    useEffect(() => {
      setSelectedLabel(keyActivity.labels ? keyActivity.labels[0] : null);
    }, [keyActivity]);

    useEffect(() => {
      keyActivityStore.getCommentLogs(1, "KeyActivity", keyActivity.id).then(meta => {
        setCommentMeta(meta);
      });
    }, []);

    useEffect(() => {
      const element = optionsRef.current;

      const ele = element.getBoundingClientRect();
      const height = window.innerHeight - ele.bottom;
      setSpaceBelow(height);

      const width = window.innerWidth - ele.right;
      setSpaceRight(width);
    }, [showOptions]);

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
        if (!showMoveModal) return;

        const node = moveRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowMoveModal(false);
      };

      if (showMoveModal) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showMoveModal]);

    const handleTitleChange = e => {
      if (!e.target.value.includes("<div>")) {
        keyActivityStore.updateKeyActivityState(keyActivity["id"], "description", e.target.value);
      }
    };

    const handleChange = html => {
      setDescription(html);
    };

    const updateUser = newUser => {
      setSelectedUser(newUser);
      keyActivityStore.updateKeyActivityState(keyActivity["id"], "userId", newUser.id);
      keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false).then(() => {
        showToast(t("ToDo updated successfully"), ToastMessageConstants.SUCCESS);
      });
    };

    const dueDateObj = parseKeyActivityDueDate(keyActivity);

    const updateDueDate = date => {
      keyActivityStore.updateKeyActivityState(
        keyActivity["id"],
        "dueDate",
        R.isNil(date) ? null : moment(date).format("YYYY-MM-DD"),
      );
      keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
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

    const updateLabel = labelId => {
      keyActivityStore.updateLabel(keyActivity.id, labelId);
    };

    const renderUserSelectionList = (): JSX.Element => {
      return showUsersList ? (
        <div onClick={e => e.stopPropagation()}>
          <UserSelectionDropdownList
            userList={companyUsers}
            onUserSelect={updateUser}
            setShowUsersList={setShowUsersList}
          />
        </div>
      ) : (
        <></>
      );
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

    const priorityOptions = ["frog", "high", "medium", "low"];

    const getLogs = pageNumber => {
      return keyActivityStore
        .getCommentLogs(pageNumber, "KeyActivity", keyActivity.id)
        .then(meta => {
          setCommentMeta(meta);
        });
    };

    const postComment = () => {
      const commentLog = {
        ownedById: sessionStore.profile.id,
        note: comment,
        parentType: "KeyActivity",
        parentId: keyActivity.id,
      };

      keyActivityStore.createCommentLog(commentLog);
    };

    const renderHeader = (): JSX.Element => {
      return (
        <HeaderContainer>
          <IconsContainer>
            <ListContainer>
              <Icon icon={"List"} size={"16px"} iconColor={"primary100"} mr="6px" />
              <ListText>{ListName || `My List`}</ListText>
            </ListContainer>
            <IconContainer ref={optionsRef} ml="auto" display="flex">
              <StyledOptionContainer onClick={() => setShowOptions(!showOptions)}>
                <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
                {showOptions && (
                  <OptionsContainer rightDistance={spaceRight} bottomDistance={spaceBelow}>
                    <OptionContainer
                      onClick={e => {
                        e.stopPropagation();
                        setShowMoveModal(true);
                      }}
                    >
                      <Icon icon={"Move2"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Move</OptionText>
                      {showMoveModal && (
                        <MoveContainer ref={moveRef}>
                          <MoveTopSection>
                            <MoveText>Move</MoveText>
                          </MoveTopSection>

                          <DestinationContainer>
                            <SendDestinationContainer>
                              <ListName onClick={() => setShowMoveList(!showMoveList)}>
                                {selectedGroupName || `Select a list`}
                                <Icon
                                  icon={"Chevron-Down"}
                                  size={"16px"}
                                  iconColor={baseTheme.colors.primary80}
                                />
                              </ListName>
                              {showMoveList && (
                                <ScheduledGroupSelector
                                  selectedGroupId={selectedGroupId}
                                  setSelectedGroupId={setSelectedGroupId}
                                  selectedTeamId={selectedTeamId}
                                  setSelectedTeamId={setSelectedTeamId}
                                  listOnly={true}
                                  setShowList={() => setShowMoveList(false)}
                                />
                              )}
                              <ButtonContainer>
                                <StyledButton
                                  disabled={!selectedTeamId && !selectedGroupId}
                                  onClick={e => {
                                    e.stopPropagation();
                                    keyActivityStore.updateKeyActivityState(
                                      keyActivity.id,
                                      "personal",
                                      false,
                                    );
                                    keyActivityStore.updateKeyActivityState(
                                      keyActivity.id,
                                      "teamId",
                                      selectedTeamId,
                                    );
                                    keyActivityStore.updateKeyActivityState(
                                      keyActivity.id,
                                      "scheduledGroupId",
                                      selectedGroupId,
                                    );
                                    keyActivityStore
                                      .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                                      .then(result => {
                                        if (result) {
                                          showToast(
                                            "Todo Moved Successfully.",
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
                        </MoveContainer>
                      )}
                    </OptionContainer>
                    <OptionContainer
                      onClick={e => {
                        e.stopPropagation();
                        keyActivityStore.updateKeyActivityState(keyActivity.id, "personal", true);
                        if (keyActivity.scheduledGroupId) {
                          keyActivityStore.updateKeyActivityState(keyActivity.id, "teamId", null);
                        } else {
                          keyActivityStore.updateKeyActivityState(keyActivity.id, "teamId", null);
                          keyActivityStore.updateKeyActivityState(
                            keyActivity.id,
                            "scheduledGroupId",
                            3,
                          );
                        }
                        keyActivityStore
                          .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                          .then(() => setShowOptions(false));
                      }}
                    >
                      <Icon icon={"Lock"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Lock</OptionText>
                    </OptionContainer>
                    <Divider />
                    <OptionContainer
                      onClick={() => {
                        keyActivityStore
                          .duplicateKeyActivity(keyActivity.id)
                          .then(res => res && setShowOptions(false));
                      }}
                    >
                      <Icon icon={"Duplicate"} size={14} mr={16} iconColor={"greyActive"} />
                      <OptionText>Duplicate</OptionText>
                    </OptionContainer>
                    <OptionContainer
                      onClick={e => {
                        e.stopPropagation();
                        keyActivityStore.destroyKeyActivity(
                          keyActivity.id,
                          meetingId ? true : false,
                        );
                      }}
                    >
                      <Icon icon={"Delete"} size={14} mr={16} iconColor={"warningRed"} />
                      <OptionText color={baseTheme.colors.warningRed}>Delete</OptionText>
                    </OptionContainer>
                  </OptionsContainer>
                )}
              </StyledOptionContainer>
              <IconContainer cursor="pointer" onClick={() => setKeyActivityModalOpen(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} ml="8px" />
              </IconContainer>
            </IconContainer>
          </IconsContainer>
          <StyledContentEditable
            innerRef={keyActivityRef}
            html={keyActivity.description}
            onChange={e => handleTitleChange(e)}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                keyActivityRef.current.blur();
              }
            }}
            style={{
              textDecoration: keyActivity.completedAt && "line-through",
              cursor: "text",
            }}
            onBlur={() =>
              keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false)
            }
          />
          <BottomRowContainer>
            <IconContainer
              onClick={() => setShowPriorities(true)}
              display="flex"
              cursor="pointer"
              mr="1em"
            >
              <PriorityContainer>
                <KeyActivityPriorityIcon priority={keyActivity.priority} />
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
                          keyActivityStore.updateKeyActivityState(
                            keyActivity.id,
                            "priority",
                            priority,
                          );
                          keyActivityStore
                            .updateKeyActivity(keyActivity.id, meetingId ? true : false)
                            .then(() => setShowPriorities(false));
                        }}
                      >
                        <KeyActivityPriorityIcon size={14} mr={16} priority={priority} />
                        <OptionText>{getPriorityText(priority)}</OptionText>
                      </OptionContainer>
                    ))}
                  </PriorityDropdownContainer>
                )}
              </PriorityContainer>
              <PriorityText>{getPriorityText(keyActivity.priority)}</PriorityText>
            </IconContainer>
            <DateContainer mr="0.5em">
              <DateButtonDiv>
                <DateButton
                  onClick={() => {
                    setShowDatePicker(true);
                    setSelectedDueDate(new Date(parseISO(keyActivity.dueDate)));
                  }}
                  text={dueDateObj.text}
                  displayColor={dueDateObj.color}
                />
              </DateButtonDiv>
            </DateContainer>
            <LabelContainer>{renderLabel()}</LabelContainer>
            {keyActivity.personal && (
              <Icon icon={"Lock"} size={18} ml={"0.5em"} mr={"0.5em"} iconColor={"mipBlue"} />
            )}
            <OwnerContainer>
              <AvatarContainer>
                <Avatar
                  defaultAvatarColor={
                    keyActivity.user?.defaultAvatarColor || keyActivityUser.defaultAvatarColor
                  }
                  firstName={keyActivity.user?.firstName || keyActivityUser.firstName}
                  lastName={keyActivity.user?.lastName || keyActivityUser.lastName}
                  avatarUrl={keyActivity.user?.avatarUrl || keyActivityUser.avatarUrl}
                  size={25}
                />
              </AvatarContainer>
              <OwnedByContainer onClick={() => setShowUsersList(!showUsersList)}>
                <OwnedBy ownedBy={keyActivity.user || keyActivityUser} size={25} disabled={true} />
              </OwnedByContainer>
              <SelectionListContainer>{renderUserSelectionList()}</SelectionListContainer>
            </OwnerContainer>
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
              keyActivityStore.updateKeyActivityState(keyActivity.id, "body", description);
              keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
            }}
          >
            <ReactQuill
              onBlur={() => {
                keyActivityStore.updateKeyActivityState(keyActivity.id, "body", description);
                keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
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
            store={keyActivityStore}
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

  @media only screen and (max-width: 768px) {
    right: -1em;
  }
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

const PriorityText = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-left: 0.5em;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

type OptionTextProps = {
  color?: string;
};

const OptionText = styled.span<OptionTextProps>`
  font-size: 0.75em;
  color: ${props => (props.color ? props.color : props.theme.colors.black)};
`;

type DateContainerProps = {
  mr?: string;
};

const DateContainer = styled.div<DateContainerProps>`
  display: flex;
  align-items: center;
  width: inherit;
  margin-right: ${props => (props.mr ? props.mr : "0")};
  // padding: 0px 0px 0px 10px;
  // border: 1px solid ${props => props.theme.colors.borderGrey};
  // height: 1.5em;
  // padding: 0 0.5em;
`;

const LabelContainer = styled.div`
  margin-right: 0.5em;
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
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const OwnerContainer = styled.div`
  position: relative;
`;

const SelectionListContainer = styled.div`
  position: absolute;

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

const DateButtonDiv = styled.div``;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.greyInactive};
`;

const MoveContainer = styled.div`
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

const MoveTopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const MoveText = styled(Text)`
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

const ListName = styled.div`
  font-size: 14px;
  border: 1px solid ${props => props.theme.colors.greyInactive};
  display: flex;
  align-items: center;
  padding: 0.3em 0.4em;
  border-radius: 4px;
  justify-content: space-between;
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
