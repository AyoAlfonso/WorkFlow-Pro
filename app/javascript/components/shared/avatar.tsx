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
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  border?: string;
  defaultAvatarColor?: string;
}

type ImageContainerProps = {
  border?: string;
  size?: number;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
};

const ImageContainer = styled.div<ImageContainerProps>`
  border: ${props => props.border};
  border-radius: 9999px;
  width: ${props => props.size || 48}px;
  height: ${props => props.size || 48}px;
  min-width: ${props => props.size || 48}px;
  margin-left: ${props => props.marginLeft || "0px"};
  margin-right: ${props => props.marginRight || "0px"};
  margin-top: ${props => props.marginTop || "auto"};
  margin-bottom: ${props => props.marginBottom || "auto"};
`;

export const Avatar = ({
  firstName,
  lastName,
  avatarUrl,
  size,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  border,
  defaultAvatarColor,
}: AvatarProps): JSX.Element =>
  avatarUrl ? (
    <ImageContainer
      border={border}
      size={size}
      marginLeft={marginLeft || "auto"}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <Image
        style={{
          width: size || 48,
          height: size || 48,
          borderRadius: 9999,
        }}
        src={avatarUrl}
      />
    </ImageContainer>
  ) : (
    <UserDefaultIcon
      size={size || 48}
      firstName={firstName}
      lastName={lastName}
      marginLeft={marginLeft || "auto"}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      border={border}
      defaultAvatarColor={defaultAvatarColor}
    />
  );
