import React, { useState } from "react";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { Label, Input, Select } from "~/components/shared/input";
import { Button } from "~/components/shared/button";
import { Avatar } from "~/components/shared/avatar";
import { useTranslation } from "react-i18next";
import { FileInput } from "./file-input";
import { observer } from "mobx-react";

import {
  Container,
  BodyContainer,
  PersonalInfoContainer,
  ProfilePhotoSection,
  HeaderContainer,
  HeaderText,
  PhotoContainer,
  PhotoModificationButtonsSection,
  SaveButtonContainer,
} from "./container-styles";

export const AccountProfile = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const { staticData } = sessionStore;
    const [email, setEmail] = useState(sessionStore.profile.email);
    const [firstName, setFirstName] = useState(sessionStore.profile.firstName);
    const [lastName, setLastName] = useState(sessionStore.profile.lastName);
    const [timezone, setTimezone] = useState(sessionStore.profile.timezone);
    const { t } = useTranslation();
    const submitAvatar = async (files: FileList) => {
      const form = new FormData();
      form.append("avatar", files[0]);
      await sessionStore.updateAvatar(form);
    };

    const deleteAvatar = async () => {
      await sessionStore.deleteAvatar();
    };

    const save = () =>
      sessionStore.updateUser({
        email,
        firstName,
        lastName,
        timezone,
      });

    return (
      <Container>
        <HeaderContainer>
          <HeaderText>{t("profile.editProfile")}</HeaderText>
        </HeaderContainer>
        <BodyContainer>
          <PersonalInfoContainer>
            <Label htmlFor="email">{t("profile.profileUpdateForm.email")}</Label>
            <Input name="email" onChange={e => setEmail(e.target.value)} value={email} />
            <Label htmlFor="firstName">{t("profile.profileUpdateForm.firstName")}</Label>
            <Input
              name="firstName"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
            <Label htmlFor="lastName">{t("profile.profileUpdateForm.lastName")}</Label>
            <Input name="lastName" onChange={e => setLastName(e.target.value)} value={lastName} />
            <Label htmlFor="timezone">{t("profile.profileUpdateForm.timezone")}</Label>
            <Select
              name="timezone"
              onChange={e => {
                setTimezone(e.target.value);
              }}
              value={timezone}
            >
              {R.map(
                (zone: string) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ),
                staticData.timezones,
              )}
            </Select>
          </PersonalInfoContainer>
          <ProfilePhotoSection>
            <PhotoContainer>
              <Avatar
                firstName={sessionStore.profile.firstName}
                lastName={sessionStore.profile.lastName}
                avatarUrl={sessionStore.profile.avatarUrl}
                size={256}
                marginRight={"auto"}
              />
            </PhotoContainer>
            <PhotoModificationButtonsSection>
              <Button
                small
                variant={"redOutline"}
                onClick={deleteAvatar}
                mr={2}
                style={{ width: "150px" }}
              >
                {t("general.remove")}
              </Button>
              <FileInput labelText={t("general.upload")} onChange={submitAvatar} />
            </PhotoModificationButtonsSection>
          </ProfilePhotoSection>
        </BodyContainer>
        <SaveButtonContainer>
          <Button
            small
            variant={"primary"}
            onClick={save}
            style={{
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "24px",
              marginRight: "24px",
            }}
          >
            {t("general.save")}
          </Button>
        </SaveButtonContainer>
      </Container>
    );
  },
);
