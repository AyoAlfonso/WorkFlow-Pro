import { Checkbox, Label } from "@rebass/forms";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { baseTheme } from "../../../themes/base";
import { Icon } from "../../shared/icon";
import { KeyActivityPriorityIcon } from "./key-activity-priority-icon";
import { Avatar } from "~/components/shared";

interface IKeyActivityEntryProps {
  keyActivity: any;
  dragHandleProps?: any;
  meetingId?: string | number;
}

export const KeyActivityEntry = observer(
  ({ keyActivity, dragHandleProps, meetingId }: IKeyActivityEntryProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { colors } = baseTheme;
    const keyActivityRef = useRef(null);

    const updatePriority = () => {
      let priority = "";
      switch (keyActivity.priority) {
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
      keyActivityStore.updateKeyActivityState(keyActivity.id, "priority", priority);
      keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false);
    };

    const handleDescriptionChange = e => {
      if (!e.target.value.includes("<div>")) {
        keyActivityStore.updateKeyActivityState(keyActivity["id"], "description", e.target.value);
      }
    };

    return (
      <Container dragHandleProps={dragHandleProps}>
        <CheckboxContainer key={keyActivity["id"]}>
          <Checkbox
            key={keyActivity["id"]}
            checked={keyActivity["completedAt"] ? true : false}
            sx={{
              color: baseTheme.colors.primary100,
            }}
            onChange={e => {
              keyActivityStore.updateKeyActivityStatus(
                keyActivity,
                e.target.checked,
                meetingId ? true : false,
              );
            }}
          />
        </CheckboxContainer>

        <KeyActivityPriorityContainer onClick={() => updatePriority()}>
          <KeyActivityPriorityIcon priority={keyActivity.priority} />
        </KeyActivityPriorityContainer>

        {/* {dragHandleProps && (
          <HandleContainer {...dragHandleProps}>
            <Handle />
            <Handle />
            <Handle />
          </HandleContainer>
        )} */}

        <StyledContentEditable
          innerRef={keyActivityRef}
          html={keyActivity.description}
          onChange={e => handleDescriptionChange(e)}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              keyActivityRef.current.blur();
            }
          }}
          style={{ textDecoration: keyActivity.completedAt && "line-through" }}
          onBlur={() =>
            keyActivityStore.updateKeyActivity(keyActivity.id, meetingId ? true : false)
          }
        />

        <ActionContainer>
          {meetingId && (
            <AvatarContainer>
              <Avatar
                defaultAvatarColor={keyActivity.user.defaultAvatarColor}
                firstName={keyActivity.user.firstName}
                lastName={keyActivity.user.lastName}
                avatarUrl={keyActivity.user.avatarUrl}
                size={25}
              />
            </AvatarContainer>
          )}

          <DeleteButtonContainer
            onClick={() =>
              keyActivityStore.destroyKeyActivity(keyActivity.id, meetingId ? true : false)
            }
          >
            <Icon icon={"Delete"} size={20} style={{ marginTop: "2px" }} />
          </DeleteButtonContainer>
        </ActionContainer>
      </Container>
    );
  },
);

const HandleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 13px;
  margin-top: auto;
  margin-bottom: auto;
`;

const Handle = styled.div`
  width: 10px;
  height: 3px;
  background-color: ${props => props.theme.colors.grey80};
  border-radius: 4px;
`;

const DeleteButtonContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey60};
  display: none;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

type ContainerProps = {
  dragHandleProps?: any;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
  &:hover ${DeleteButtonContainer} {
    display: block;
  }
  margin-left: 8px;
  margin-right: 8px;
  &:active {
    background-color: ${props => props.dragHandleProps && props.theme.colors.grey20};
  }
`;

const KeyActivityPriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
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
  min-width: 105px;
  width: 50%;
  margin-top: auto;
  margin-bottom: auto;
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
  margin-left: 4px;
  margin-right: 4px;
`;

const ActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;
