import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";

import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { baseTheme } from "~/themes/base";

import { DropzoneAreaBase as MuiDropzoneAreaBase } from "material-ui-dropzone";
import { withStyles } from "@material-ui/core/styles";

import { Input, Label, Select, TextArea } from "~/components/shared";

export enum EFieldType {
  TextField = "TEXT_FIELD",
  TextArea = "TEXT_AREA",
  Image = "IMAGE",
  Select = "SELECT",
  DateSelect = "DATE_SELECT",
}

interface IFormField {
  label: string;
  fieldType: EFieldType;
  formKey?: string;
  options?: Array<{ label: string; value: string }>;
  callback?: (key: string, val: any) => void;
  style?: any;
  value?: any;
}

interface IOnboardingStepProps {
  formFields?: Array<IFormField>;
  formData?: any;
}

export const OnboardingStep = ({ formData, formFields }: IOnboardingStepProps): JSX.Element => {
  const formComponent = (formField: IFormField) => {
    const { fieldType, formKey, options, callback, style } = formField;
    switch (fieldType) {
      case "TEXT_FIELD":
        return (
          <Input
            onChange={e => {
              e.preventDefault();
              callback(formKey, e.currentTarget.value);
            }}
            style={{ ...style }}
            value={formData[formKey] || ""}
          />
        );
      case "TEXT_AREA":
        return (
          <TextArea
            onChange={e => {
              e.preventDefault();
              callback(formKey, e.currentTarget.value);
            }}
            style={{ ...style }}
            textValue={formData[formKey] || ""}
          />
        );
      case "IMAGE":
        const dropZoneText =
          R.isNil(formData[formKey]) || R.isEmpty(formData[formKey])
            ? "Drag 'n' drop some files here, or click to select files"
            : "";
        return (
          <Dropzone
            Icon={null}
            acceptedFiles={["image/*"]}
            dropzoneText={dropZoneText}
            onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
            onAdd={(f: any) => {
              callback(formKey, f);
            }}
            onDelete={(f: any) => {
              callback(formKey, []);
            }}
            showPreviewsInDropzone={true}
            filesLimit={1}
            maxFileSize={2000000}
            fileObjects={formData[formKey]}
          />
        );
      case "SELECT":
        return (
          <Select
            onChange={e => {
              e.preventDefault();
              callback(formKey, e.currentTarget.value);
            }}
            style={{ ...style }}
            value={formData[formKey] || ""}
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
            date={formData[formKey] || new Date()}
            onChange={date => {
              callback(formKey, date);
            }}
          />
        );
    }
  };

  return (
    <Container>
      {formFields
        ? formFields.map((formField: IFormField, index: number) => {
            return (
              <FormContainer key={index}>
                <Label>{formField.label}</Label>
                {formComponent(formField)}
              </FormContainer>
            );
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
