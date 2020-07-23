import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { useState, useEffect } from "react";
import { SubHeaderText } from "~/components/shared/sub-header-text";

interface IOwnedBySectionProps {
  ownedBy: UserType;
  type: string;
}

export const OwnedBySection = ({ ownedBy, type }: IOwnedBySectionProps): JSX.Element => {
  const { userStore, sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
  const [store, setStore] = useState<any>(null);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  useEffect(() => {
    if (type == "annualInitiative") {
      setStore(annualInitiativeStore);
    } else if (type == "quarterlyGoal") {
      setStore(quarterlyGoalStore);
    }
  });

  const companyUsers = userStore.users;
  const currentUser = sessionStore.profile;
  const editable = ownedBy.id == currentUser.id;

  const renderUserOptions = (): Array<JSX.Element> => {
    return companyUsers.map((user, index) => {
      return (
        <UserOption key={index} onClick={() => store.updateOwnedBy(user.id)}>
          <UserDefaultIcon
            firstName={user.firstName}
            lastName={user.lastName}
            size={45}
            marginLeft={"0px"}
          />
          <UserOptionText> {`${user.firstName} ${user.lastName}`}</UserOptionText>
        </UserOption>
      );
    });
  };

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <ActionDropdownContainer>{renderUserOptions()}</ActionDropdownContainer>
    ) : (
      <></>
    );
  };

  return (
    <Container
      editable={editable}
      onClick={() => {
        if (editable) {
          console.log("can edit!");
          setShowUsersList(!showUsersList);
        }
      }}
    >
      <OwnedBySubHeaderContainer>
        <SubHeaderText text={"Owned By"} />
      </OwnedBySubHeaderContainer>
      <UserDefaultIcon
        firstName={ownedBy.firstName}
        lastName={ownedBy.lastName}
        size={45}
        marginLeft={"0px"}
      />
      {renderUserSelectionList()}
    </Container>
  );
};

type ContainerType = {
  editable: boolean;
};

const Container = styled.div<ContainerType>`
  width: 10%;
  margin-left: 50px;
  &:hover {
    cursor: ${props => props.editable && "pointer"};
  }
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const OwnedBySubHeaderContainer = styled(SubHeaderContainer)`
  margin-bottom: 20px;
`;

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.backgroundBlue};
  margin-left: -10px;
  margin-top: 5px;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const UserOptionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const UserOption = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${UserOptionText} {
    color: white;
  }
`;
