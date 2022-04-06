import { observer } from "mobx-react";
import * as React from "react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared";
import { PulseSelector } from "./pulse-selector";
import styled from "styled-components";

interface IPulseSelectorProps {
  onClick?: any;
}

export const PulseSelectorWrapper = observer(
  ({ onClick }: IPulseSelectorProps): JSX.Element => {
    const {
      staticDataStore: { emotionAdjectives },
      sessionStore: { profile },
    } = useMst();

    if (!emotionAdjectives || !profile) {
      return (
        <PulseLoadingContainer>
          <Loading />
        </PulseLoadingContainer>
      );
    }

    return <PulseSelector onClick={onClick} />;
  },
);

const PulseLoadingContainer = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
