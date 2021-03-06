import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useMst } from "~/setup/root";

import { WizardLayout } from "~/components/layouts/wizard-layout";
import { Loading } from "~/components/shared";
import { EFieldType, FormBuilder } from "~/components/shared/form-builder";
import { BulletedList } from "~/components/shared/bulleted-list";
import { GoalSummary } from "./goal-summary";

interface IOnboardingProps {}

export const Onboarding: React.FC = (props: IOnboardingProps) => {
  const { companyStore, sessionStore, staticDataStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const [goalData, setGoalData] = useState<any>({});

  const loadOnboarding = useCallback(async () => {
    await staticDataStore.load();
    await companyStore.getOnboardingCompany();
    const { onboardingCompany } = companyStore;
    if (!R.isNil(onboardingCompany)) {
      const signUpPurpose = R.path(["signUpPurpose"], onboardingCompany);
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
        R.set(
          R.lens(R.prop("signUpPurposeAttributes"), R.assoc("signUpPurposeAttributes")),
          signUpPurpose,
        ),
        R.set(R.lens(R.prop("fiscalYearStart"), R.assoc("fiscalYearStart")), fiscalYearStart),
        R.set(R.lens(R.prop("coreFourAttributes"), R.assoc("coreFourAttributes")), coreFours),
        R.dissoc("coreFour"),
        R.dissoc("signUpPurpose"),
      )(onboardingCompany);
      setFormData(state);
      await companyStore.getOnboardingCompanyGoals(onboardingCompany.id);
      setGoalData(companyStore.onboardingCompanyGoals);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOnboarding();
  }, [loadOnboarding]);

  const { fieldsAndLabels, headingsAndDescriptions, timeZones } = staticDataStore;
  const { onboardingCompany } = companyStore;
  const { profile } = sessionStore;

  if (loading || R.isNil(profile)) {
    return <Loading />;
  }

  const timeZonesWithNull = () => {
    const timeZoneList = timeZones.map(tz => ({ label: tz, value: tz }));
    timeZoneList.unshift({ label: "Please select a time zone", value: null });
    return timeZoneList;
  };

  const setFormState = (keys: Array<string>, value: any) => {
    const newFormState = R.set(R.lensPath(keys), value, formData);
    setFormData(newFormState);
  };

  const setGoalDataState = (keys: Array<string>, value: any) => {
    const newGoalDataState = R.set(R.lensPath(keys), value, goalData);
    setGoalData(newGoalDataState);
  };

  const submitFormState = async () => {
    return await companyStore.updateCompany(formData, true);
  };

  const submitGoalData = async () => {
    return await companyStore.updateOnboardingCompanyGoals(onboardingCompany.id, goalData);
  };

  // const submitLogo = async logoData => {
  //   const form = new FormData();
  //   form.append("logo", logoData[0]);
  //   await companyStore.updateCompanyLogo(form);
  // };

  const onStepClick = stepIndex => {
    setCurrentStep(stepIndex);
  };

  const incrementStep = () => {
    setCurrentStep(c => c + 1);
  };

  const onNextButtonClick = async () => {
    if (currentStep === 0 && R.isNil(onboardingCompany)) {
      // create company
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]: [string, string | Blob]) => {
        form.append(key, value);
      });
      companyStore.createCompany(form).then(res => {
        if (res === true) {
          incrementStep();
        }
      });
    } else if (currentStep < 2) {
      // updateCompany
      submitFormState().then(res => {
        if (res === true) {
          incrementStep();
        }
      });
    } else if (currentStep === 2) {
      submitGoalData().then(res => {
        if (res === true) {
          incrementStep();
        }
      });
    }
  };

  const hasCreationParams = () =>
    R.pipe(
      R.props(["name", "logo", "timezone", "fiscalYearStart", "signUpPurposeAttributes"]),
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
          formKeys: ["signUpPurposeAttributes", "purpose"],
          callback: setFormState,
        },
      ],
    },
    {
      formFields: [
        {
          label: `Why does ${R.pathOr("", ["name"], onboardingCompany)} exist?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["coreFourAttributes", "core_1"],
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
          formKeys: ["coreFourAttributes", "core_2"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What does ${R.pathOr("", ["name"], onboardingCompany)} do?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["coreFourAttributes", "core_3"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
        {
          label: `What sets ${R.pathOr("", ["name"], onboardingCompany)} apart from the rest?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["coreFourAttributes", "core_4"],
          callback: setFormState,
          style: { resize: "vertical" },
        },
      ],
    },
    {
      formFields: [
        {
          label:
            "What's the most important thing your company has to achieve in the upcoming year?",
          fieldType: EFieldType.TextField,
          formKeys: ["rallyingCry"],
          callback: setGoalDataState,
          subText: `Awesome ${profile.firstName}! This is what we call your Lynchpyn Goal. This is the ultimate filter when the company is making any strategic decisions until it's achieved`,
        },
        {
          label:
            "What's a specific Goal you can set for the next year to achieve your Lynchpyn Goal? This can be specific to your team.",
          fieldType: EFieldType.TextField,
          formKeys: ["annualInitiative", "description"],
          callback: setGoalDataState,
          subText: `Nice going.  This is your Annual Goal.  By adding an Annual Goal you can start a "lane" where Quarterly Initiatives can be added`,
        },
        {
          label: `What would be an Initiative you can take on this quarter towards "${R.pathOr(
            "",
            ["annualInitiative", "description"],
            goalData,
          )}"`,
          fieldType: EFieldType.TextField,
          formKeys: ["annualInitiative", "quarterlyGoals", "0", "description"],
          callback: setGoalDataState,
          subText:
            "Almost there!  You have your Quarterly Initiative now, just one more thing left.",
        },
        {
          label: `What would be an achievable milestone for this week to move you closer to "${R.pathOr(
            "",
            ["annualInitiative", "quarterlyGoals", "0", "description"],
            goalData,
          )}"`,
          fieldType: EFieldType.TextField,
          formKeys: ["annualInitiative", "quarterlyGoals", "0", "milestones", "0", "description"],
          callback: setGoalDataState,
          subText:
            "You're all done. Weekly Milestones are the final piece in the Goals and Initiatives puzzle. Click next to see how this helps you prioritize each day.",
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
          formKeys: ["fiscalYearStart"],
          callback: setFormState,
        },
      ],
    },
  ];

  const leftBodyComponents = [
    <FormBuilder
      formFields={leftBodyComponentProps[0].formFields}
      formData={formData}
      stepwise={false}
    />,
    <FormBuilder
      formFields={leftBodyComponentProps[1].formFields}
      formData={formData}
      formContainerStyle={{ height: "175px" }}
      stepwise={false}
    />,
    <FormBuilder
      formFields={leftBodyComponentProps[2].formFields}
      formData={goalData}
      formContainerStyle={{ height: "140px" }}
      stepwise={true}
    />,
    <div>STEP THREE LEFT</div>,
    <div>STEP FOUR LEFT</div>,
  ];

  const bulletContainerStyle = { height: "175px", marginBottom: "24px", marginTop: "18px" };

  const rightBodyComponents = [
    <FormBuilder
      formFields={rightBodyComponentProps[0].formFields}
      formData={formData}
      stepwise={false}
    />,
    <>
      <BulletedList
        heading={"e.g. Southwest Airline"}
        listItems={["Democratize Air Travel"]}
        containerStyle={bulletContainerStyle}
      />
      <BulletedList
        heading={"e.g. Southwest Airline"}
        listItems={["Warrior Spirit", "Servant's Heart", "Fun Loving"]}
        containerStyle={bulletContainerStyle}
      />
      <BulletedList
        heading={"e.g. Southwest Airline"}
        listItems={["No frill, point-to-point short-haul flights"]}
        containerStyle={bulletContainerStyle}
      />
      <BulletedList
        heading={"e.g. Southwest Airline"}
        listItems={["Warrior Spirit", "Servant's Heart", "Fun Loving"]}
        containerStyle={bulletContainerStyle}
      />
    </>,
    <GoalSummary formData={goalData} />,
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
        onStepClick={onStepClick}
        stepClickDisabled={currentStep === 0}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`;
