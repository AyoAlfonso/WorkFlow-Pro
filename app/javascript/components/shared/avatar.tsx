import * as React from "react";
import { Image } from "rebass";
import styled from "styled-components";
import { UserDefaultIcon } from "./user-default-icon";

const StyledInitials = styled.div`
  border-radius: 9999;
  background-color: ${props => props.theme.colors.fadedGreen};
  color: ${props => props.theme.colors.white};
`;

interface AvatarProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  size?: number;
}

export const Avatar = ({ firstName, lastName, avatarUrl, size }: AvatarProps): JSX.Element =>
  avatarUrl ? (
    <Image
      sx={{
        width: size || 48,
        height: size || 48,
        borderRadius: 9999,
      }}
      src={avatarUrl}
    />
  ) : (
    <UserDefaultIcon size={size || 48} firstName={firstName} lastName={lastName} />
  );
