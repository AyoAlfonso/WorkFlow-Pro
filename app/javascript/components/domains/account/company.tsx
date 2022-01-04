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
import { ImageCropperModal } from "~/components/shared/image-cropper-modal";
import { TrixEditor } from "react-trix";
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
    const [rallyingCry, setRallyingCry] = useState(company.rallyingCry);
    const [core1Content, setCore1Content] = useState(company.coreFour.core1Content);
    const [core2Content, setCore2Content] = useState(company.coreFour.core2Content);
    const [core3Content, setCore3Content] = useState(company.coreFour.core3Content);
    const [core4Content, setCore4Content] = useState(company.coreFour.core4Content);
    const [logoImageblub, setLogoImageblub] = useState<any | null>(null);
    const [logoImageForm, setLogoImageForm] = useState<FormData | null>(null);
    const [logoImageModalOpen, setLogoImageModalOpen] = useState<boolean>(false);
    const [executiveTeam, setExecutiveTeam] = useState<any>(null);
    const [objectivesKeyType, setObjectivesKeyType] = useState<string>(
      formatType[company.objectivesKeyType],
    );
    const [annualInitiativeTitle, setAnnualInitiativeTitle] = useState<string>(
      sessionStore.annualInitiativeTitle,
    );
    const [quarterlyGoalTitle, setQuarterlyGoalTitle] = useState<string>(
      sessionStore.quarterlyGoalTitle,
    );
    const [subInitiativeTitle, setSubInitiativeTitle] = useState<string>(
      sessionStore.subInitiativeTitle,
    );
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
            rallyingCry,
            forumType,
            objectivesKeyType:
              objectivesKeyType?.charAt(0).toUpperCase() + objectivesKeyType?.slice(1),
            coreFourAttributes: {
              core_1: core1Content,
              core_2: core2Content,
              core_3: core3Content,
              core_4: core4Content,
            },
            companyStaticDatasAttributes: {
              0: {
                id: sessionStore.companyStaticData.find(item => item.field == "annual_objective")
                  .id,
                value: annualInitiativeTitle,
              },
              1: {
                id: sessionStore.companyStaticData.find(
                  item => item.field == "quarterly_initiative",
                ).id,
                value: quarterlyGoalTitle,
              },
              2: {
                id: sessionStore.companyStaticData.find(item => item.field == "sub_initiative").id,
                value: subInitiativeTitle,
              },
            },
          },
          false,
        ),
      ];
      if (company.logoUrl) {
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
        setTimeout(history.go, 1000, 0);
      });
    };

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>
            {company.accessCompany ? t("profile.companyDetails") : t("profile.forumDetails")}
          </HeaderText>
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
                      <Button
                        small
                        variant={"redOutline"}
                        onClick={deleteLogo}
                        mr={2}
                        style={{ width: "120px" }}
                      >
                        {t("general.remove")}
                      </Button>

                      <FileInput labelText={t("general.upload")} onChange={inputFileUpload} />

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
                  {ceoORAdmin && (
                    <>
                      <Label htmlFor="objectives_key_type">{t("company.objectivesKeyType")}</Label>
                      <Select
                        onChange={e => {
                          e.preventDefault();
                          setObjectivesKeyType(e.currentTarget.value);
                        }}
                        value={objectivesKeyType}
                        style={{ minWidth: "200px", marginBottom: "16px" }}
                      >
                        {company?.objectivesKeyTypes &&
                          Object.entries(company?.objectivesKeyTypes).map(([name, id]) => (
                            <option key={`option-${id}`} value={name as string}>
                              {(name?.charAt(0).toUpperCase() + name.slice(1))
                                .match(/[A-Z][a-z]+|[0-9]+/g)
                                .join(" ")}
                            </option>
                          ))}
                      </Select>
                    </>
                  )}
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
                  <CompanyStaticDataSection>
                    <CompanyStaticDataArea>
                      <Label htmlFor="annualInitiative">Annual Objective</Label>
                      <Input
                        name="annualInitiative"
                        onChange={e => {
                          setAnnualInitiativeTitle(e.target.value);
                        }}
                        value={annualInitiativeTitle}
                      />
                    </CompanyStaticDataArea>
                    <CompanyStaticDataArea>
                      <Label htmlFor="quarterlyGoal">Quarterly Initiative</Label>
                      <Input
                        name="quarterlyGoal"
                        onChange={e => {
                          setQuarterlyGoalTitle(e.target.value);
                        }}
                        value={quarterlyGoalTitle}
                      />
                    </CompanyStaticDataArea>
                    <CompanyStaticDataArea>
                      <Label htmlFor="subInitiative">Supporting Initiative</Label>
                      <Input
                        name="subInitiative"
                        onChange={e => {
                          setSubInitiativeTitle(e.target.value);
                        }}
                        value={subInitiativeTitle}
                      />
                    </CompanyStaticDataArea>
                  </CompanyStaticDataSection>
                </PersonalInfoContainer>
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

const CompanyStaticDataSection = styled.div`
  margin-top: 16px;
`;

const CompanyStaticDataArea = styled.div`
  margin-top: 8px;
`;
