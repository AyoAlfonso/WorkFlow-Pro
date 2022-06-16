import React, { useState } from "react";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { Label, Input, Select } from "~/components/shared/input";
import { Button } from "~/components/shared/button";
import { Avatar } from "~/components/shared/avatar";
import { ImageCropperModal } from "~/components/shared/image-cropper-modal";
import { useTranslation } from "react-i18next";
import { FileInput } from "./file-input";
import { AvatarModal } from "./avatarModal";
import { observer } from "mobx-react";

import {
  Container,
  BodyContainer,
  PersonalInfoContainer,
  ProfilePhotoSection,
  ProfilePhotoWrapper,
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
    const [avatarImageblub, setAvatarImageblub] = useState<any | null>(null);
    const [firstName, setFirstName] = useState(sessionStore.profile.firstName);
    const [lastName, setLastName] = useState(sessionStore.profile.lastName);
    const [timezone, setTimezone] = useState(sessionStore.profile.timezone);
    const [avatarImageModalOpen, setAvatarImageModalOpen] = useState<boolean>(false);

    const { t } = useTranslation();
    const submitAvatar = async image => {
      const form = new FormData();
      form.append("avatar", image);
      await sessionStore.updateAvatar(form, {
        note: `Updated Avatar via the User Profile module on settings page `,
      });
    };

    const readFile = file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.readAsDataURL(file);
      });
    };

    const pickAvatarImageblob = async file => {
      setAvatarImageblub(file);
      setAvatarImageModalOpen(!avatarImageModalOpen);
    };

    const inputFileUpload = async (files: FileList) => {
      const imageDataUrl = await readFile(files[0]);
      pickAvatarImageblob(imageDataUrl);
    };

    const deleteAvatar = async () => {
      await sessionStore.deleteAvatar({
        note: "Deleted Avater on profile settings module",
      });
    };

    const save = () =>
      sessionStore.updateUser(
        {
          email,
          firstName,
          lastName,
          timezone,
        },
        { note: "Edited " + t("profile.editProfile") + " on settings module" },
      );

    return (
      <Container>
        <HeaderContainer>
          <HeaderText> {t<string>("profile.editProfile")}</HeaderText>
        </HeaderContainer>
        <BodyContainer>
          <PersonalInfoContainer>
            <Label htmlFor="email">{t<string>("profile.profileUpdateForm.email")}</Label>
            <Input name="email" onChange={e => setEmail(e.target.value)} value={email} />
            <Label htmlFor="firstName">{t<string>("profile.profileUpdateForm.firstName")}</Label>
            <Input
              name="firstName"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
            <Label htmlFor="lastName">{t<string>("profile.profileUpdateForm.lastName")}</Label>
            <Input name="lastName" onChange={e => setLastName(e.target.value)} value={lastName} />
            <Label htmlFor="timezone">{t<string>("profile.profileUpdateForm.timezone")}</Label>
            <Select
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
            </Select>
          </PersonalInfoContainer>
          <ProfilePhotoSection>
            <ProfilePhotoWrapper>
              <PhotoContainer>
                <Avatar
                  defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
                  firstName={sessionStore.profile.firstName}
                  lastName={sessionStore.profile.lastName}
                  avatarUrl={sessionStore.profile.avatarUrl}
                  size={256}
                  marginRight={"auto"}
                />
              </PhotoContainer>
              <PhotoModificationButtonsSection>
                <FileInput labelText={t<string>("general.upload")} onChange={inputFileUpload} />

                {avatarImageModalOpen && (
                  <ImageCropperModal
                    image={avatarImageblub}
                    uploadCroppedImage={submitAvatar}
                    modalOpen={avatarImageModalOpen}
                    setModalOpen={setAvatarImageModalOpen}
                    headerText={t<string>("profile.updateProfileAvatar")}
                  />
                )}
                <Button
                  small
                  variant={"redOutline"}
                  onClick={deleteAvatar}
                  ml={2}
                  style={{ width: "120px" }}
                >
                  {t<string>("general.remove")}
                </Button>
              </PhotoModificationButtonsSection>
            </ProfilePhotoWrapper>
          </ProfilePhotoSection>
        </BodyContainer>
        <SaveButtonContainer>
          <Button
            small
            variant={"primary"}
            onClick={save}
            style={{
              marginTop: "auto",
              marginBottom: "24px",
              marginRight: "24px",
            }}
          >
            {t<string>("general.save")}
          </Button>
        </SaveButtonContainer>
      </Container>
    );
  },
);
