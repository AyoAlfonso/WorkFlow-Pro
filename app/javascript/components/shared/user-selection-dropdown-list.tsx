import * as React from "react";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "./text";

interface IUserSelectionDropdownListProps {
  userList: Array<UserType>;
  onUserSelect: any;
}

export const UserSelectionDropdownList = ({
  userList,
  onUserSelect,
}: IUserSelectionDropdownListProps): JSX.Element => {
  const renderUserOptions = (): Array<JSX.Element> => {
    return userList.map((user, index) => {
      return (
        <UserOption key={index} onClick={() => onUserSelect(user)}>
          <Avatar
            defaultAvatarColor={user.defaultAvatarColor}
            avatarUrl={user.avatarUrl}
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

  return <ActionDropdownContainer>{renderUserOptions()}</ActionDropdownContainer>;
};

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.backgroundBlue};
  margin-left: -10px;
  margin-top: 5px;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 2;
  max-height: 40%;
  overflow: auto;
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
