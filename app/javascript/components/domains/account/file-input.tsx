import React, { useRef } from "react";
import styled from "styled-components";

export interface IFileInputProps {
  labelText: string;
  onChange: (files: FileList) => void;
}

const StyledFileInputLabel = styled.label`
  background-color: ${props => props.theme.colors.primary100};
  border-color: ${props => props.theme.colors.primary100};
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  color: white;
  flex: 1;
  padding-top: 5px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`;

const StyledFileInput = styled.input`
  display: none;
`;

export const FileInput = ({ labelText, onChange }: IFileInputProps): JSX.Element => {
  const fileInput = useRef(null);
  return (
    <StyledFileInputLabel>
      {labelText}
      <StyledFileInput
        onChange={(event) => {
          onChange(fileInput.current.files)
          event.target.value = null
        }}
        ref={fileInput}
        type="file"
      />
    </StyledFileInputLabel>
  );
};
