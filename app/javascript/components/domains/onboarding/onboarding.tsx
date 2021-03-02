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
      const signUpPurpose = R.path(["signUpPurpose", "purpose"], onboardingCompany);
      const fiscalYearStart = new Date(R.path(["fiscalYearStart"], onboardingCompany));
      const coreFours = R.pipe(
        R.path(["coreFour"]),
        R.toPairs,
        R.pipe(
          R.path(["coreFour"]),
          R.toPairs,
          R.map(([key, value]) => {
            const newKey = R.pipe(
              R.replace("Content", ""),
              R.split(""),
              R.insert(4, "_"),
              R.join(""),
            )(key);
            return [newKey, value];
          }),
          R.fromPairs,
        ),
      )(onboardingCompany);
      const state = R.pipe(
        R.set(R.lens(R.prop("signUpPurpose"), R.assoc("signUpPurpose")), signUpPurpose),
        R.set(R.lens(R.prop("fiscalYearStart"), R.assoc("fiscalYearStart")), fiscalYearStart),
        R.set(R.lens(R.prop("coreFourAttributes"), R.assoc("coreFourAttributes")), coreFours),
        R.dissoc("coreFour"),
      )(onboardingCompany);
      setFormData(state);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOnboarding();
  }, [loadOnboarding]);

  const { fieldsAndLabels, headingsAndDescriptions, timeZones } = staticDataStore;
  const { onboardingCompany } = companyStore;

  if (loading) {
    return <Loading />;
  }

  const timeZonesWithNull = () => {
    const timeZoneList = timeZones.map(tz => ({ label: tz, value: tz }));
    timeZoneList.unshift({ label: "Please select a time zone", value: null });
    return timeZoneList;
  };

  const setFormState = (keys: Array<string>, value: any) => {
    const newFormState = R.set(R.lensPath(keys), value, formData);
    console.log(newFormState);
    setFormData(newFormState);
  };

  const submitFormState = async () => {
    return await companyStore.updateCompany(formData, true);
  };

  // const submitLogo = async logoData => {
  //   const form = new FormData();
  //   form.append("logo", logoData[0]);
  //   await companyStore.updateCompanyLogo(form);
  // };

  const onNextButtonClick = async () => {
    if (currentStep === 0 && R.isNil(onboardingCompany)) {
      // create company
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]: [string, string | Blob]) => {
        form.append(key, value);
      });
      companyStore.createCompany(form).then(res => {
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
      R.props(["name", "logo", "timezone", "fiscal_year_start", "sign_up_purpose_attributes"]),
      R.none(R.or(R.isNil, R.isEmpty)),
    )(formData);

  const leftBodyComponentProps = [
    {
      formFields: [
        {
          label: "Business Name",
          fieldType: EFieldType.TextField,
          formKeys: ["name"],
          callback: setFormState,
        },
        {
          label: "Logo (preferably horizontal logos)",
          fieldType: EFieldType.Image,
          formKeys: ["logo"],
          callback: setFormState,
        },
        {
          label: "Timezone",
          fieldType: EFieldType.Select,
          formKeys: ["timezone"],
          callback: setFormState,
          options: timeZonesWithNull(),
        },
        {
          label: "Why did you decide to sign up for Lynchpyn?",
          fieldType: EFieldType.TextField,
          formKeys: ["sign_up_purpose_attributes", "purpose"],
          callback: setFormState,
        },
      ],
    },
    {
      formFields: [
        {
          label: `Why does ${R.pathOr("", ["name"], onboardingCompany)} exist?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["core_four_attributes", "core_1"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `How do ${R.pathOr(
            "",
            ["name"],
            onboardingCompany,
          )} employees and leaders behave? (AKA your core values)`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["core_four_attributes", "core_2"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What does ${R.pathOr("", ["name"], onboardingCompany)} do?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["core_four_attributes", "core_3"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What sets ${R.pathOr("", ["name"], onboardingCompany)} apart from the rest?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["core_four_attributes", "core_4"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
      ],
    },
  ];

  const rightBodyComponentProps = [
    {
      formFields: [
        {
          label: "Fiscal Year Start",
          fieldType: EFieldType.DateSelect,
          formKeys: ["fiscal_year_start"],
          callback: setFormState,
        },
      ],
    },
  ];

  const leftBodyComponents = [
    <FormBuilder formFields={leftBodyComponentProps[0].formFields} formData={formData} />,
    <FormBuilder formFields={leftBodyComponentProps[1].formFields} formData={formData} />,
    <div>STEP TWO LEFT</div>,
    <div>STEP THREE LEFT</div>,
    <div>STEP FOUR LEFT</div>,
  ];

  const rightBodyComponents = [
    <FormBuilder formFields={rightBodyComponentProps[0].formFields} formData={formData} />,
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
