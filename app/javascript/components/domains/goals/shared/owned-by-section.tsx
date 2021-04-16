import * as React from "react";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { useState, useEffect } from "react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Avatar } from "~/components/shared/avatar";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";

interface IOwnedBySectionProps {
  ownedBy: UserType;
  type: string;
  userIconBorder?: string;
  disabled?: boolean;
}

export const OwnedBySection = ({
  ownedBy,
  type,
  userIconBorder,
  disabled,
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
    (ownedBy.id == currentUser.id ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator) &&
    !disabled;

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <div onClick={e => e.stopPropagation()}>
        <UserSelectionDropdownList
          userList={companyUsers}
          onUserSelect={store.updateOwnedBy}
          setShowUsersList={setShowUsersList}
        />
      </div>
    ) : (
      <></>
    );
  };

  return (
    <Container>
      <EditTriggerContainer
        editable={editable}
        onClick={e => {
          if (editable) {
            setShowUsersList(!showUsersList);
          }
        }}
      >
        <Avatar
          defaultAvatarColor={ownedBy.defaultAvatarColor}
          avatarUrl={ownedBy.avatarUrl}
          firstName={ownedBy.firstName}
          lastName={ownedBy.lastName}
          size={20}
          marginLeft={"auto"}
          marginRight={"auto"}
          marginTop={"auto"}
          marginBottom={"auto"}
          border={userIconBorder}
        />
        <OwnedByName type={"small"}>
          {ownedBy.firstName} {ownedBy.lastName}
        </OwnedByName>
      </EditTriggerContainer>
      {renderUserSelectionList()}
    </Container>
  );
};

type ContainerType = {
  editable: boolean;
};

const Container = styled.div`
  margin-left: 12px;
`;

const EditTriggerContainer = styled.div<ContainerType>`
  display: flex;
  &:hover {
    cursor: ${props => props.editable && "pointer"};
  }
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const OwnedByName = styled(Text)`
  margin-left: 8px;
  color: ${props => props.theme.colors.greyActive};
`;
