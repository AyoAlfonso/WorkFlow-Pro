import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/icon";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { baseTheme } from "../../../themes/base";
import { CreateKeyActivityModal } from "./create-key-activity-modal";

interface IKeyActivitiesBodyProps {
  showAllKeyActivities: boolean;
}

export const KeyActivitiesBody = observer(
  (props: IKeyActivitiesBodyProps): JSX.Element => {
    const { keyActivityStore } = useMst();
    const { showAllKeyActivities } = props;
    const { colors } = baseTheme;
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    const weeklyKeyActivities = keyActivityStore.weeklyKeyActivities;
    const masterKeyActivities = keyActivityStore.masterKeyActivities;

    useEffect(() => {
      keyActivityStore.fetchKeyActivities();
    }, []);

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
          return <></>;
      }
    };

    const renderKeyActivitiesList = (): Array<JSX.Element> => {
      const keyActivities = showAllKeyActivities ? masterKeyActivities : weeklyKeyActivities;
      return keyActivities.map((keyActivity, index) => (
        <KeyActivityContainer key={keyActivity["id"]}>
          <CheckboxContainer key={keyActivity["id"]}>
            <Checkbox
              key={keyActivity["id"]}
              checked={keyActivity["completedAt"] ? true : false}
              onChange={e => {
                keyActivityStore.updateKeyActivityStatus(keyActivity, e.target.checked);
              }}
            />
          </CheckboxContainer>

          <KeyActivityText text-decoration={keyActivity.completedAt && "line-through"}>
            {keyActivity.description}
          </KeyActivityText>
          <KeyActivityPriorityContainer>
            {renderPriorityIcon(keyActivity.priority)}
          </KeyActivityPriorityContainer>
        </KeyActivityContainer>
      ));
    };

    return (
      <Container>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
        />
        <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
          <AddNewKeyActivityPlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewKeyActivityPlus>
          <AddNewKeyActivityText> Add New Key Activity</AddNewKeyActivityText>
        </AddNewKeyActivityContainer>
        <KeyActivitiesContainer>{renderKeyActivitiesList()}</KeyActivitiesContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  ${color}
  padding: 0px 0px 6px 10px;
  border-left: ${props => `1px solid ${props.theme.colors.grey40}`};
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 14pt;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewKeyActivityText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const KeyActivitiesContainer = styled.div`
  overflow-y: auto;
  height: 260px;
`;

const KeyActivityContainer = styled.div`
  display: flex;
  font-size: 14px;
  width: inherit;
  padding: 12px 0px 12px 0px;
`;

const KeyActivityText = styled.p`
  font-size: 14pt;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  width: 160px;
  margin-top: auto;
  margin-bottom: auto;
  text-decoration: ${props => props["text-decoration"]};
`;

const KeyActivityPriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 10px;
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
