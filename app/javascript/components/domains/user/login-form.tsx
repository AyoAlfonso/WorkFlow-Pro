import React, { useState } from "react";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";

import { Button } from "../../shared/Button";
import { Icon } from "../../shared/Icon";
import { Flex, Box } from "rebass";
import { Label, Input } from "../../shared/Input";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const LogoHeaderDiv = styled.div`
  text-align: center;
`;

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();

    return (
      <Flex
        sx={{
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {" "}
        <Box sx={{ minWidth: "200px", margin: "auto", border: "1" }}>
          {sessionStore.loggedIn ? (
            <Label>You are logged in.</Label>
          ) : (
            <>
              <LogoHeaderDiv>
                <Icon icon={"Logo"} size={"14em"} iconColor={"primary100"} paddingBottom={"15px"} />
              </LogoHeaderDiv>
              <Label htmlFor="email">{t("profile.loginForm.email")}</Label>
              <Input name="email" onChange={e => setEmail(e.target.value)} />
              <Label>{t("profile.loginForm.password")}</Label>
              <Input name="password" type="password" onChange={e => setPassword(e.target.value)} />
              <Button small variant={"primary"} onClick={() => sessionStore.login(email, password)}>
                {t("profile.loginForm.login")}
              </Button>
              <div>{t("general.loginForm.forgot")}</div>
            </>
          )}
        </Box>
      </Flex>
    );
  },
);
