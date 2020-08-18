import * as React from "react";
import * as R from "ramda";
import { Card } from "rebass";
import { Avatar } from "./avatar";
import { Text } from "./text";

import { useTranslation } from "react-i18next";

export const UserCard = ({
  firstName,
  lastName,
  email,
  avatarUrl,
  defaultAvatarColor,
  confirmedAt,
  invitationSentAt,
  resend,
  id,
}: UserCardProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Card sx={{ width: "200px", height: "100%", display: "flex", flexDirection: "row" }}>
      <Avatar
        defaultAvatarColor={defaultAvatarColor}
        firstName={firstName}
        lastName={lastName}
        avatarUrl={avatarUrl}
        marginLeft={"inherit"}
        marginRight={"8px"}
      />
      <div>
        <Text fontSize={1} fontWeight={"bold"}>{`${firstName} ${lastName}`}</Text>
        <Text fontSize={1}>{`${email}`}</Text>
      </div>
    </Card>
  );
};

interface UserCardProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  confirmedAt: string;
  invitationSentAt: string;
  resend?: any;
  defaultAvatarColor?: string;
}
