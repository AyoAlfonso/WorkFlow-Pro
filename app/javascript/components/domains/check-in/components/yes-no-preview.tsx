import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared";
import { toJS } from "mobx";

interface YesNoPreviewProps {
  question: string;
  disabled?: boolean;
}

export const YesNoPreview = observer(
  ({ question, disabled }: YesNoPreviewProps): JSX.Element => {
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
        response => response.questionType === "yes_no" && response.prompt === question,
      );

    const response = savedResponse?.response === true ? 2 : savedResponse?.response === false ? 1 : null;

    const [selected, setSelected] = React.useState<number>(response || 0);

    const submitCheckinResponse = value => {
      const index =
        toJS(checkInArtifactLogs).length &&
        toJS(checkInArtifactLogs)[0]?.responses?.findIndex(
          response => response.questionType === "yes_no" && response.prompt === question,
        );
      if (!index) {
        const item = {
          responses: [{ questionType: "yes_no", prompt: question, response: value }],
        };
        updateCheckinArtifact(currentCheckInArtifact.id, item);
      } else if (index === -1) {
        const item = {
          responses: [
            ...checkInArtifactLogs[0].responses,
            { questionType: "yes_no", prompt: question, response: value },
          ],
        };
        updateCheckinArtifact(currentCheckInArtifact.id, item);
      } else {
        const item = { questionType: "yes_no", prompt: question, response: value };
        updateCheckInArtifactResponse(index, item);
      }
    };

    return (
      <Container disabled={disabled}>
        <QuestionText>{question}</QuestionText>
        <ButtonsContainer>
          <YesButton
            variant={"primary"}
            onClick={() => {
              setSelected(2);
              submitCheckinResponse(true);
            }}
            selected={selected === 2}
            small
          >
            Yes
          </YesButton>
          <NoButon
            variant={"primary"}
            onClick={() => {
              setSelected(1);
              submitCheckinResponse(false);
            }}
            selected={selected === 1}
            small
          >
            No
          </NoButon>
        </ButtonsContainer>
      </Container>
    );
  },
);

type ContainerProps = {
  disabled?: boolean;
};

const Container = styled.div<ContainerProps>`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  height: 140px;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const QuestionText = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  text-align: left;
  margin-bottom: 2.25em;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

type ButtonProps = {
  selected: boolean;
}

const YesButton = styled(Button)<ButtonProps>`
  margin-right: 1em;
  font-size: 12px;
  width: 64px;
  height: 30px;
  background-color: ${props =>
    props.selected ? props.theme.colors.superGreen : props.theme.colors.primary100};
  border-color: ${props =>
    props.selected ? props.theme.colors.superGreen : props.theme.colors.primary100};
`;

const NoButon = styled(Button)<ButtonProps>`
  font-size: 12px;
  width: 64px;
  height: 30px;
  background-color: ${props =>
    props.selected ? props.theme.colors.warningRed : props.theme.colors.mipBlue};
  border-color: ${props =>
    props.selected ? props.theme.colors.warningRed : props.theme.colors.mipBlue};
`;
