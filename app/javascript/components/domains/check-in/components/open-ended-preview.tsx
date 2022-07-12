import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";

interface OpenEndedPreviewProps {
  question: string;
  disabled?: boolean;
}

export const OpenEndedPreview = observer(
  ({ question, disabled }: OpenEndedPreviewProps): JSX.Element => {
    const { checkInTemplateStore } = useMst();

    const {
      currentCheckInArtifact,
      updateCheckinArtifact,
      updateCheckInArtifactResponse,
    } = checkInTemplateStore;

    const checkInArtifactLogs = currentCheckInArtifact?.checkInArtifactLogs;

    const savedResponse =
      checkInArtifactLogs &&
      toJS(checkInArtifactLogs)[0]?.responses?.find(
        response => response.questionType === "open_ended" && response.prompt === question,
      );

    const [value, setValue] = React.useState<string>(savedResponse?.response || "");

    const submitCheckinResponse = () => {
      const index =
        toJS(checkInArtifactLogs).length &&
        toJS(checkInArtifactLogs)[0]?.responses?.findIndex(
          response => response.questionType === "open_ended" && response.prompt === question,
        );
      
      if (!index) {
        const item = {
          responses: [{ questionType: "open_ended", prompt: question, response: value }],
        };
        updateCheckinArtifact(currentCheckInArtifact.id, item);
      } else if (index === -1) {
        const item = {
          responses: [
            ...checkInArtifactLogs[0].responses,
            { questionType: "open_ended", prompt: question, response: value },
          ],
        };
        updateCheckinArtifact(currentCheckInArtifact.id, item);
      } else {
        const item = { questionType: "open_ended", prompt: question, response: value };
        updateCheckInArtifactResponse(index, item);
      }
    };

    return (
      <Container disabled={disabled}>
        <QuestionText>{question}</QuestionText>
        <TextField
          placeholder="Add response"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          onBlur={submitCheckinResponse}
        />
      </Container>
    );
  },
);

type ContainerProps = {
  disabled: boolean;
};

const Container = styled.div<ContainerProps>`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  height: 200px;
  position: relative;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const QuestionText = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  text-align: left;
  margin-bottom: 0.5em;
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
