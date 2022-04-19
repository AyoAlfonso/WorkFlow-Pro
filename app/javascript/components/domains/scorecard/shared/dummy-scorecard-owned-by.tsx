import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { Avatar } from "~/components/shared/avatar";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";

interface IOwnedByProps {
  ownedBy: UserType;
  userIconBorder?: string;
  disabled?: boolean;
  size?: number;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  nameWidth?: string;
  fontSize?: string;
  setOwnedBy?: React.Dispatch<React.SetStateAction<any>>;
  center?: boolean;
}

export const DummyOwnedBy = observer(({
  ownedBy,
  userIconBorder,
  disabled,
  size,
  nameWidth,
  fontSize,
  setOwnedBy,
  center = true,
  ...restProps
}: IOwnedByProps): JSX.Element => {
  const { userStore, sessionStore} = useMst();
  const currentUser = sessionStore.profile;
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  useEffect(() => {
    if(!userStore.users) {
      userStore.fetchUsers()
    }
  })

  return (
    <Container
      width={100}
      disabled={disabled}
      onClick={() => setShowUsersList(!showUsersList)}
      center={center}
    >
      <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
        first name last name
      </OwnedByName>
      {!disabled && showUsersList && (
        <div onClick={e => e.stopPropagation()}>
          <UserSelectionDropdownList
            userList={userStore.users}
            onUserSelect={() => {}}
            setShowUsersList={setShowUsersList}
            setOwner={setOwnedBy || ((a) => {})}
          />
        </div>
      )}
    </Container>
  );
})

type ContainerProps = {
  disabled?: boolean;
  width?: number;
  center?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  ${props => props.center ? `
  justify-content: center;
  align-items: center;
    `:""}
  margin-left: 0px;
  width: ${props => `${props.width}%` || 'auto'};

  ${props => props.disabled ? "" : `
    &:hover {
      cursor: pointer;
    `}
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
