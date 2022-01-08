import * as React from "react";
import { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Calendar } from "react-date-range";
import { Dropzone } from "./dropzone";
import { DropzoneWithCropper } from "./dropzone-with-cropper";
import { Input, Label, Select, TextArea, TextDiv } from "~/components/shared";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import moment from "moment";
import "~/stylesheets/modules/rdw-editor-main.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import ReactQuill from "react-quill";

import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
  }),
);

export enum EFieldType {
  TextField = "TEXT_FIELD",
  TextArea = "TEXT_AREA",
  Image = "IMAGE",
  CroppedImage = "CROPPED_IMAGE",
  Select = "SELECT",
  DateSelect = "DATE_SELECT",
  HtmlEditor = "HTML_EDITOR",
}

interface IFormField {
  label: string;
  fieldType: EFieldType;
  formKeys?: Array<string>;
  options?: Array<{ label: string; value: string }>;
  callback?: (keys: Array<string>, val: any) => void;
  style?: any;
  value?: any;
  subText?: string;
  placeholder?: string;
  rows?: number;
}

interface IFormBuilderProps {
  formFields: Array<IFormField>;
  formData: any;
  formContainerStyle?: any;
  stepwise: boolean;
  marginBottom?: string;
}

export const FormBuilder = ({
  formContainerStyle,
  formData,
  formFields,
  stepwise,
  marginBottom,
}: IFormBuilderProps): JSX.Element => {
  const classes = useStyles();

  const formComponent = (formField: IFormField) => {
    const { fieldType, formKeys, options, callback, style, placeholder, rows } = formField;
    const [editorFormData, setEditorFormData] = useState(null);
    // console.log(formData, "formData");

    // console.log(formKeys, fieldType, "formKeys");
    // console.log(R.pathOr("", formKeys, formData));
    // useEffect(() => {
    //   if (fieldType == "HTML_EDITOR") {
    //     const convertedHtml = htmlToDraft(R.pathOr("", formKeys, formData) || {});
    //     const contentState = ContentState.createFromBlockArray(convertedHtml.contentBlocks);
    //     const editorState = EditorState.createWithContent(contentState);
    //     setEditorFormData(editorState || EditorState.createEmpty());
    //   }
    // }, [formData]);

    switch (fieldType) {
      case "TEXT_FIELD":
        return (
          <Input
            onChange={e => {
              e.preventDefault();
              callback(formKeys, e.currentTarget.value);
            }}
            style={{ ...style }}
            value={R.pathOr("", formKeys, formData)}
            placeholder={placeholder ? placeholder : ""}
            maxLength={140}
          />
        );
      case "TEXT_AREA":
        return (
          <TextArea
            onChange={e => {
              e.preventDefault();
              callback(formKeys, e.currentTarget.value);
            }}
            style={{ ...style }}
            textValue={R.pathOr("", formKeys, formData)}
            placeholder={placeholder ? placeholder : ""}
            rows={rows ? rows : 5}
          />
        );
      case "IMAGE":
        const dropZoneText =
          R.isNil(R.path(formKeys, formData)) || R.isEmpty(R.path(formKeys, formData))
            ? "Drag 'n' drop some files here, or click to select files"
            : "";
        return (
          <Dropzone
            classes={classes}
            dropzoneText={dropZoneText}
            onAdd={(f: any) => {
              callback(formKeys, f);
            }}
            onDelete={(f: any) => {
              callback(formKeys, []);
            }}
            fileObjects={R.path(formKeys, formData) ? R.path(formKeys, formData) : []}
            previewText="Selected files"
          />
        );
      case "CROPPED_IMAGE":
        return (
          <DropzoneWithCropper
            classes={classes}
            formData={formData}
            formKeys={formKeys}
            callback={callback}
          />
        );
      case "SELECT":
        return (
          <Select
            onChange={e => {
              e.preventDefault();
              callback(formKeys, e.currentTarget.value);
            }}
            style={{ ...style }}
            value={R.pathOr("", formKeys, formData)}
          >
            {!R.isNil(options) &&
              options.map(({ label, value }, index) => (
                <StyledOption key={`option-${index}`} value={value}>
                  {label}
                </StyledOption>
              ))}
          </Select>
        );
      case "DATE_SELECT":
        return (
          <Calendar
            date={
              R.pathOr(null, formKeys, formData)
                ? new Date(
                    moment.utc(R.pathOr(null, formKeys, formData)).format("YYYY-MM-DD HH:mm:ss"),
                  )
                : null
            }
            onChange={date => {
              callback(formKeys, date);
            }}
          />
        );
      case "HTML_EDITOR":
        return (
          <EditorContainer>
            {/* <Editor
              className="custom-trix-class trix-editor-onboarding"
              placeholder={placeholder ? placeholder : ""}
              editorState={editorFormData}
              onEditorStateChange={e => {
                callback(formKeys, draftToHtml(convertToRaw(e.getCurrentContent())));
                setEditorFormData(e);
              }}
              toolbar={{
                bold: { inDropdown: true },
                italic: { inDropdown: true },
                underline: { inDropdown: true },
                list: { inDropdown: true },
                link: { inDropdown: true },
              }}
            /> */}
            <ReactQuill
              className="custom-trix-class trix-editor-onboarding"
              theme="snow"
              placeholder={placeholder ? placeholder : ""}
              value={R.pathOr("", formKeys, formData)}
              onChange={(content, delta, source, editor) => {
                callback(formKeys, editor.getHTML());
              }}
            />
          </EditorContainer>
        );
    }
  };

  const isPreviousStepComplete = (index: number) => {
    if (index === 0 || stepwise === false) {
      return true;
    } else {
      const keyPathOfPreviousStep = R.path(["formKeys"], formFields[index - 1]);
      const previousStepData = R.path(keyPathOfPreviousStep, formData);
      if (R.isNil(previousStepData) || R.isEmpty(previousStepData)) {
        return false;
      } else {
        return true;
      }
    }
  };

  return (
    <Container>
      {formFields
        ? formFields.map((formField: IFormField, index: number) => {
            return isPreviousStepComplete(index) ? (
              <FormContainer
                key={index}
                marginBottom={marginBottom}
                style={
                  Array.isArray(formContainerStyle) ? formContainerStyle[index] : formContainerStyle
                }
              >
                <FormLabel>{formField.label}</FormLabel>
                {formComponent(formField)}
                {formField.subText && (
                  <TextDiv fontSize={"11px"} color={"grey100"}>
                    {formField.subText}
                  </TextDiv>
                )}
              </FormContainer>
            ) : null;
          })
        : null}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

type FormContainerProps = {
  marginBottom?: string;
};

type EditorProps = {
  marginBottom?: string;
  marginTop?: string;
};

const EditorContainer = styled.div<EditorProps>`
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "24px")};
  margin-top: ${props => (props.marginTop ? props.marginTop : "24px")};
`;

const FormContainer = styled.div<FormContainerProps>`
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "24px")};
`;

const StyledOption = styled.option``;

const FormLabel = styled(Label)`
  margin-bottom: 10px;
`;
