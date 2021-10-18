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

export const Templates = observer(
  (): JSX.Element => {
    const { descriptionTemplateStore } = useMst();
    const { descriptionTemplates } = descriptionTemplateStore;
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);
    const [initiativesTemplate, setInitiativesTemplate] = useState(
      descriptionTemplatesFormatted?.find(t => t.templateType == "initiatives"),
    );
    const [objectivesTemplate, setObjectivesTemplate] = useState(
      descriptionTemplatesFormatted?.find(t => t.templateType == "objectives"),
    );
    const [kpiTemplate, setKPITemplate] = useState(
      descriptionTemplatesFormatted?.find(t => t.templateType == "kpi"),
    );
    const [initiativesTemplateBody, setInitiativesTemplateBody] = useState({});
    const [objectivesTemplateBody, setObjectivesTemplateBody] = useState({});
    const [kpiTemplateBody, setKPITemplateBody] = useState({});

    const { t } = useTranslation();

    function createFormData(formData, key, data) {
      if (data === Object(data) || Array.isArray(data)) {
        for (const i in data) {
          createFormData(formData, key + "[" + i + "]", data[i]);
        }
      } else {
        formData.append(key, data);
      }
    }

    useEffect(() => {
      descriptionTemplateStore.fetchDescriptiveTemplates();
      descriptionTemplatesFormatted?.map(t => {
        if (t.templateType == "kpi") {
          setKPITemplate(t);
        } else if (t.templateType == "objectives") {
          setObjectivesTemplate(t);
        } else if (t.templateType == "initiatives") {
          setInitiativesTemplate(t);
        }
      });
    }, [descriptionTemplateStore, descriptionTemplates]);

    const save = () => {
      const propKey = "body";
      const removeProperty = (propKey, { [propKey]: propValue, ...rest }) => rest;
      const flattenedobjectivesTemplate = removeProperty(propKey, objectivesTemplate);
      const flattenedInitiativesTemplate = removeProperty(propKey, initiativesTemplate);
      const flattenedKPITemplate = removeProperty(propKey, kpiTemplate);

      descriptionTemplateStore.updateDescriptiveTemplates({
        descriptionTemplate: [
          flattenedobjectivesTemplate,
          flattenedInitiativesTemplate,
          flattenedKPITemplate,
        ],
      });
      const form = new FormData();
      createFormData(form, "description_templates_attributes", [
        initiativesTemplateBody,
        objectivesTemplateBody,
        kpiTemplateBody,
      ]);
      descriptionTemplateStore.updateDescriptiveTemplatesBody(form);
    };

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.descriptionTemplate")}</HeaderText>
        </HeaderContainer>

        <Can
          action={"update-company-details"}
          data={null}
          no={<BodyContainer></BodyContainer>}
          yes={
            <>
              <BodyContainer>
                <PersonalInfoContainer>
                  <Label htmlFor="objectivesTemplate"> Objectives Templates </Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Enter your Objectives Templates"
                    value={objectivesTemplate.body.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setObjectivesTemplateBody({
                        id: objectivesTemplate.id,
                        title: objectivesTemplate.title,
                        body: html,
                      });
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                  <Label htmlFor="initiativesTemplate"> Initiatives Templates </Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Enter your Initiatives Templates"
                    value={initiativesTemplate.body.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setInitiativesTemplateBody({
                        id: initiativesTemplate.id,
                        title: initiativesTemplate.title,
                        body: html,
                      });
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
                  <Label htmlFor="kpiTemplate"> KPI Templates </Label>
                  <TrixEditor
                    className="custom-trix-class"
                    autoFocus={true}
                    placeholder="Enter your KPI Templates"
                    value={kpiTemplate.body.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setKPITemplateBody({
                        id: kpiTemplate.id,
                        title: kpiTemplate.title,
                        body: html,
                      });
                    }}
                    onEditorReady={editor => {
                      editor.element.addEventListener("trix-file-accept", event => {
                        event.preventDefault();
                      });
                    }}
                  />
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
