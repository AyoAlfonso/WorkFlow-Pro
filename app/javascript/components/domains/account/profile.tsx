import React, { useState } from "react";
import { useMst } from "~/setup/root";

import { Box } from "rebass";
import { Label, Input } from "~/components/shared/input";
import { Button } from "~/components/shared/button";
import { useTranslation } from "react-i18next";

export const AccountProfile = (): JSX.Element => {
  const { sessionStore } = useMst();
  const [email, setEmail] = useState(sessionStore.profile.email);
  const [firstName, setFirstName] = useState(sessionStore.profile.firstName);
  const [lastName, setLastName] = useState(sessionStore.profile.lastName);
  const { t } = useTranslation();

  return (
    <Box sx={{ minWidth: "200px", maxWidth: "1000px", margin: "auto", border: "1" }}>
      <Box>
        <Label htmlFor="email">{t("profile.profileUpdateForm.email")}</Label>
        <Input name="email" onChange={e => setEmail(e.target.value)} value={email} />
        <Label htmlFor="firstName">{t("profile.profileUpdateForm.firstName")}</Label>
        <Input name="firstName" onChange={e => setFirstName(e.target.value)} value={firstName} />
        <Label htmlFor="lastName">{t("profile.profileUpdateForm.lastName")}</Label>
        <Input name="lastName" onChange={e => setLastName(e.target.value)} value={lastName} />
      </Box>
      <Box>
        <img src={sessionStore.profile.avatarUrl} width="256" height="256" />
      </Box>
      <Button small variant={"primary"} onClick={() => {}}>
        {t("general.save")}
      </Button>
    </Box>
  );
};
