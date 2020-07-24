import * as React from "react";
import { Card } from "rebass";
import { Avatar } from "./avatar";
import { Text } from "./text";

export const UserCard = ({ firstName, lastName, avatarUrl }: UserCardProps): JSX.Element => (
  <Card>
    <Text fontSize={2}>{`${firstName} ${lastName}`}</Text>
    <Avatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
  </Card>
);

interface UserCardProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}
