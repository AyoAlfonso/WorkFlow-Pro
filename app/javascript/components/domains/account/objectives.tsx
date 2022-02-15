import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";
import { Text } from "~/components/shared/text";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { Observer, observer } from "mobx-react";
import Switch from "~/components/shared/switch";
import { Button } from "~/components/shared/button";
import FormGroup from "@material-ui/core/FormGroup";
import { ImageCropperModal } from "~/components/shared/image-cropper-modal";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import ReactQuill from "react-quill";
import {
  StretchContainer,
  HeaderContainer,
  HeaderText,
  SaveButtonContainer,
} from "./container-styles";

const formatType = {
  Milestones: "milestones",
  KeyResults: "keyResults",
};

export const Objectives = observer(
  (): JSX.Element => {
    const {
      companyStore,
      sessionStore,
      teamStore,
      sessionStore: { staticData },
    } = useMst();
    const { company } = companyStore;
    const { t } = useTranslation();

    const [rallyingCry, setRallyingCry] = useState(company.rallyingCry);
    const [core1Content, setCore1Content] = useState(company.coreFour.core1Content);
    const [core2Content, setCore2Content] = useState(company.coreFour.core2Content);
    const [core3Content, setCore3Content] = useState(company.coreFour.core3Content);
    const [core4Content, setCore4Content] = useState(company.coreFour.core4Content);
    const [showCoreFour, setShowCoreFour] = useState<boolean>(
      company?.preferences.foundationalFour,
    );

    const [logoImageForm, setLogoImageForm] = useState<FormData | null>(null);
    const [showCompanyGoals, setShowCompanyGoals] = useState<boolean>(
      company?.preferences.companyObjectives,
    );
    const [showPersonalGoals, setShowPersonalGoals] = useState<boolean>(
      company?.preferences.personalObjectives,
    );
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

    const ceoORAdmin = currentUser.role == RoleCEO || currentUser.role == RoleAdministrator;

    useEffect(() => {
      getLogo();
    }, []);

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

    const save = () => {
      const promises: Array<Promise<any>> = [
        companyStore.updateCompany(
          {
            rallyingCry,
            objectivesKeyType:
              objectivesKeyType?.charAt(0).toUpperCase() + objectivesKeyType?.slice(1),
            coreFourAttributes: {
              core_1: core1Content,
              core_2: core2Content,
              core_3: core3Content,
              core_4: core4Content,
            },
            preferences: {
              foundationalFour: showCoreFour,
              companyObjectives: showCompanyGoals,
              personalObjectives: showPersonalGoals,
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

      Promise.all(promises).then(() => {
        // setTimeout(history.go, 1000, 0);
      });
    };

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.objectives.header")}</HeaderText>
        </HeaderContainer>
        <Section>
          <SubHeader>{t("profile.objectives.general.header")}</SubHeader>
          <LayoutOptions>
            <Label htmlFor="objectives_page_layout">{t("company.objectivesPageLayout")}</Label>
            <LayoutOptionContainer>
              <LayoutOptionText>{t("company.layoutOptions.coreFour")}</LayoutOptionText>
              <FormGroup row>
                <Switch
                  checked={showCoreFour}
                  onChange={() => setShowCoreFour(!showCoreFour)}
                  name="switch-checked"
                  disabled={!ceoORAdmin}
                />
              </FormGroup>
            </LayoutOptionContainer>
            <LayoutOptionContainer>
              <LayoutOptionText>{`${companyStore.company.displayFormat} Objectives`}</LayoutOptionText>
              <FormGroup row>
                <Switch
                  checked={showCompanyGoals}
                  onChange={() => setShowCompanyGoals(!showCompanyGoals)}
                  name="switch-checked"
                  disabled={!ceoORAdmin}
                />
              </FormGroup>
            </LayoutOptionContainer>
            <LayoutOptionContainer>
              <LayoutOptionText>{t("company.layoutOptions.personalGoals")}</LayoutOptionText>
              <FormGroup row>
                <Switch
                  checked={showPersonalGoals}
                  onChange={() => setShowPersonalGoals(!showPersonalGoals)}
                  name="switch-checked"
                  disabled={!ceoORAdmin}
                />
              </FormGroup>
            </LayoutOptionContainer>
          </LayoutOptions>
          <Label htmlFor="rallying">{t("company.rallyingCry")}</Label>
          <Input
            name="rallyingCry"
            onChange={e => {
              setRallyingCry(e.target.value);
            }}
            value={rallyingCry}
          />
        </Section>
        <Section>
          <SubHeader>{t("profile.objectives.statusUpdate.header")}</SubHeader>
          <>
            <Label htmlFor="objectives_key_type">{t("profile.objectives.statusUpdate.type")}</Label>
            <Select
              onChange={e => {
                e.preventDefault();
                setObjectivesKeyType(e.currentTarget.value);
              }}
              value={objectivesKeyType}
              style={{ minWidth: "200px", marginBottom: "16px" }}
              disabled={!ceoORAdmin}
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
        </Section>
        <Section>
          <SubHeader>{t("profile.objectives.coreFour.header")}</SubHeader>
          <WYSIWYGLabel htmlFor="core1Content">{t("core.core1")}</WYSIWYGLabel>
          <ReactQuill
            className="custom-trix-class"
            theme="snow"
            placeholder="Please enter Why Do We Exist?"
            value={core1Content}
            onChange={setCore1Content}
          />

          <WYSIWYGLabel htmlFor="core_2">{t("core.core2")}</WYSIWYGLabel>
          <ReactQuill
            className="custom-trix-class"
            theme="snow"
            placeholder="Please enter How Do We Behave?"
            value={core2Content}
            onChange={setCore2Content}
          />

          <WYSIWYGLabel htmlFor="core_3">{t("core.core3")}</WYSIWYGLabel>
          <ReactQuill
            className="custom-trix-class"
            theme="snow"
            placeholder="Please enter How Do We Behave?"
            value={core3Content}
            onChange={setCore3Content}
          />

          <WYSIWYGLabel htmlFor="core_4">{t("core.core4")}</WYSIWYGLabel>
          <ReactQuill
            className="custom-trix-class"
            theme="snow"
            placeholder="Please enter How Do We Succeed?"
            value={core4Content}
            onChange={setCore4Content}
          />
        </Section>
        <Section>
          <SubHeader>{t("profile.objectives.terminology.header")}</SubHeader>
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
        </Section>
        <SaveButtonContainer>
          <Button
            small
            variant={"primary"}
            onClick={save}
            style={{
              marginTop: "auto",
              marginBottom: "32px",
              marginRight: "24px",
            }}
          >
            {t("general.save")}
          </Button>
        </SaveButtonContainer>
      </StretchContainer>
    );
  },
);

const Section = styled.div`
  margin-bottom: 1.5em;
  width: 70%;
`;

const SubHeader = styled(Text)`
  color: ${props => props.theme.colors.grey100};
  font-weight: bold;
  font-size: 1em;
  margin: 0;
  margin-bottom: 1.3em;
`;

const LayoutOptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const LayoutOptionText = styled(Text)`
  margin: 0;
`;

const LayoutOptions = styled.div`
  margin-bottom: 20px;
`;

const WYSIWYGLabel = styled(Label)`
  margin: 15px 0px;
`;

const CompanyStaticDataSection = styled.div`
  margin-top: 16px;
`;

const CompanyStaticDataArea = styled.div`
  margin-top: 8px;
`;
