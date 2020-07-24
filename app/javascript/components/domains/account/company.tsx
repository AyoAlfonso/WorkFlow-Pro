import React, { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared/button";
import { FileInput } from "./file-input";

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

export const Company = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
      sessionStore: { staticData },
    } = useMst();
    const [name, setName] = useState(company.name);
    const [timezone, setTimezone] = useState(company.timezone);
    const { t } = useTranslation();

    const save = () =>
      company.update({
        name,
        timezone,
      });

    return (
      <Container>
        <HeaderContainer>
          <HeaderText>{t("profile.companyDetails")}</HeaderText>
        </HeaderContainer>

        <Can
          action={"update-company-details"}
          data={null}
          no={
            <BodyContainer>
              <PersonalInfoContainer>
                <Label htmlFor="name">{t("company.name")}</Label>
                <Input disabled={true} name="name" onChange={() => {}} value={company.name} />

                <Label htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</Label>
                <Input
                  disabled={true}
                  name="fiscal_year_start"
                  onChange={() => {}}
                  value={company.fiscalYearStart}
                />
                <Label htmlFor="timezone">{t("company.timezone")}</Label>
                <Input
                  disabled={true}
                  name="timezone"
                  onChange={() => {}}
                  value={company.timezone}
                />
              </PersonalInfoContainer>
              <ProfilePhotoSection>
                <PhotoContainer>
                  {company.logoUrl ? <img src={company.logoUrl}></img> : "No Company Logo set"}
                </PhotoContainer>
              </ProfilePhotoSection>
            </BodyContainer>
          }
          yes={
            <>
              <BodyContainer>
                <PersonalInfoContainer>
                  <Label htmlFor="name">{t("company.name")}</Label>
                  <Input
                    name="name"
                    onChange={e => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                  <Label htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</Label>
                  <Input
                    disabled={true}
                    name="fiscal_year_start"
                    onChange={() => {}}
                    value={company.fiscalYearStart}
                  />
                  <Label htmlFor="timezone">{t("company.timezone")}</Label>
                  <Select
                    name="timezone"
                    onChange={e => {
                      setTimezone(e.target.value);
                    }}
                    value={timezone}
                  >
                    {R.map(
                      (zone: string) => (
                        <option key={zone}>{zone}</option>
                      ),
                      staticData.timezones,
                    )}
                  </Select>
                </PersonalInfoContainer>
                <ProfilePhotoSection>
                  <PhotoContainer>
                    {company.logoUrl ? <img src={company.logoUrl}></img> : "No Company Logo set"}
                  </PhotoContainer>
                  <PhotoModificationButtonsSection>
                    <Button small variant={"redOutline"} onClick={() => {}} mr={2}>
                      {t("general.remove")}
                    </Button>
                    <FileInput labelText={t("general.upload")} onChange={() => {}} />
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
            </>
          }
        />
      </Container>
    );
  },
);
