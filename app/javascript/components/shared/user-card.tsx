import * as React from "react";
import * as R from "ramda";
import { Card } from "rebass";
import { Avatar } from "./avatar";
import { Text } from "./text";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared/button";
import { useTranslation } from "react-i18next";

export const UserCard = ({
  firstName,
  lastName,
  avatarUrl,
  confirmedAt,
  invitationSentAt,
  resend,
  id,
}: UserCardProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Card sx={{ width: "200px", height: "200px" }}>
      <Text fontSize={2}>{`${firstName} ${lastName}`}</Text>
      {R.isNil(confirmedAt) ? (
        <Can
          action={"create-user"}
          data={null}
          no={<Text fontSize={1}>{`Invited: ${invitationSentAt}`}</Text>}
          yes={
            <>
              <Text fontSize={1}>{`Invited: ${invitationSentAt}`}</Text>
              <Button
                small
                variant={"primary"}
                onClick={() => {
                  if (resend) {
                    resend(id);
                  }
                }}
              >
                {t("profile.profileUpdateForm.resend")}
              </Button>
            </>
          }
        />
      ) : (
        <Text fontSize={1}>{`Joined: ${confirmedAt}`}</Text>
      )}
      <Avatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
    </Card>
  );
};

interface UserCardProps {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  confirmedAt: string;
  invitationSentAt: string;
  resend?: any;
}
