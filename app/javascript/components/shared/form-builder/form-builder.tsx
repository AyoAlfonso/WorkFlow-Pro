import React, { useState } from "react";
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

import * as moment from "moment";

import { createStyles, makeStyles } from "@material-ui/core/styles";

import { LogoModal } from "~/components/domains/account/LogoModal";

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
}

export const FormBuilder = ({
  formContainerStyle,
  formData,
  formFields,
  stepwise,
}: IFormBuilderProps): JSX.Element => {
  const classes = useStyles();
  const [imageblub, setImageblub] = useState<any | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");

  const formComponent = (formField: IFormField) => {
    const { fieldType, formKeys, options, callback, style, placeholder, rows } = formField;
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
            Icon={null}
            acceptedFiles={["image/*"]}
            dropzoneText={dropZoneText}
            useChipsForPreview
            onAdd={(f: any) => {
              callback(formKeys, f);
            }}
            onDelete={(f: any) => {
              callback(formKeys, []);
            }}
            showPreviews={true}
            showPreviewsInDropzone={false}
            filesLimit={1}
            maxFileSize={2000000}
            fileObjects={R.path(formKeys, formData) ? R.path(formKeys, formData) : []}
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            previewText="Selected files"
          />
        );
      case "CROPPED_IMAGE":
        const submitImage = async (blob) => {
          const imageDataUrl = await readFile(blob);
          const f_obj = { data: imageDataUrl, file: { name: filename, path: filename } }
          callback(formKeys, [f_obj]);
        }

        const pickLogoImageblub = async (file) => {
          setImageblub(file)
          setImageModalOpen(!imageModalOpen)
        };
        const readFile = (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
          })
        }
        const inputFileUpload = async (files: any) => {
          const imageDataUrl = await readFile(files[0].file)
          setFilename(files[0].file.name)
          pickLogoImageblub(imageDataUrl)
        }
        const croppedDropZoneText =
          R.isNil(R.path(formKeys, formData)) || R.isEmpty(R.path(formKeys, formData))
            ? "Drag 'n' drop some files here, or click to select files"
            : "";
        return (
          <>
            <Dropzone
              Icon={null}
              acceptedFiles={["image/*"]}
              dropzoneText={croppedDropZoneText}
              useChipsForPreview
              onAdd={(f: any) => {
                inputFileUpload(f);
              }}
              onDelete={(f: any) => {
                callback(formKeys, []);
              }}
              showPreviews={true}
              showPreviewsInDropzone={false}
              filesLimit={1}
              maxFileSize={2000000}
              fileObjects={R.path(formKeys, formData) ? R.path(formKeys, formData) : []}
              previewGridProps={{ container: { spacing: 1, direction: "row" } }}
              previewChipProps={{ classes: { root: classes.previewChip } }}
              previewText="Selected files"
            />
            {imageModalOpen && (
              <LogoModal
                image={imageblub}
                uploadCroppedImage={submitImage}
                modalOpen={imageModalOpen}
                setModalOpen={setImageModalOpen}
              />
            )}
          </>
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
          <TrixEditor
            className="custom-trix-class"
            autoFocus={true}
            placeholder={placeholder ? placeholder : ""}
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
