import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import ContentEditable from "react-contenteditable";

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

    const renderPriorityIcon = (priority: string) => {
      switch (priority) {
        case "medium":
          return (
            <Icon
              icon={"Priority-High"}
              size={24}
              iconColor={colors.cautionYellow}
              style={{ marginTop: "2px" }}
            />
          );
        case "high":
          return (
            <Icon
              icon={"Priority-Urgent"}
              size={24}
              iconColor={colors.warningRed}
              style={{ marginTop: "2px" }}
            />
          );
        case "frog":
          return (
            <Icon
              icon={"Priority-Frog"}
              size={24}
              iconColor={colors.frog}
              style={{ marginTop: "2px" }}
            />
          );
        default:
          return <EmptyIconContainer />;
      }
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
          {renderPriorityIcon(keyActivity.priority)}
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

const KeyActivityPriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
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
