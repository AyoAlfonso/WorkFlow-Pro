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

interface IOwnedByProps {
  ownedById: UserType;
  userIconBorder?: string;
  disabled?: boolean;
  size?: number;
  marginLeft?: string
  marginRight?: string
  marginTop?: string
  marginBottom?: string
  nameWidth?: string
  fontSize?: string
}

export const OwnedBy = ({
  ownedById,
  userIconBorder,
  disabled,
  size,
  nameWidth,
  fontSize,
  ...restProps
}: IOwnedByProps): JSX.Element => {
  const { userStore, sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
  const [store, setStore] = useState<any>(null);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  useEffect(() => {
    userStore.getUser(ownedById)
  }, []);

  const currentUser = sessionStore.profile;
  const ownedBy = userStore.user || currentUser;

  return (
    <Container
      width={100}
    >
      <Avatar
        defaultAvatarColor={ownedBy.defaultAvatarColor}
        avatarUrl={ownedBy.avatarUrl}
        firstName={ownedBy.firstName}
        lastName={ownedBy.lastName}
        size={size || 20}
        border={userIconBorder}
        {...restProps}
      />
      <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
        {ownedBy.firstName} {ownedBy.lastName}
      </OwnedByName>
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0px;
  width: ${props => `${props.width}%` || 'auto'};
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
