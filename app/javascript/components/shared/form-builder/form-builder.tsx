import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";

import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { baseTheme } from "~/themes/base";

import { DropzoneAreaBase as MuiDropzoneAreaBase } from "material-ui-dropzone";
import { withStyles } from "@material-ui/core/styles";
import { TrixEditor } from "react-trix";

import { Input, Label, Select, TextArea, TextDiv } from "~/components/shared";

export enum EFieldType {
  TextField = "TEXT_FIELD",
  TextArea = "TEXT_AREA",
  Image = "IMAGE",
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
}

interface IFormBuilderProps {
  formFields: Array<IFormField>;
  formData: any;
  formContainerStyle?: any;
  stepwise: boolean;
}

export const FormBuilder = ({
  formContainerStyle,
  formData,
  formFields,
  stepwise,
}: IFormBuilderProps): JSX.Element => {
  const formComponent = (formField: IFormField) => {
    const { fieldType, formKeys, options, callback, style } = formField;
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
          />
        );
      case "IMAGE":
        const dropZoneText =
          R.isNil(R.path(formKeys, formData)) || R.isEmpty(R.path(formKeys, formData))
            ? "Drag 'n' drop some files here, or click to select files"
            : "";
        return (
          <Dropzone
            Icon={null}
            acceptedFiles={["image/*"]}
            dropzoneText={dropZoneText}
            onAdd={(f: any) => {
              callback(formKeys, f[0]);
            }}
            onDelete={(f: any) => {
              callback(formKeys, null);
            }}
            showPreviewsInDropzone={true}
            filesLimit={1}
            maxFileSize={2000000}
            fileObjects={R.path(formKeys, formData) ? [R.path(formKeys, formData)] : []}
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
            date={R.pathOr(null, formKeys, formData)}
            onChange={date => {
              callback(formKeys, date);
            }}
          />
        );
      case "HTML_EDITOR":
        return (
          <TrixEditor
            className="custom-trix-class"
            autoFocus={true}
            placeholder="Type here..."
            value={R.pathOr("", formKeys, formData)}
            mergeTags={[]}
            onChange={(html, text) => {
              callback(formKeys, html);
            }}
            onEditorReady={editor => {
              editor.element.addEventListener("trix-file-accept", event => {
                event.preventDefault();
              });
            }}
          />
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
              <FormContainer key={index} style={formContainerStyle}>
                <Label>{formField.label}</Label>
                {formComponent(formField)}
                {formField.subText && (
                  <TextDiv fontSize={"9px"} color={"grey100"}>
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

const FormContainer = styled.div`
  margin-bottom: 24px;
`;

const StyledOption = styled.option``;

const Dropzone = withStyles({
  active: {
    backgroundColor: baseTheme.colors.primary20,
  },
  icon: {
    display: "none",
  },
  root: {
    height: "120px",
    width: "100%",
    borderRadius: 10,
    borderWidth: "2px",
  },
  textContainer: {
    marginTop: "15%",
  },
  text: {
    fontSize: "14px",
    color: baseTheme.colors.borderGrey,
  },
})(MuiDropzoneAreaBase);
