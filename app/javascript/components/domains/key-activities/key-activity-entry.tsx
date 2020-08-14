import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";
import { KeyActivityPriorityIcon } from "./key-activity-priority-icon";

interface IKeyActivityEntryProps {
  keyActivity: any;
}

export const KeyActivityEntry = observer(
  ({ keyActivity }: IKeyActivityEntryProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { colors } = baseTheme;

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
      keyActivityStore.updateKeyActivity(keyActivity.id);
    };

    return (
      <Container>
        <CheckboxContainer key={keyActivity["id"]}>
          <Checkbox
            key={keyActivity["id"]}
            checked={keyActivity["completedAt"] ? true : false}
            onChange={e => {
              keyActivityStore.updateKeyActivityStatus(keyActivity, e.target.checked);
            }}
          />
        </CheckboxContainer>

        <KeyActivityPriorityContainer onClick={() => updatePriority()}>
          <KeyActivityPriorityIcon priority={keyActivity.priority} />
        </KeyActivityPriorityContainer>

        <StyledContentEditable
          html={keyActivity.description}
          onChange={e =>
            keyActivityStore.updateKeyActivityState(
              keyActivity["id"],
              "description",
              e.target.value,
            )
          }
          style={{ textDecoration: keyActivity.completedAt && "line-through" }}
          onBlur={() => keyActivityStore.updateKeyActivity(keyActivity.id)}
        />
        <DeleteButtonContainer onClick={() => keyActivityStore.destroyKeyActivity(keyActivity.id)}>
          <Icon icon={"Delete"} size={20} style={{ marginTop: "2px" }} />
        </DeleteButtonContainer>
      </Container>
    );
  },
);

const DeleteButtonContainer = styled.div`
  margin: auto;
  color: ${props => props.theme.colors.grey60};
  display: none;
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;

const Container = styled.div`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
  &:hover ${DeleteButtonContainer} {
    display: block;
  }
`;

const KeyActivityPriorityContainer = styled.div`
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
