import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import Modal from "styled-react-modal";

import { Onboarding } from "~/components/domains/onboarding";

interface IOnboardingModalProps {}

export const OnboardingModal = observer(
  (props: IOnboardingModalProps): JSX.Element => {
    const {
      companyStore: { onboardingModalOpen },
    } = useMst();

    return (
      <StyledModal isOpen={onboardingModalOpen}>
        <Onboarding />
      </StyledModal>
    );
  },
);

const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`;
