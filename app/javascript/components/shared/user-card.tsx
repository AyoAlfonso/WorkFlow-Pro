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
  email,
  avatarUrl,
  confirmedAt,
  invitationSentAt,
  resend,
  id,
}: UserCardProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Card sx={{ width: "200px", height: "100%" }}>
      <Avatar
        firstName={firstName}
        lastName={lastName}
        avatarUrl={avatarUrl}
        marginLeft={"inherit"}
      />
      <>
        <Text fontSize={1}>{`${firstName} ${lastName}`}</Text>
        <Text fontSize={1}>{`${email}`}</Text>
        {R.isNil(confirmedAt) ? (
          <Can
            action={"create-user"}
            data={null}
            no={<Text fontSize={1}>{`Invited on ${invitationSentAt}`}</Text>}
            yes={
              <>
                <Text fontSize={1}>{`Invited on ${invitationSentAt}`}</Text>
                {resend ? (
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
                ) : (
                  <></>
                )}
              </>
            }
          />
        ) : (
          <></>
        )}
      </>
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
}
