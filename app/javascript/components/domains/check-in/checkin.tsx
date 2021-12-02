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
import moment from "moment";
import { HeaderBar } from "../nav";
import { validateWeekOf } from "~/utils/date-time";

interface CheckInProps {}

export const CheckIn = observer(
  (props: CheckInProps): JSX.Element => {
    const { checkInTemplateStore, sessionStore, companyStore } = useMst();
    const {
      profile: { id },
    } = sessionStore;

    const history = useHistory();

    const checkIn = checkInTemplateStore.currentCheckIn;

    const { weekOf } = useParams();

    useEffect(() => {
      validateWeekOf(weekOf, history, id);
      checkInTemplateStore.fetchCheckInTemplates();
      if (companyStore.company.objectivesKeyType === "KeyResults") {
        checkInTemplateStore.getCheckIn("Weekly Check-In");
      } else if (companyStore.company.objectivesKeyType === "Milestones") {
        checkInTemplateStore.getCheckIn("Weekly Check In");
      }
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
          Publish Check-in
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
