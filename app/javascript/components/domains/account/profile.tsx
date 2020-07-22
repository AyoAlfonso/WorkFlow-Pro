import React, { useRef, useState } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Box } from "rebass";
import { Label, Input } from "~/components/shared/input";
import { Button } from "~/components/shared/button";
import { Avatar } from "~/components/shared/avatar";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { FileInput } from "./file-input";

export const AccountProfile = (): JSX.Element => {
  const { sessionStore } = useMst();
  const [email, setEmail] = useState(sessionStore.profile.email);
  const [firstName, setFirstName] = useState(sessionStore.profile.firstName);
  const [lastName, setLastName] = useState(sessionStore.profile.lastName);
  const { t } = useTranslation();
  const submitProfile = async (files: FileList) => {
    const payload = await fetch(`http://localhost:3000/s3/direct_post`).then(res => res.json());
    const url = payload.url;
    const formData = new FormData();
    Object.keys(payload.fields).forEach(key => formData.append(key, payload.fields[key]));
    formData.append("file", files[0]);
    const xml = await fetch(url, {
      method: "POST",
      body: formData,
    }).then(res => res.text());
    alert(xml);
  };
  return (
    <Container>
      <HeaderContainer>
        <HeaderText>{t("profile.editProfile")}</HeaderText>
      </HeaderContainer>
      <BodyContainer>
        <PersonalInfoContainer>
          <Box>
            <StyledLabel htmlFor="email">{t("profile.profileUpdateForm.email")}</StyledLabel>
            <StyledInput name="email" onChange={e => setEmail(e.target.value)} value={email} />
            <StyledLabel htmlFor="firstName">
              {t("profile.profileUpdateForm.firstName")}
            </StyledLabel>
            <StyledInput
              name="firstName"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
            <StyledLabel htmlFor="lastName">{t("profile.profileUpdateForm.lastName")}</StyledLabel>
            <StyledInput
              name="lastName"
              onChange={e => setLastName(e.target.value)}
              value={lastName}
            />
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
            <FileInput labelText={t("general.upload")} onChange={submitProfile} />
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
};

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

const StyledLabel = styled(Label)`
  font-size: 16px;
  font-weight: bold;
`;

const StyledInput = styled(Input)`
  border-color: ${props => props.theme.colors.grey40} !important;
  border-radius: 5px;
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
