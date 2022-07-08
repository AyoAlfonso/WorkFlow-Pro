import React from "react";
import styled from "styled-components";
import { Label, Select } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Checkbox } from "@material-ui/core";
import { baseTheme } from "~/themes";

interface ResponsesProps {
  setResponseViewers: React.Dispatch<React.SetStateAction<string>>;
  responseViewers: string;
  anonymousResponse: boolean;
  setAnonymousResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Responses = observer(
  ({
    setResponseViewers,
    responseViewers,
    anonymousResponse,
    setAnonymousResponse,
  }: ResponsesProps): JSX.Element => {
    const { companyStore } = useMst();
    const isForum = companyStore.company?.displayFormat == "Forum";
    const responseOptions = [
      "All Participants",
      "Just Me",
      `Entire ${isForum ? "Forum" : "Company"}`,
      "Custom",
    ];
    return (
      <Container>
        <FormGroup>
          <Label>Who should see responses?</Label>
          <Select onChange={e => setResponseViewers(e.target.value)} value={responseViewers}>
            {responseOptions.map((type, index) => (
              <option key={`option-${index}`} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormGroup>
        {/* <FormGroup>
          <CheckboxContainer>
            <Checkbox
              checked={anonymousResponse}
              onChange={e => setAnonymousResponse(e.target.checked)}
              style={{ color: baseTheme.colors.primary100 }}
            />
            <ResponseText>Make the Check-in anonymous</ResponseText>
          </CheckboxContainer>
        </FormGroup> */}
      </Container>
    );
  },
);

const Container = styled.div``;

const FormGroup = styled.div`
  margin-bottom: 0.5em;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ResponseText = styled.span`
  font-size: 0.8em;
  color: ${baseTheme.colors.black};
  font-weight: bold;
`;
