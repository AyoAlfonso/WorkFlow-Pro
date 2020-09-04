import React, { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";
import { Text } from "~/components/shared/text";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared/button";
import { FileInput } from "./file-input";
import { TrixEditor } from "react-trix";

import {
  StretchContainer,
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
      companyStore,
      sessionStore: { staticData },
    } = useMst();
    const { company } = companyStore;
    const [name, setName] = useState(company.name);
    const [timezone, setTimezone] = useState(company.timezone);
    const [rallyingCry, setRallyingCry] = useState(company.rallyingCry);
    const [core1Content, setCore1Content] = useState(company.coreFour.core1Content);
    const [core2Content, setCore2Content] = useState(company.coreFour.core2Content);
    const [core3Content, setCore3Content] = useState(company.coreFour.core3Content);
    const [core4Content, setCore4Content] = useState(company.coreFour.core4Content);
    const { t } = useTranslation();

    const save = () => {
      companyStore.updateCompany({
        name,
        timezone,
        rallyingCry,
        coreFourAttributes: {
          core_1: core1Content,
          core_2: core2Content,
          core_3: core3Content,
          core_4: core4Content,
        },
      });
    };
    const submitLogo = async (files: FileList) => {
      const form = new FormData();
      form.append("logo", files[0]);
      await companyStore.updateCompanyLogo(form);
    };

    const removeLogo = () => {
      companyStore.deleteCompanyLogo();
    };

    return (
      <StretchContainer>
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
                <Input
                  disabled={true}
                  name="name"
                  onChange={e => setName(e.target.value)}
                  value={company.name}
                />

                <Label htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</Label>
                <Input disabled={true} name="fiscal_year_start" value={company.fiscalYearStart} />
                <Label htmlFor="timezone">{t("company.timezone")}</Label>
                <Input
                  disabled={true}
                  name="timezone"
                  onChange={e => setTimezone(e.target.value)}
                  value={company.timezone}
                />
              </PersonalInfoContainer>
              <ProfilePhotoSection display={"block"}>
                <PhotoContainer>
                  {company.logoUrl ? (
                    <img style={{ maxHeight: 256, maxWidth: 256 }} src={company.logoUrl}></img>
                  ) : (
                    "No Company Logo set"
                  )}
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
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ),
                      staticData.timezones,
                    )}
                  </Select>
                  <Text color={"greyActive"} fontSize={1}>
                    To modify Fiscal Start Date, {t("company.accountabilityChart")}, or The{" "}
                    {company.name} Plan, please contact Lynchpyn support.
                  </Text>

                  <Label htmlFor="rallying">{t("company.rallyingCry")}</Label>
                  <Input
                    name="rallyingCry"
                    onChange={e => {
                      setRallyingCry(e.target.value);
                    }}
                    value={rallyingCry}
                  />
                  <Label htmlFor="core1Content">{t("core.core1")}</Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Please enter Why Do We Exist?"
                    value={core1Content}
                    // uploadURL="https://domain.com/imgupload/receiving/post"
                    // uploadData={{ key1: "value", key2: "value" }}
                    //fileParamName="blob"
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setCore1Content(html);
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                  <Label htmlFor="core_2">{t("core.core2")}</Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Please enter How Do We Behave?"
                    value={core2Content}
                    // uploadURL="https://domain.com/imgupload/receiving/post"
                    // uploadData={{ key1: "value", key2: "value" }}
                    //fileParamName="blob"
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setCore2Content(html);
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                  <Label htmlFor="core_3">{t("core.core3")}</Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Please enter How Do We Behave?"
                    value={core3Content}
                    // uploadURL="https://domain.com/imgupload/receiving/post"
                    // uploadData={{ key1: "value", key2: "value" }}
                    //fileParamName="blob"
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setCore3Content(html);
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                  <Label htmlFor="core_4">{t("core.core4")}</Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Please enter 
                    How Do We Succeed?"
                    value={core4Content}
                    // uploadURL="https://domain.com/imgupload/receiving/post"
                    // uploadData={{ key1: "value", key2: "value" }}
                    //fileParamName="blob"
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setCore4Content(html);
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                </PersonalInfoContainer>
                <ProfilePhotoSection display={"block"}>
                  <PhotoContainer>
                    {company.logoUrl ? (
                      <img style={{ maxHeight: 256, maxWidth: 256 }} src={company.logoUrl}></img>
                    ) : (
                      "No Company Logo set"
                    )}
                  </PhotoContainer>
                  <PhotoModificationButtonsSection>
                    <Button
                      small
                      variant={"redOutline"}
                      onClick={removeLogo}
                      mr={2}
                      style={{ width: "120px" }}
                    >
                      {t("general.remove")}
                    </Button>
                    <FileInput labelText={t("general.upload")} onChange={submitLogo} />
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
      </StretchContainer>
    );
  },
);
