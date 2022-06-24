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
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { loginRequest, msalConfig } from "~/packs";
import { PublicClientApplication } from "@azure/msal-browser";
import { Image } from "rebass";

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();
    const history = useHistory();
    const instance = new PublicClientApplication(msalConfig);
    const responseGoogle = response => {
      sessionStore.logInWithProvider("go_oauth2", response);
    };

    const login = useGoogleLogin({
      onSuccess: tokenResponse => responseGoogle(tokenResponse),
    });

    const microsoftLoginHandler = instance => {
      {
        const request = {
          ...loginRequest,
        };
        instance.acquireTokenPopup(request).then(response => {
          console.log(response?.account);
          if (response?.account) {
            sessionStore.logInWithProvider("microsoft_oauth2", response?.account);
          } else {
            showToast(
              "User couldn't authenticate with microsoft. Please try another email.",
              ToastMessageConstants.ERROR,
            );
          }
        });
      }
    };

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
            <Label>{t<string>("profile.loginForm.currentlyLoggedIn")}</Label>
          ) : (
            <>
              <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="120"></img>
              <Text color={"black"} fontSize={3}>
                {t<string>("profile.loginForm.login")}
              </Text>

              {!sessionStore.logginError ? (
                <>
                  <Label htmlFor="email">{t<string>("profile.loginForm.email")}</Label>
                  <Input
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={key => {
                      if (key.keyCode == 13) {
                        sessionStore.login(email, password);
                      }
                    }}
                  />
                  <Label>{t<string>("profile.loginForm.password")}</Label>
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
                    {t<string>("profile.loginForm.login")}
                  </Button>
                  <GoogleAuthButton onClick={() => login()}>
                    <OAuthContent>
                      <img src={"assets/Google-Transparent-logo_500x500.png"} width="20"></img>
                    </OAuthContent>
                    <OAuthContent> Sign in with Google </OAuthContent>
                  </GoogleAuthButton>
                  {/* <MicrosoftAuthButton onClick={() => microsoftLoginHandler(instance)}>
                    <OAuthContent>
                      <Image
                        sx={{
                          height: 24,
                        }}
                        src={require("~/assets/images/ms-transaparent-logo.svg")}
                      />
                    </OAuthContent>
                    <OAuthContent> Sign in with Microsoft </OAuthContent>
                  </MicrosoftAuthButton> */}
                </>
              ) : sessionStore.logginError && sessionStore.logginErrorType == "no_auth" ? (
                <>
                  <Text mb={2} color={"black"} fontSize={1}>
                    {sessionStore.logginError}
                  </Text>

                  <Label htmlFor="email">{t<string>("profile.loginForm.email")}</Label>
                  <Input
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={key => {
                      if (key.keyCode == 13) {
                        sessionStore.login(email, password);
                      }
                    }}
                  />
                  <Label>{t<string>("profile.loginForm.password")}</Label>
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
                    {t<string>("profile.loginForm.login")}
                  </Button>
                </>
              ) : sessionStore.logginError && sessionStore.logginErrorType == "no_auth_yet" ? (
                <>
                  <div>{sessionStore.logginError}</div>

                  <GoogleAuthButton onClick={() => login()}>
                    <OAuthContent>
                      <img src={"assets/Google-Transparent-logo_500x500.png"} width="20"></img>
                    </OAuthContent>

                    <OAuthContent> Sign in with Google </OAuthContent>
                  </GoogleAuthButton>

                  <MicrosoftAuthButton onClick={() => microsoftLoginHandler(instance)}>
                    <OAuthContent>
                      <Image
                        sx={{
                          height: 24,
                        }}
                        src={require("~/assets/images/ms-transaparent-logo.svg")}
                      />
                    </OAuthContent>
                    <OAuthContent> Sign in with Microsoft </OAuthContent>
                  </MicrosoftAuthButton>
                </>
              ) : (
                <>
                  <div>{sessionStore.logginError}</div>

                  {sessionStore.logginError && sessionStore.logginErrorType == "google_auth" ? (
                    <GoogleAuthButton onClick={() => login()}>
                      <OAuthContent>
                        <img src={"assets/Google-Transparent-logo_500x500.png"} width="20"></img>
                      </OAuthContent>

                      <OAuthContent> Sign in with Google </OAuthContent>
                    </GoogleAuthButton>
                  ) : null}
                  {/* {sessionStore.logginError && sessionStore.logginErrorType == "microsoft_oauth" ? (
                    <MicrosoftAuthButton onClick={() => microsoftLoginHandler(instance)}>
                      <OAuthContent>
                        <Image
                          sx={{
                            height: 24,
                          }}
                          src={require("~/assets/images/ms-transaparent-logo.svg")}
                        />
                      </OAuthContent>
                      <OAuthContent> Sign in with Microsoft </OAuthContent>
                    </MicrosoftAuthButton>
                  ) : null} */}
                </>
              )}

              <TextInlineContainer
                color={"greyActive"}
                fontSize={1}
                onClick={() => history.push("/forgotpassword")}
              >
                {t<string>("profile.loginForm.forgot")}
              </TextInlineContainer>
              <Text color={"greyInactive"}>
                {t<string>("profile.loginForm.termsDescription")}
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
  box-shadow: rgb(0 0 0 / 24%) 1px 0px 4px;
  cursor: pointer;
  margin: 5% 0px;
`;

const MicrosoftAuthButton = styled(GoogleAuthButton)<ColorProps>`
  ${color}
  border-radius: 0px;
  box-shadow: none;
  border-style: solid;
  border-color: ${props => props.theme.colors.microsoftGray};
  border-width: 1.5px;
`;

const OAuthContent = styled.span`
  margin: 0px 5px;
`;

const BskContainer = styled.div`
  margin-top: 15px;
`;
