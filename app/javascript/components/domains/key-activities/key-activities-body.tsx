import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import { Icon } from "../../shared/Icon";
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
          return <Icon icon={"Priority-High"} size={12} color={colors.cautionYellow} />;
        case "high":
          return <Icon icon={"Priority-Urgent"} size={12} color={colors.warningRed} />;
        case "frog":
          return <Icon icon={"Priority-Frog"} size={12} color={colors.finePine} />;
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
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 14px;
  margin-left: 21px;
  color: grey80;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: -5px;
  height: 45px;
  &:hover ${AddNewKeyActivityText} {
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const KeyActivitiesContainer = styled.div`
  overflow-y: auto;
  height: 290px;
`;

const KeyActivityContainer = styled.div`
  display: flex;
  font-size: 14px;
  width: 98%;
  height: 35px;
`;

const KeyActivityText = styled.p`
  margin-left: 10px;
  width: 160px;
  margin-top: auto;
  margin-bottom: auto;
  text-decoration: ${props => props["text-decoration"]};
`;

const KeyActivityPriorityContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  right: 0;
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
