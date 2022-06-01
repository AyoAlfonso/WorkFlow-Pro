import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/shared/button";
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { NewCheckInStep } from "./new-checkin-steps";

interface NewCheckinWizardLayoutProps {}

export const NewCheckinLayout = observer(
  (props: NewCheckinWizardLayoutProps): JSX.Element => {
    const { t } = useTranslation();
    const history = useHistory();
    const steps = [
      {
        name: "Select a template",
        description:
          "Most of the settings are pre-filled this way you can set up a Check-in with just a few clicks.",
        componentToRender: "checkInTemplates",
      },
    ];

    const title = () => R.path(["0", "name"], steps);

    const description = () => R.path(["0", "description"], steps);

    const component = () => <NewCheckInStep step={steps[0]} />;

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit?`)) {
        history.push(`/check-in`);
      }
    };
    return (
      <Container>
        <WizardLayout
          title={title()}
          description={description()}
          singleComponent={component()}
          showCloseButton={true}
          onCloseButtonClick={closeButtonClick}
          showBackButton={false}
          showSkipButton={false}
          customActionButton={<></>}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;
