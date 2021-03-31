import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeaderText } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { toJS } from "mobx";

import { TextStepContainer } from "~/components/domains/meetings/shared/text-step";

export const ConversationStarter = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { sessionStore } = useMst();
    const convoStarters = toJS(sessionStore.staticData.conversationStarters);
    const randomConvoStarter =
      convoStarters.length > 0
        ? convoStarters[(convoStarters.length * Math.random()) | 0]
        : { body: "What's the most interesting thing you've done lately?" };

    return (
      <TextStepContainer>
        <div>{randomConvoStarter.body}</div>
      </TextStepContainer>
    );
  },
);
