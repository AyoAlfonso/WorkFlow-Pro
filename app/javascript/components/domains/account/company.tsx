import React, { useState, useEffect } from "react";
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
import Switch from "~/components/shared/switch";
import FormGroup from "@material-ui/core/FormGroup";
import { ImageCropperModal } from "~/components/shared/image-cropper-modal";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { useHistory } from "react-router";
import { toJS } from "mobx";
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

const formatType = {
  Milestones: "milestones",
  KeyResults: "keyResults",
};

export const Company = observer(
  (): JSX.Element => {
    const {
      companyStore,
      sessionStore,
      teamStore,
      sessionStore: { staticData },
    } = useMst();
    const history = useHistory();
    const { company } = companyStore;
    const [name, setName] = useState(company.name);
    const [timezone, setTimezone] = useState(company.timezone);
    const [forumType, setForumType] = useState(company.forumType);
    const [logoImageblub, setLogoImageblub] = useState<any | null>(null);
    const [logoImageForm, setLogoImageForm] = useState<FormData | null>(null);
    const [logoImageModalOpen, setLogoImageModalOpen] = useState<boolean>(false);
    const [executiveTeam, setExecutiveTeam] = useState<any>(null);
    const currentUser = sessionStore.profile;

    const { t } = useTranslation();
    const teams = toJS(teamStore.teams);

    useEffect(() => {
      getLogo();
      const executiveTeam = teams.find(team => team.executive == 1);
      setExecutiveTeam(executiveTeam && executiveTeam.id);
    }, [teamStore.teams]);

    const getLogo = async () => {
      if (!company.logoUrl) {
        setLogoImageForm(null);
        return;
      }
      const image = await fetch(company.logoUrl).then(r => r.blob());
      const form = new FormData();
      form.append("logo", image);
      setLogoImageForm(form);
    };

    const submitLogo = async image => {
      const form = new FormData();
      form.append("logo", image);
      setLogoImageForm(form);
      await companyStore.updateCompanyLogo(form);
    };

    const pickLogoImageblob = async file => {
      setLogoImageblub(file);
      setLogoImageModalOpen(!logoImageModalOpen);
    };

    const readFile = file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.readAsDataURL(file);
      });
    };

    const inputFileUpload = async (files: FileList) => {
      const imageDataUrl = await readFile(files[0]);
      pickLogoImageblob(imageDataUrl);
    };

    const deleteLogo = () => {
      companyStore.deleteCompanyLogo();
    };

    const ceoORAdmin = currentUser.role == RoleCEO || currentUser.role == RoleAdministrator;

    const save = () => {
      const promises: Array<Promise<any>> = [
        companyStore.updateCompany(
          {
            name,
            timezone,
            forumType,
          },
          false,
        ),
      ];
      if (logoImageblub) {
        promises.push(companyStore.updateCompanyLogo(logoImageForm));
      }
      if (executiveTeam) {
        promises.push(
          teamStore.updateTeamSettings({
            id: executiveTeam,
            executive: 1,
          }),
        );
      }

      Promise.all(promises).then(() => {
        // setTimeout(history.go, 1000, 0);
      });
    };

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.generalSettings")}</HeaderText>
        </HeaderContainer>

        <Can
          action={"update-company-details"}
          data={null}
          no={
            <BodyContainer>
              <PersonalInfoContainer>
                <Label htmlFor="name">
                  {company.accessCompany ? t("company.name") : t("company.forumName")}
                </Label>
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
                    "No Logo set"
                  )}
                </PhotoContainer>
              </ProfilePhotoSection>
            </BodyContainer>
          }
          yes={
            <>
              <BodyContainer>
                <PersonalInfoContainer>
                  <ProfilePhotoSection display={"block"}>
                    <Label htmlFor="logo">
                      {company.accessCompany ? t("company.logo") : t("company.forumLogo")}
                    </Label>
                    <PhotoContainer>
                      {company.logoUrl ? (
                        <img style={{ maxHeight: 256, maxWidth: 256 }} src={company.logoUrl}></img>
                      ) : (
                        "No Logo set"
                      )}
                    </PhotoContainer>
                    <PhotoModificationButtonsSection>
                      <FileInput labelText={t("general.upload")} onChange={inputFileUpload} />
                      <Button
                        small
                        variant={"redOutline"}
                        onClick={deleteLogo}
                        ml={2}
                        style={{ width: "120px" }}
                      >
                        {t("general.remove")}
                      </Button>

                      {logoImageModalOpen && (
                        <ImageCropperModal
                          image={logoImageblub}
                          uploadCroppedImage={submitLogo}
                          modalOpen={logoImageModalOpen}
                          setModalOpen={setLogoImageModalOpen}
                          headerText={t("company.updateLogo")}
                        />
                      )}
                    </PhotoModificationButtonsSection>
                  </ProfilePhotoSection>
                  <Label htmlFor="name">
                    {company.accessCompany ? t("company.name") : t("company.forumName")}
                  </Label>
                  <Input
                    name="name"
                    onChange={e => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                  {company.accessForum && (
                    <>
                      <Label htmlFor="forum_type">{t("company.forumType")}</Label>
                      <Select
                        name="forum_type"
                        onChange={e => {
                          setForumType(e.target.value);
                        }}
                        value={forumType}
                      >
                        {R.map(
                          (type: string) => (
                            <option key={type[0]} value={type[0]}>
                              {type[0]}
                            </option>
                          ),
                          company.forumTypesList,
                        )}
                      </Select>
                      <div style={{ marginBottom: "16px" }} />
                    </>
                  )}
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
                    {company.name} Plan, please contact LynchPyn support.
                  </Text>
                  <Label htmlFor="executive_team">{t("company.executiveTeam")}</Label>
                  <Select
                    onChange={e => {
                      e.preventDefault();
                      setExecutiveTeam(e.currentTarget.value);
                    }}
                    value={executiveTeam}
                    style={{ minWidth: "200px", marginBottom: "16px" }}
                  >
                    {teams.map(({ id, name }, index) => (
                      <option key={`option-${index}`} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </PersonalInfoContainer>
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
