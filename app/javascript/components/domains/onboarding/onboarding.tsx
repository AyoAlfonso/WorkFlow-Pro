import * as React from "react";
import * as R from "ramda";
import { useEffect, useState } from "react";
import { useMst } from "~/setup/root";

import { WizardLayout } from "~/components/layouts/wizard-layout";
import { Loading } from "~/components/shared";
import { EFieldType, OnboardingStep } from "./";

interface IOnboardingProps {}

export const Onboarding: React.FC = (props: IOnboardingProps) => {
  const { companyStore, sessionStore, staticDataStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const [imageData, setImageData] = useState<any>(new FormData());

  useEffect(() => {
    staticDataStore.load().then(res => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const { timeZones } = staticDataStore;

  const steps = [
    "Tell us more about yourself",
    "Your company's Foundation Four \u2122",
    "Create your first Goal",
    "Add your first Pyn (todo)",
    "Add your Team",
  ];

  const setFormState = (key: string, value: any) => {
    setFormData(R.mergeRight(formData, { [key]: value }));
  };

  const submitLogo = async () => {
    const form = new FormData();
    form.append("logo", imageData);
    await companyStore.updateCompanyLogo(form);
  };

  const leftBodyComponents = [
    {
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
          formKey: "company_option",
          callback: setFormState,
          options: timeZones.map(tz => ({ label: tz.name, value: tz.offset })),
        },
        {
          label: "Why did you decide to sign up for Lynchpyn?",
          fieldType: EFieldType.Select,
          formKey: "company_option",
          callback: setFormState,
          options: [
            { label: "Because", value: "Because" },
            { label: "A Reason", value: "A Reason" },
          ],
        },
      ],
    },
    {
      formFields: [
        {
          label: "field 2",
          fieldType: EFieldType.TextArea,
          formKey: "company_description",
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: "field 1",
          fieldType: EFieldType.TextField,
          formKey: "company_name",
          callback: setFormState,
        },
        {
          label: "field 2",
          fieldType: EFieldType.TextArea,
          formKey: "company_name",
          callback: setFormState,
        },
      ],
    },
    {
      formFields: [
        {
          label: "field 1",
          fieldType: EFieldType.TextField,
          formKey: "company_name",
          callback: setFormState,
        },
        {
          label: "field 2",
          fieldType: EFieldType.TextArea,
          formKey: "company_name",
          callback: setFormState,
        },
      ],
    },
    {
      formFields: [
        {
          label: "field 1",
          fieldType: EFieldType.TextField,
          formKey: "company_name",
          callback: setFormState,
        },
        {
          label: "field 2",
          fieldType: EFieldType.TextArea,
          formKey: "company_name",
          callback: setFormState,
        },
      ],
    },
    {
      formFields: [
        {
          label: "field 1",
          fieldType: EFieldType.TextField,
          formKey: "company_name",
          callback: setFormState,
        },
        {
          label: "field 2",
          fieldType: EFieldType.TextArea,
          formKey: "company_name",
          callback: setFormState,
        },
      ],
    },
  ];

  const rightBodyComponents = [
    {
      formFields: [
        {
          label: "Fiscal Year Start",
          fieldType: EFieldType.DateSelect,
          formKey: "company_option",
          callback: setFormState,
        },
      ],
    },
    {},
    {},
    {},
    {},
  ];

  return (
    <WizardLayout
      title={"Welcome!"}
      description={
        "Add some basic info about your company so we can set up an instance of LynchPyn for you."
      }
      showCloseButton={true}
      showBackButton={currentStep !== 0}
      showSkipButton={currentStep === 1 || currentStep === 2}
      onBackButtonClick={() => setCurrentStep(c => c - 1)}
      onSkipButtonClick={() => setCurrentStep(c => c + 1)}
      onNextButtonClick={() => setCurrentStep(c => c + 1)}
      leftBodyComponents={leftBodyComponents.map(componentObj => (
        <OnboardingStep formFields={componentObj.formFields} formData={formData} />
      ))}
      rightBodyComponents={rightBodyComponents.map(componentObj => (
        <OnboardingStep formFields={componentObj.formFields} formData={formData} />
      ))}
      currentStep={currentStep}
      steps={steps}
      showLynchpynLogo={true}
    />
  );
};
