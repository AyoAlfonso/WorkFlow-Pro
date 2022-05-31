import React, { useState, useEffect } from "react";
import { baseTheme } from "../../../themes";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
// import GoogleLogin from "react-google-login";
import { Button } from "../../shared/button";
import { Icon } from "../../shared/icon";
import { Flex, Box } from "rebass";
import { Label, Input } from "../../shared/input";
import { TextNoMargin, Text } from "~/components/shared/text";
import { gapi } from "gapi-script";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LoadingScreen } from "./loading-screen";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { color, ColorProps, typography, TypographyProps } from "styled-system";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

const LogoHeaderDiv = styled.div`
  text-align: center;
`;

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [googleAuth, setGoogleAuth] = useState(null);
    const { t } = useTranslation();
    const history = useHistory();
    const responseGoogle = response => {
      console.log("google_oauth2", response);
      sessionStore.logInWithProvider("google_oauth2", response);
    };
    const responseGoogleFailure = response => {
      console.log("google_oauth2 failure", response);
      // sessionStore.logInWithProvider("google_oauth2", response);
    };

    const googleHandler = () => {
      // googleAuth.grantOfflineAccess().then(responseGoogle);
    };
    // useEffect(() => {
    //   // Initialize the GoogleAuth object
    //   gapi.load("auth2", function foo() {
    //     const auth = gapi.auth2.init({
    //       client_id: process.env.GOOGLE_CLIENT_ID,
    //       scope: "email profile",
    //       ux_mode: "redirect",
    //     });
    //     setGoogleAuth(auth);
    //     console.log("Init");
    //   });
    // }, []);
    const login = useGoogleLogin({
      onSuccess: tokenResponse => responseGoogle(tokenResponse),
    });
    if (sessionStore.loading) return <LoadingScreen />;
    return (
      <Flex
        sx={{
          alignItems: "center",
          height: "100vh",
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
              <Input
                name="email"
                onChange={e => setEmail(e.target.value)}
                onKeyDown={key => {
                  if (key.keyCode == 13) {
                    sessionStore.login(email, password);
                  }
                }}
              />
              <Label>{t("profile.loginForm.password")}</Label>
              <Input
                name="password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                onKeyDown={key => {
                  if (key.keyCode == 13) {
                    sessionStore.login(email, password);
                  }
                }}
              />
              <Button
                small
                variant={"primary"}
                style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
                onClick={() => sessionStore.login(email, password)}
              >
                {t("profile.loginForm.login")}
              </Button>
              {/* <GoogleAuthButton onClick={() => login()}>
                <GoogleAuthContent>
                  <img src={"assets/Google-Transparent-logo_500x500.png"} width="20"></img>
                </GoogleAuthContent>

                <GoogleAuthContent> Sign in with Google </GoogleAuthContent>
              </GoogleAuthButton> */}
              <TextInlineContainer
                color={"greyActive"}
                fontSize={1}
                onClick={() => history.push("/forgotpassword")}
              >
                {t("profile.loginForm.forgot")}
              </TextInlineContainer>
              <Text color={"greyInactive"}>
                {t("profile.loginForm.termsDescription")}
                <a href="https://lynchpyn.com/terms-of-use/">Terms of Use</a> and{" "}
                <a href="https://lynchpyn.com/privacy-policy/">Privacy Policy</a>
              </Text>
            </>
          )}
        </Box>
      </Flex>
    );
  },
);

const TextInlineContainer = styled.div<ColorProps & TypographyProps>`
  ${typography}
  ${color}
  &:hover {
    cursor: pointer;
  }
  margin-top: 5px;
`;

const GoogleAuthButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0.5rem;
  box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
  cursor: pointer;
`;
const GoogleAuthContent = styled.span`
  margin: 0px 5px;
`;
