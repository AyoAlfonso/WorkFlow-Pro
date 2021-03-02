import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useMst } from "~/setup/root";

import { WizardLayout } from "~/components/layouts/wizard-layout";
import { Loading } from "~/components/shared";
import { EFieldType, FormBuilder } from "~/components/shared/form-builder";

interface IOnboardingProps {}

export const Onboarding: React.FC = (props: IOnboardingProps) => {
  const { companyStore, staticDataStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});

  const loadOnboarding = useCallback(async () => {
    await staticDataStore.load();
    await companyStore.getOnboardingCompany();
    const { onboardingCompany } = companyStore;
    if (!R.isNil(onboardingCompany)) {
      // @TODO hydrate formData
      console.log(onboardingCompany);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOnboarding();
  }, [loadOnboarding]);

  if (loading) {
    return <Loading />;
  }

  const { fieldsAndLabels, headingsAndDescriptions, timeZones } = staticDataStore;

  const timeZonesWithNull = () => {
    const timeZoneList = timeZones.map(tz => ({ label: tz, value: tz }));
    timeZoneList.unshift({ label: "Please select a time zone", value: null });
    return timeZoneList;
  };

  const setFormState = (key: string, value: any) => {
    const newFormState = R.set(R.lensPath([currentStep, key]), value, formData);
    setFormData(newFormState);
  };

  const submitFormState = async () => {
    const data = R.path([currentStep], formData);
    // const logoData = R.path(["logo"], data);
    // if (!R.isNil(logoData) && !R.isEmpty(logoData)) {
    //   submitLogo(logoData);
    // }
    return await companyStore.updateCompany(data);
  };

  // const submitLogo = async logoData => {
  //   const form = new FormData();
  //   form.append("logo", logoData[0]);
  //   await companyStore.updateCompanyLogo(form);
  // };

  const onNextButtonClick = async () => {
    if (currentStep === 0) {
      // create company
      const data = R.path([currentStep], formData);
      companyStore.createCompany(data).then(res => {
        if (res === true) {
          setCurrentStep(c => c + 1);
        }
      });
    } else {
      // updateCompany
      submitFormState().then(res => {
        if (res === true) {
          setCurrentStep(c => c + 1);
        }
      });
    }
  };

  const hasCreationParams = () =>
    R.pipe(
      R.path("0"),
      R.props(["name", "logo", "timezone", "fiscal_year_start", "sign_up_purpose"]),
      R.none(R.or(R.isNil, R.isEmpty)),
    )(formData);

  const leftBodyComponentProps = [
    {
      step: 0,
      formFields: [
        {
          label: "Business Name",
          fieldType: EFieldType.TextField,
          formKey: "name",
          callback: setFormState,
        },
        {
          label: "Logo (preferably horizontal logos)",
          fieldType: EFieldType.Image,
          formKey: "logo",
          callback: setFormState,
        },
        {
          label: "Timezone",
          fieldType: EFieldType.Select,
          formKey: "timezone",
          callback: setFormState,
          options: timeZonesWithNull(),
        },
        {
          label: "Why did you decide to sign up for Lynchpyn?",
          fieldType: EFieldType.TextField,
          formKey: "sign_up_purpose",
          callback: setFormState,
        },
      ],
    },
    {
      step: 1,
      formFields: [
        {
          label: `Why does {companyName} exist?`,
          fieldType: EFieldType.TextArea,
          formKey: "core_1",
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `How do {companyName} employees and leaders behave? (AKA your core values)`,
          fieldType: EFieldType.TextArea,
          formKey: "core_2",
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What does {companyName} do?`,
          fieldType: EFieldType.TextArea,
          formKey: "core_3",
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What sets {companyName} apart from the rest?`,
          fieldType: EFieldType.TextArea,
          formKey: "core_4",
          callback: setFormState,
          style: { resize: "vertical" },
        },
      ],
    },
  ];

  const rightBodyComponentProps = [
    {
      step: 0,
      formFields: [
        {
          label: "Fiscal Year Start",
          fieldType: EFieldType.DateSelect,
          formKey: "fiscal_year_start",
          callback: setFormState,
        },
      ],
    },
  ];

  const leftBodyComponents = [
    <FormBuilder
      step={leftBodyComponentProps[0].step}
      formFields={leftBodyComponentProps[0].formFields}
      formData={formData}
    />,
    <FormBuilder
      step={leftBodyComponentProps[1].step}
      formFields={leftBodyComponentProps[1].formFields}
      formData={formData}
    />,
    <div>STEP TWO LEFT</div>,
    <div>STEP THREE LEFT</div>,
    <div>STEP FOUR LEFT</div>,
  ];

  const rightBodyComponents = [
    <FormBuilder
      step={rightBodyComponentProps[0].step}
      formFields={rightBodyComponentProps[0].formFields}
      formData={formData}
    />,
    <div>STEP ONE RIGHT</div>,
    <div>STEP TWO RIGHT</div>,
    <div>STEP THREE RIGHT</div>,
    <div>STEP FOUR RIGHT</div>,
  ];

  const stepLabels = R.pipe(
    R.props(["0", "1", "2", "3", "4"]),
    R.map(R.prop("stepLabel")),
  )(headingsAndDescriptions);

  return (
    <Container>
      <WizardLayout
        title={R.path([currentStep, "heading"], headingsAndDescriptions)}
        description={R.path([currentStep, "description"], headingsAndDescriptions)}
        showCloseButton={true}
        showSkipButton={currentStep === 1 || currentStep === 2}
        onCloseButtonClick={companyStore.closeOnboardingModal}
        onSkipButtonClick={() => setCurrentStep(c => c + 1)}
        onNextButtonClick={onNextButtonClick}
        leftBodyComponents={leftBodyComponents}
        rightBodyComponents={rightBodyComponents}
        currentStep={currentStep}
        steps={stepLabels}
        showLynchpynLogo={true}
        nextButtonDisabled={!hasCreationParams()}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`;
