import * as React from "react";
import * as R from "ramda";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { CheckInWizardLayout } from "./checkin-wizard-layout";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams, useHistory } from "react-router-dom";
import { Loading } from "~/components/shared/loading";
import { Button } from "~/components/shared/button";
import { HeaderBar } from "../nav";

interface CheckInProps {}

export const CheckIn = observer(
  (props: CheckInProps): JSX.Element => {
    const { checkInTemplateStore } = useMst();

    const history = useHistory();

    const checkIn = checkInTemplateStore.currentCheckIn;

    useEffect(() => {
      checkInTemplateStore.fetchCheckInTemplates();
      checkInTemplateStore.getCheckIn("Weekly Check In");
    }, []);

    const renderLoading = () => (
      <Container>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </Container>
    );

    const StopMeetingButton = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {
            history.push(`/`);
            //TODO: send personal plan ended to back end.  For now do not end it.
          }}
          small
          disabled={false}
        >
          Complete
        </StopButton>
      );
    };

    const nextStep = stepIndex => {
      checkInTemplateStore.updateCurrentCheckIn(R.merge(checkIn, { currentStep: stepIndex }));
    };

    return (
      <>
        {R.isNil(checkIn) ? (
          renderLoading()
        ) : (
          <>
            <HeaderContainer>
              <HeaderBar />
            </HeaderContainer>
            <CheckInWizardContainer>
              <CheckInWizardLayout
                checkIn={checkIn}
                numberOfSteps={checkIn.checkInTemplatesSteps.length}
                stopMeetingButton={<StopMeetingButton />}
                onNextButtonClick={nextStep}
              />
            </CheckInWizardContainer>
          </>
        )}
      </>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

type IStopMeetingButton = {
  variant: string;
  onClick: () => void;
  small: boolean;
  disabled: boolean;
};

const StopButton = styled(Button)<IStopMeetingButton>`
  width: 100%;
  margin: 0;
`;

const HeaderContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const CheckInWizardContainer = styled.div`
  @media only screen and (max-width: 768px) {
    padding-top: 64px;
  }
`;
