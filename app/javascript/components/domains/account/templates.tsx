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
    const  descriptionTemplatesFormatted = toJS(descriptionTemplates)
    const [objectivesTemplate, setObjectivesTemplate] = useState({body: descriptionTemplatesFormatted[0]?.body || ""});
    const [initiativesTemplate, setInitiativesTemplate] = useState({body: descriptionTemplatesFormatted[1]?.body || ""});
    const [kpiTemplate, setKPITemplate] = useState({body: descriptionTemplatesFormatted[2]?.body || ""});

    const { t } = useTranslation();

    useEffect(() => {
      descriptionTemplateStore.fetchDescriptiveTemplates();
      descriptionTemplatesFormatted.map(t => {
        if (t.templateType == "kpi") {
          setKPITemplate(t);
        } else if (t.templateType == "objectives") {
          setObjectivesTemplate(t);
        } else if (t.templateType == "initiatives") {
          setInitiativesTemplate(t);
        }
      });
    }, [descriptionTemplates]);

    const save = () => {
      descriptionTemplateStore.updateDescriptiveTemplates(
        {descriptionTemplate: [
          objectivesTemplate,
         initiativesTemplate,
         kpiTemplate,
        ]}
      );
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
                    value={objectivesTemplate.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setObjectivesTemplate(Object.assign(objectivesTemplate, {body: html}));
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
                    value={initiativesTemplate.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setInitiativesTemplate(
                       Object.assign(initiativesTemplate, {body: html}))
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
                    value={kpiTemplate.body}
                    mergeTags={[]}
                    onChange={(html, text) => {
                      setKPITemplate(Object.assign(kpiTemplate, {body: html}));
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
