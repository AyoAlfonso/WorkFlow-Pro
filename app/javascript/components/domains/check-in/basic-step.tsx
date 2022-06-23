import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";

interface BasicStepProps {
  checkinName: string;
  setCheckinName: React.Dispatch<React.SetStateAction<string>>;
  checkinType: string;
  setCheckinType: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const BasicStep = ({
  checkinName,
  setCheckinName,
  checkinType,
  setCheckinType,
  description,
  setDescription,
}: BasicStepProps): JSX.Element => {
  const checkinTypes = ["Team", "Personal", "Company"];
  return (
    <Container>
      <FormGroup>
        <Label>Name</Label>
        <Input
          value={checkinName}
          onChange={e => setCheckinName(e.target.value)}
          placeholder="Name"
        />
      </FormGroup>
      <FormGroup>
        <Label>Type</Label>
        <Select onChange={e => setCheckinType(e.target.value)} value={checkinType}>
          {checkinTypes.map((type, index) => (
            <option key={`option-${index}`} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <TextField
          placeholder="Add a description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </FormGroup>
    </Container>
  );
};

const Container = styled.div``;

const FormGroup = styled.div`
  margin-bottom: 1em;
`;

const TextField = styled.textarea`
  border: 1px solid ${props => props.theme.colors.grey20};
  height: 150px;
  width: -webkit-fill-available;
  width: -moz-available;
  resize: none;
  padding: 8px;
  border-radius: 4px;

  &::placeholder {
    color: ${props => props.theme.colors.grey100};
    font-size: 14px;
  }
`;
