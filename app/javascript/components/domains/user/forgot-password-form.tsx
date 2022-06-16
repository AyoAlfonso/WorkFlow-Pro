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
import { TextNoMargin, Text } from "~/components/shared/text";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LoadingScreen } from "./loading-screen";

import { color, ColorProps, typography, TypographyProps } from "styled-system";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

const LogoHeaderDiv = styled.div`
  text-align: center;
`;

export const ForgotPasswordForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const validateEmail = email => {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    const resetPasswordFlow = () => {
      setLoading(true);
      if (validateEmail(email)) {
        sessionStore.resetPassword(email).then(() => {
          setLoading(false);
          setEmailSent(true);
        });
      } else {
        showToast("Please enter a valid email address", ToastMessageConstants.ERROR);
        setLoading(false);
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
          <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="120"></img>
          <Text color={"black"} fontSize={3}>
            {t<string>("profile.forgotPasswordForm.recoverPassword")}
          </Text>
          {emailSent ? (
            <SentEmailText>{t<string>("profile.forgotPasswordForm.emailSent")}</SentEmailText>
          ) : (
            <>
              <Label htmlFor="email">{t<string>("profile.loginForm.email")}</Label>
              <Input
                name="email"
                onChange={e => setEmail(e.target.value)}
                onKeyDown={key => {
                  if (key.keyCode == 13) {
                    resetPasswordFlow;
                  }
                }}
              />
              <Button
                small
                variant={"primary"}
                style={{ width: "100%", marginTop: "25px", marginBottom: "5px" }}
                disabled={!email || loading}
                onClick={resetPasswordFlow}
              >
                {t<string>("profile.forgotPasswordForm.emailMe")}
              </Button>
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
`;

const SentEmailText = styled(Text)`
  font-size: 16px;
  font-weight: normal;
`;
