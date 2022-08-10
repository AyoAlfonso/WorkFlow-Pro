import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useHistory } from "react-router-dom";
import { Label, Input, Select } from "~/components/shared/input";
import { createTemplate } from "~/utils/check-in-functions";

interface BasicStepProps {
  checkinName: string;
  setCheckinName: React.Dispatch<React.SetStateAction<string>>;
  checkinType: string;
  setCheckinType: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export const BasicStep = observer(
  ({
    checkinName,
    setCheckinName,
    checkinType,
    setCheckinType,
    description,
    setDescription,
    disabled,
  }: BasicStepProps): JSX.Element => {
    const { checkInTemplateStore } = useMst();

    const { currentCheckIn } = checkInTemplateStore;

    const checkinTypes = ["Team", "Personal", "Company"];

    const history = useHistory();

    const handleDisabledClick = () => {
      if (!disabled) return;
      if (
        confirm(
          "You can't make changes to a global template. Do you want to make a copy and customize the template?",
        )
      ) {
        createTemplate(currentCheckIn, checkInTemplateStore, history);
      }
    };

    return (
      <Container>
        <FormGroup onClick={handleDisabledClick}>
          <Label>Name</Label>
          <Input
            value={checkinName}
            onChange={e => setCheckinName(e.target.value)}
            placeholder="Name"
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup onClick={handleDisabledClick}>
          <Label>Type</Label>
          <Select
            onChange={e => setCheckinType(e.target.value)}
            value={checkinType}
            disabled={disabled}
          >
            {checkinTypes.map((type, index) => (
              <option key={`option-${index}`} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup onClick={handleDisabledClick}>
          <Label>Description</Label>
          <TextField
            placeholder="Add a description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
      </Container>
    );
  },
);

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
