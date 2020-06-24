import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Checkbox, Label } from "@rebass/forms";
import Icon from "../../shared/Icon";
import { color } from "styled-system";

interface IKeyActivitiesBodyProps {
  showAllKeyActivities: boolean;
}

export const KeyActivitiesBody = (props: IKeyActivitiesBodyProps): JSX.Element => {
  const { keyActivityStore } = useMst();
  const { showAllKeyActivities } = props;
  const [openKeyActivities, setOpenKeyActivities] = useState<Array<any>>([]);
  const [allKeyActivities, setAllKeyActivities] = useState<Array<any>>([]);

  useEffect(() => {
    keyActivityStore.fetchKeyActivities().then(() => {
      refetchKeyActivities();
    });
  }, []);

  const refetchKeyActivities = () => {
    setOpenKeyActivities(keyActivityStore.openKeyActivities);
    setAllKeyActivities(keyActivityStore.allKeyActivities);
  };

  const renderKeyActivitiesList = (): Array<JSX.Element> => {
    const keyActivities = showAllKeyActivities ? allKeyActivities : openKeyActivities;
    return keyActivities.map((keyActivity, index) => (
      <KeyActivityContainer key={keyActivity["id"]}>
        <CheckboxContainer key={keyActivity["id"]}>
          <Checkbox
            key={keyActivity["id"]}
            checked={keyActivity["completedAt"]}
            onClick={() => {
              console.log("TODO: MAKE API CALL TO UPDATE STATUS OF KEY ACTIVITY");
              setTimeout(() => {
                keyActivityStore.updatekeyActivityStatus(keyActivity.id);
                refetchKeyActivities();
              }, 1000);
            }}
          />
        </CheckboxContainer>

        <KeyActivityText text-decoration={keyActivity.completedAt && "line-through"}>
          {keyActivity.description}
        </KeyActivityText>
      </KeyActivityContainer>
    ));
  };

  return (
    <Container>
      <AddNewKeyActivityContainer>
        <AddNewKeyActivityPlus>
          <Icon icon={"Plus"} size={16} />
        </AddNewKeyActivityPlus>
        <AddNewKeyActivityText> Add New Key Activity</AddNewKeyActivityText>
      </AddNewKeyActivityContainer>
      <KeyActivitiesContainer>{renderKeyActivitiesList()}</KeyActivitiesContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px 0px 15px 10px;
`;

const AddNewKeyActivityPlus = styled.p`
  ${color}
  font-size: 14px;
  color: grey80;
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
  width: 210px;
  margin-top: auto;
  margin-bottom: auto;
  text-decoration: ${props => props["text-decoration"]};
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
