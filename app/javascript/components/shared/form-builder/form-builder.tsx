import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";

import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";

import { Dropzone } from "./dropzone";
import { DropzoneWithCropper } from "./dropzone-with-cropper";

import { Button, Icon, Input, Label, Select, TextArea, TextDiv } from "~/components/shared";

import moment from "moment";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { KeyElementModal } from "~/components/domains/goals/shared/key-element-modal";

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
  AddKeyResult = "ADD_KEY_RESULT",
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

  const [showKeyElementForm, setShowKeyElementForm] = useState<boolean>(false);
  const [showActionType, setActionType] = useState<string>("Add");
  const [selectedElement, setSelectedElement] = useState<number>(null);
  const [showAddButton, setShowAddButton] = useState<boolean>(true);

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
      case "ADD_KEY_RESULT":
        return (
          <>
            {showAddButton && (
              <StyledButton
                small
                variant={"grey"}
                onClick={() => {
                  setShowKeyElementForm(true);
                }}
              >
                <CircularIcon icon={"Plus"} size={"12px"} />
                <AddKeyElementText>Add a Key Result</AddKeyElementText>
              </StyledButton>
            )}
            {showKeyElementForm && (
              <KeyElementModal
                modalOpen={showKeyElementForm}
                setModalOpen={setShowKeyElementForm}
                action={showActionType}
                setActionType={setActionType}
                store={null}
                type={"onboarding"}
                keysForOnboarding={formKeys}
                callbackForOnboarding={callback}
                element={selectedElement}
                setSelectedElement={setSelectedElement}
                showAddButton={setShowAddButton}
              />
            )}
          </>
        );
      case "HTML_EDITOR":
        return (
          <ReactQuill
            className="custom-trix-class trix-editor-onboarding"
            theme="snow"
            modules={{
              toolbar: DndItems,
            }}
            placeholder={placeholder ? placeholder : ""}
            value={R.pathOr("", formKeys, formData)}
            onChange={(content, delta, source, editor) => {
              callback(formKeys, editor.getHTML());
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

const FormContainer = styled.div<FormContainerProps>`
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : "24px")};
`;

const StyledOption = styled.option``;

const FormLabel = styled(Label)`
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;

const AddKeyElementText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
`;
