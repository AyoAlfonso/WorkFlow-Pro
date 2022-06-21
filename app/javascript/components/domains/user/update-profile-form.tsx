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

export const UpdateProfileForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [firstName, setFirstName] = useState<string>(sessionStore.profile.firstName);
    const [lastName, setLastName] = useState<string>(sessionStore.profile.lastName);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const updateUserProfile = () => {
      setLoading(true);
      if (firstName && lastName) {
        sessionStore
          .updateUser(
            { firstName, lastName },
            { note: "Edited " + t("profile.editProfile") + " on onboarding module" },
          )
          .then(() => {
            setLoading(false);
          });
      } else {
        showToast("Please enter all required fields ", ToastMessageConstants.ERROR);
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
            Update Your Profile
          </Text>

          <>
            <Label htmlFor="firstName">{t<string>("profile.profileUpdateForm.firstName")}</Label>
            <Input
              name="firstName"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
            <Label htmlFor="lastName">{t<string>("profile.profileUpdateForm.lastName")}</Label>
            <Input name="lastName" onChange={e => setLastName(e.target.value)} value={lastName} />

            {/* <Select
              name="timezone"
              onChange={e => {
                setTimezone(e.target.value);
              }}
              value={timezone}
              width={"100%"}
            >
              {R.map(
                (zone: string) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ),
                staticData.timezones,
              )}
            </Select> */}
            <Button
              small
              variant={"primary"}
              style={{ width: "100%", marginTop: "25px", marginBottom: "5px" }}
              disabled={!firstName || loading || !lastName}
              onClick={updateUserProfile}
            >
              {t<string>("profile.profileUpdateForm.save")}
            </Button>
          </>
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
