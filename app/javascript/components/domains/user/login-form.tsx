import React, { useState } from "react";
import { baseTheme } from "../../../themes";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";

import { Button } from "../../shared/button";
import { Icon } from "../../shared/icon";
import { Flex, Box } from "rebass";
import { Label, Input } from "../../shared/input";
import { Text } from "~/components/shared/text";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LoadingScreen } from "./loading-screen";

const LogoHeaderDiv = styled.div`
  text-align: center;
`;

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();

    if (sessionStore.loading) return <LoadingScreen />;
    return (
      <Flex
        sx={{
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: baseTheme.colors.backgroundGrey,
        }}
      >
        <Box
          sx={{
            width: "480px",
            margin: "auto",
            border: "1",
            padding: "32px",
            borderRadius: "10px",
            backgroundColor: baseTheme.colors.white,
          }}
        >
          {sessionStore.loggedIn ? (
            <Label>{t("profile.loginForm.currentlyLoggedIn")}</Label>
          ) : (
            <>
              <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="120"></img>
              <Text color={"black"} fontSize={3}>
                {t("profile.loginForm.login")}
              </Text>
              <Label htmlFor="email">{t("profile.loginForm.email")}</Label>
              <Input name="email" onChange={e => setEmail(e.target.value)} />
              <Label>{t("profile.loginForm.password")}</Label>
              <Input name="password" type="password" onChange={e => setPassword(e.target.value)} />
              <Button
                small
                variant={"primary"}
                style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
                onClick={() => sessionStore.login(email, password)}
              >
                {t("profile.loginForm.login")}
              </Button>
              <Text color={"greyActive"} fontSize={1}>
                {t("profile.loginForm.forgot")}
              </Text>
            </>
          )}
        </Box>
      </Flex>
    );
  },
);
