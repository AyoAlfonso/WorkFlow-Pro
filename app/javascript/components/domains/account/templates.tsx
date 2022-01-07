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
import ReactQuill from "react-quill";
import { useHistory } from "react-router";
import { toJS } from "mobx";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "~/stylesheets/modules/rdw-editor-main.css";

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

    const [kPIBodyBody, setKPIBodyBody] = useState<any>(null);
    const [objectiveBodyBody, setObjectiveBodyBody] = useState<any>(null);
    const [initiativeBodyBody, setinitiativeBodyBody] = useState<any>(null);

    const [initiativesTemplateBody, setInitiativesTemplateBody] = useState({} as any);
    const [objectivesTemplateBody, setObjectivesTemplateBody] = useState({} as any);
    const [kpiTemplateBody, setKPITemplateBody] = useState({} as any);

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
          const convertedHtmlKPITemplate = htmlToDraft(t.body.body);
          const convertedHtmlKPITemplateContentState = ContentState.createFromBlockArray(
            convertedHtmlKPITemplate.contentBlocks,
          );
          const editorStateKPITemplate = EditorState.createWithContent(
            convertedHtmlKPITemplateContentState,
          );
          setKPIBodyBody(editorStateKPITemplate || EditorState.createEmpty());
          setKPITemplate(t);
        } else if (t.templateType == "objectives") {
          const convertedHtmlObjectivesTemplate = htmlToDraft(t.body.body);
          const convertedHtmlObjectiveTemplateContentState = ContentState.createFromBlockArray(
            convertedHtmlObjectivesTemplate.contentBlocks,
          );
          const editorStateObjectiveTemplate = EditorState.createWithContent(
            convertedHtmlObjectiveTemplateContentState,
          );
          setObjectiveBodyBody(editorStateObjectiveTemplate || EditorState.createEmpty());
          setObjectivesTemplate(t);
        } else if (t.templateType == "initiatives") {
          const convertedHtmlInitiativeTemplate = htmlToDraft(t.body.body);
          const convertedHtmlInitiativeTemplateContentState = ContentState.createFromBlockArray(
            convertedHtmlInitiativeTemplate.contentBlocks,
          );
          const editorStateInitiativeTemplate = EditorState.createWithContent(
            convertedHtmlInitiativeTemplateContentState,
          );
          setinitiativeBodyBody(editorStateInitiativeTemplate || EditorState.createEmpty());
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

                  <Editor
                    className="custom-trix-class"
                    placeholder="Enter your Objectives Templates"
                    editorState={objectiveBodyBody}
                    onEditorStateChange={e => {
                      objectivesTemplate.body.body = draftToHtml(
                        convertToRaw(e.getCurrentContent()),
                      );
                      setObjectivesTemplate(objectivesTemplate);
                      setObjectiveBodyBody(e);
                      setObjectivesTemplateBody({
                        id: objectivesTemplate.id,
                        title: objectivesTemplate.title,
                        body: objectivesTemplate.body.body,
                      });
                    }}
                  />
                  <Label htmlFor="initiativesTemplate"> Initiatives Templates </Label>

                  <Editor
                    className="custom-trix-class"
                    placeholder="Enter your Initiatives Templates"
                    editorState={initiativeBodyBody}
                    onEditorStateChange={e => {
                      initiativesTemplate.body.body = draftToHtml(
                        convertToRaw(e.getCurrentContent()),
                      );
                      setInitiativesTemplate(initiativesTemplate);
                      setinitiativeBodyBody(e);
                      setInitiativesTemplateBody({
                        id: initiativesTemplate.id,
                        title: initiativesTemplate.title,
                        body: initiativesTemplate.body.body,
                      });
                    }}
                  />

                  <Label htmlFor="kpiTemplate"> KPI Templates </Label>
                 
                  <Editor
                    className="custom-trix-class"
                    placeholder="Enter your KPI Templates"
                    editorState={kPIBodyBody}
                    onEditorStateChange={e => {
                      kpiTemplate.body.body = draftToHtml(convertToRaw(e.getCurrentContent()));
                      setKPITemplate(kpiTemplate);
                      setKPIBodyBody(e);
                      setKPITemplateBody({
                        id: kpiTemplate.id,
                        title: kpiTemplate.title,
                        body: kpiTemplate.body.body,
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
