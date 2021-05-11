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
  size?: number;
  marginLeft?:string
  marginRight?:string
  marginTop?:string
  marginBottom?:string
  nameWidth?:string
  fontSize?:string
}

export const OwnedBySection = ({
  ownedBy,
  type,
  userIconBorder,
  disabled,
  size,
  nameWidth,
  fontSize,
  ...restProps
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
    (ownedBy && ownedBy.id == currentUser.id ||
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
    <Container
      width={100}
    >
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
          size={ size || 20}
          border={userIconBorder}
          {...restProps}
        />
        <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
          {ownedBy.firstName} {ownedBy.lastName}
        </OwnedByName>
      </EditTriggerContainer>
      {renderUserSelectionList()}
    </Container>
  );
};

type EditTriggerContainerType = {
  editable: boolean;
};

type ContainerProps = {
  width?: number;
}

const Container = styled.div<ContainerProps>`
   margin-left: 0px;
   width: ${props => `${props.width}%` || 'auto'};
`;

const EditTriggerContainer = styled.div<EditTriggerContainerType>`
  display: flex;
  align-items: center center;
  &:hover {
    cursor: ${props => props.editable && "pointer"};
  }
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const OwnedByName = styled(Text)`
  margin-left: 8px;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.black};
  width: ${props => `${props.nameWidth}` || 'auto'};
  overflow: hidden; 
  font-size: ${props => `${props.fontSize}` || '12px'};
  text-overflow: ellipsis;
`;
