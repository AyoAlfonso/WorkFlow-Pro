import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { useState, useEffect } from "react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Avatar } from "~/components/shared/avatar";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";

interface IOwnedBySectionProps {
  ownedBy: UserType;
  type: string;
  userIconBorder?: string;
}

export const OwnedBySection = ({
  ownedBy,
  type,
  userIconBorder,
}: IOwnedBySectionProps): JSX.Element => {
  const { userStore, sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
  const [store, setStore] = useState<any>(null);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  useEffect(() => {
    if (type == "annualInitiative") {
      setStore(annualInitiativeStore);
    } else if (type == "quarterlyGoal") {
      setStore(quarterlyGoalStore);
    }
  }, []);

  const companyUsers = userStore.users;
  const currentUser = sessionStore.profile;
  const editable =
    ownedBy.id == currentUser.id ||
    currentUser.role == RoleCEO ||
    currentUser.role == RoleAdministrator;

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <UserSelectionDropdownList userList={companyUsers} onUserSelect={store.updateOwnedBy} />
    ) : (
      <></>
    );
  };

  return (
    <Container
      editable={editable}
      onClick={() => {
        if (editable) {
          setShowUsersList(!showUsersList);
        }
      }}
    >
      <OwnedBySubHeaderContainer>
        <SubHeaderText text={"Owned By"} />
      </OwnedBySubHeaderContainer>
      <Avatar
        avatarUrl={ownedBy.avatarUrl}
        firstName={ownedBy.firstName}
        lastName={ownedBy.lastName}
        size={45}
        marginLeft={"0px"}
        border={userIconBorder}
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
