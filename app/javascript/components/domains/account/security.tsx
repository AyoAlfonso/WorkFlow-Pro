import React, { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";
import { Text } from "~/components/shared/text";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared/button";

import {
  Container,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  SaveButtonContainer,
  PersonalInfoContainer,
} from "./container-styles";

export const Security = (): JSX.Element => {
  const { sessionStore } = useMst();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const changePassword = () =>
    sessionStore.updatePassword({
      password,
      passwordConfirmation,
    });
  return (
    <Container>
      <HeaderContainer>
        <HeaderText>{t("profile.security")}</HeaderText>
      </HeaderContainer>
      <BodyContainer>
        <PersonalInfoContainer>
          <Label htmlFor="password">{t("profile.securityForm.password")}</Label>
          <Input
            name="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
          <Label htmlFor="passwordConfirmation">
            {t("profile.securityForm.passwordConfirmation")}
          </Label>
          <Input
            name="passwordConfirmation"
            type="password"
            onChange={e => setPasswordConfirmation(e.target.value)}
            value={passwordConfirmation}
          />
          <Text fontSize={1}>{t("profile.securityForm.warningText")}</Text>
          <SaveButtonContainer>
            <Button
              small
              variant={"primary"}
              onClick={changePassword}
              disabled={password == "" || password != passwordConfirmation}
              style={{
                marginTop: "auto",
                marginBottom: "24px",
                marginRight: "24px",
              }}
            >
              {t("profile.securityForm.updatePw")}
            </Button>
          </SaveButtonContainer>
        </PersonalInfoContainer>
      </BodyContainer>
    </Container>
  );
};
