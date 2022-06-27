import React, { useEffect } from "react";
import * as R from "ramda";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { useParams, useHistory } from "react-router-dom";
import { CheckInWizardLayout } from "./checkin-wizard-layout";
import styled from "styled-components";
import { Loading } from "~/components/shared/loading";
import { Button } from "~/components/shared/button";
import { HeaderBar } from "../nav";
import { toJS } from "mobx";

const CheckInWizard = observer(
  (): JSX.Element => {
    const { checkInTemplateStore } = useMst();

    const { currentCheckIn } = checkInTemplateStore;

    const { id } = useParams();

    const checkIn = currentCheckIn;

    const history = useHistory();

    useEffect(() => {
      checkInTemplateStore.fetchCheckInTemplates().then(() => {
        checkInTemplateStore.findCheckinTemplate(id);
      });
    }, []);

    const renderLoading = () => (
      <BodyContainer>
        <Loading />
      </BodyContainer>
    );

    const StopMeetingButton = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {
            history.push(`/check-in/success`);
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

export default CheckInWizard;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  font-size: 16px;
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
