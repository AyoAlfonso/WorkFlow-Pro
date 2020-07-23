import React, { useState } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Box } from "rebass";
import { Label, Input } from "~/components/shared/input";
import { Button } from "~/components/shared/button";
import { Avatar } from "~/components/shared/avatar";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { FileInput } from "./file-input";
import { observer } from "mobx-react";

export const AccountProfile = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState(sessionStore.profile.email);
    const [firstName, setFirstName] = useState(sessionStore.profile.firstName);
    const [lastName, setLastName] = useState(sessionStore.profile.lastName);
    const { t } = useTranslation();
    // TODO: image is not re-rendering when profile changes, so avatar isn't updating until page refresh
    const submitAvatar = async (files: FileList) => {
      const form = new FormData();
      form.append("avatar", files[0]);
      await sessionStore.updateAvatar(form);
    };
    return (
      <Container>
        <HeaderContainer>
          <HeaderText>{t("profile.editProfile")}</HeaderText>
        </HeaderContainer>
        <BodyContainer>
          <PersonalInfoContainer>
            <Box>
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
            </Box>
          </PersonalInfoContainer>
          <ProfilePhotoSection>
            <PhotoContainer>
              <Avatar
                firstName={sessionStore.profile.firstName}
                lastName={sessionStore.profile.lastName}
                avatarUrl={sessionStore.profile.avatarUrl}
                size={256}
              />
            </PhotoContainer>
            <PhotoModificationButtonsSection>
              <Button small variant={"redOutline"} onClick={() => {}} mr={2}>
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
            onClick={() => {}}
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

const Container = styled.div`
  width: 100%;
  height: 600px;
`;

const BodyContainer = styled.div`
  display: flex;
  padding: 16px;
`;

const PersonalInfoContainer = styled.div`
  width: 70%;
  padding-right: 30px;
`;

const ProfilePhotoSection = styled.div`
  width: 30%;
`;

const HeaderContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
`;

const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const PhotoContainer = styled.div`
  text-align: center;
`;

const PhotoModificationButtonsSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  margin-top: 120px;
  margin-right: 20px;
`;
