import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { toJS } from "mobx";
import { useMst } from "~/setup/root";
import { convertUrlToFile } from "~/utils/image-to-file";

import { WizardLayout } from "~/components/layouts/wizard-layout";
import { Loading } from "~/components/shared";
import { EFieldType, FormBuilder } from "~/components/shared/form-builder";
import { BulletedList } from "~/components/shared/bulleted-list";
import { GoalSummary } from "./goal-summary";
import { AddPyns } from "./add-pyns";
import { PynsSummary } from "./pyns-summary";
import { parseAnnualInitiative } from "./annual-initiative-parser";
import { observer } from "mobx-react";

interface IOnboardingProps { }

export const Onboarding: React.FC = observer((props: IOnboardingProps) => {
  const { companyStore, sessionStore, staticDataStore } = useMst();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const [goalData, setGoalData] = useState<any>({});
  const [pynsData, setPynsData] = useState<any>({});
  const [teamData, setTeamData] = useState<any>({});

  const loadOnboarding = useCallback(async () => {
    const { onboardingDisplayFormat, onboardingCompany } = companyStore;

    if (!R.isNil(onboardingCompany)) {
      const signUpPurpose = R.path(["signUpPurpose"], onboardingCompany);
      const fiscalYearStart = new Date(R.path(["fiscalYearStart"], onboardingCompany));
      const logoUrl = R.path(["logoUrl"], onboardingCompany);
      const logoFiles = R.isNil(logoUrl) ? [] : [await convertUrlToFile(logoUrl)];
      const coreFour = R.pipe(
        R.path(["coreFour"]),
        R.toPairs,
        R.map(([key, value]) => {
          return [
            R.pipe(R.replace("Content", ""), R.split(""), R.insert(4, "_"), R.join(""))(key),
            value,
          ];
        }),
        R.fromPairs,
      )(onboardingCompany);

      const formDataState = R.pipe(
        R.set(
          R.lens(R.prop("signUpPurposeAttributes"), R.assoc("signUpPurposeAttributes")),
          signUpPurpose,
        ),
        R.set(R.lens(R.prop("fiscalYearStart"), R.assoc("fiscalYearStart")), fiscalYearStart),
        R.set(R.lens(R.prop("coreFourAttributes"), R.assoc("coreFourAttributes")), coreFour),
        R.dissoc("coreFour"),
        R.dissoc("signUpPurpose"),
        R.set(R.lens(R.prop("logo"), R.assoc("logo")), logoFiles),
      )(onboardingCompany);
      setFormData(formDataState);
      setGoalData(companyStore.onboardingCompanyGoals);
      setPynsData(companyStore.onboardingKeyActivities);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    companyStore.getOnboardingCompany().then(data => {
      if (data) {
        loadOnboarding();
      }
    });
  }, [loadOnboarding]);

  const { fieldsAndLabels, headingsAndDescriptions, timeZones } = staticDataStore;
  const { onboardingCompany, onboardingDisplayFormat } = companyStore;
  const { profile } = sessionStore;

  if (loading || R.isNil(profile) || !timeZones) {
    return <Loading />;
  }

  const timeZonesWithNull = () => {
    const timeZoneList = toJS(timeZones).map(tz => ({ label: tz, value: tz }));
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

  const setPynsDataState = (keys: Array<string>, value: any) => {
    const newPynsDataState = R.set(R.lensPath(keys), value, pynsData);
    setPynsData(newPynsDataState);
  };

  const setTeamDataState = (keys: Array<string>, value: any) => {
    const newTeamDataState = R.set(R.lensPath(keys), value, teamData);
    setTeamData(newTeamDataState);
  };

  const submitFormState = async () => {
    let purgedFormData = formData;
    if (!formData.coreFourAttributes["core_1"]) {
      purgedFormData = R.omit(["coreFourAttributes"], purgedFormData);
    }
    return await companyStore.updateCompany(purgedFormData, true);
  };

  const submitGoalData = async () => {
    return await companyStore.updateOnboardingCompanyGoals(onboardingCompany.id, {
      rallyingCry: goalData.rallyingCry,
      annualInitiative: parseAnnualInitiative(goalData.annualInitiative),
    });
  };

  const submitPynsData = async () => {
    return await companyStore.updateOnboardingKeyActivities(onboardingCompany.id, pynsData);
  };

  const submitTeamDataAndComplete = async () => {
    return await companyStore.createOnboardingTeamAndInviteUsers(onboardingCompany.id, teamData);
  };

  const onStepClick = stepIndex => {
    setCurrentStep(stepIndex);
  };

  const incrementStep = () => {
    setCurrentStep(c => c + 1);
  };

  const onNextButtonClick = async () => {
    if (currentStep === 0 && R.isNil(onboardingCompany)) {
      const creationFormData = R.assoc("displayFormat", onboardingDisplayFormat, formData);
      companyStore.createCompany(creationFormData).then(res => {
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
    } else if (currentStep === 3) {
      submitPynsData().then(res => {
        if (res === true) {
          incrementStep();
        }
      });
    } else if (currentStep === 4) {
      if (!teamData["emails"]) {
        //CHRIS' NOTE: THE INDENTATION IS ON PURPOSE. DO NOT FIX IT.
        if (
          confirm(`Are you sure you don't want to invite other team members? 
          \n
True value of LynchPyn is in working together with others in your team and company. Add a few others in your team to get the most out of the platform!`)
        ) {
          submitTeamDataAndComplete().then(res => {
            companyStore.closeOnboardingModal();
          });
        }
      } else {
        submitTeamDataAndComplete().then(res => {
          companyStore.closeOnboardingModal();
        });
      }
    }
  };

  const hasCreationParams = () =>
    R.pipe(
      R.props(["name", "timezone", "fiscalYearStart"]),
      R.none(R.or(R.isNil, R.isEmpty)),
    )(formData);

  const leftBodyComponentProps = [
    {
      formFields: [
        {
          label: onboardingDisplayFormat == "Company" ? "Business Name" : "Forum Name",
          fieldType: EFieldType.TextField,
          formKeys: ["name"],
          callback: setFormState,
        },
        {
          label:
            onboardingDisplayFormat == "Company"
              ? "Logo"
              : "Logo (optional)",
          fieldType: EFieldType.CroppedImage,
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
          label: "Why did you decide to sign up for LynchPyn? (Optional)",
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
          placeholder: "Type here...",
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
          placeholder: "Type here...",
        },
        {
          label: `What does ${R.pathOr("", ["name"], onboardingCompany)} do?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["coreFourAttributes", "core_3"],
          callback: setFormState,
          style: { resize: "vertical" },
          placeholder: "Type here...",
        },
        {
          label: `What sets ${R.pathOr("", ["name"], onboardingCompany)} apart from the rest?`,
          fieldType: EFieldType.HtmlEditor,
          formKeys: ["coreFourAttributes", "core_4"],
          callback: setFormState,
          style: { resize: "vertical" },
          placeholder: "Type here...",
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
          subText: `Awesome ${profile.firstName}! This is what we call your LynchPyn Goal™. This is the ultimate filter when the company is making any strategic decisions until it's achieved`,
        },
        {
          label:
            "What's a specific Goal you can set for the next year to achieve your LynchPyn Goal™? This can be specific to your team.",
          fieldType: EFieldType.TextField,
          formKeys: ["annualInitiative", "description"],
          callback: setGoalDataState,
          subText: `Nice going.  This is your Annual Objective.  By adding an Annual Objective you can start a "lane" where Quarterly Initiatives can be added`,
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
    {
      formFields: [
        {
          label:
            onboardingDisplayFormat == "Company"
              ? "What team do you belong to? (create one, you can add others later)"
              : "What is your forum group's name?",
          fieldType: EFieldType.TextField,
          formKeys: ["teamName"],
          callback: setTeamDataState,
          subText: "Each member will get a link to set up their account",
          placeholder:
            onboardingDisplayFormat == "Company" ? "e.g. Leadership Team" : "e.g. Summiteers",
        },
        {
          label: "Email Addresses",
          fieldType: EFieldType.TextArea,
          formKeys: ["emails"],
          callback: setTeamDataState,
          subText: "Use commas to separate different emails",
          placeholder: `e.g. user@${(formData.name || "").replace(/\s+/g, "").toLowerCase()}.com`,
          style: { resize: "vertical", marginBottom: "16px" },
          rows: 8,
        },
      ],
    },
  ];

  const rightBodyComponentProps = [
    {
      formFields: [
        {
          label: onboardingDisplayFormat == "Company" ? "Fiscal Year Start" : "Cycle Start Date",
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
    <AddPyns formData={formData} />,
    <FormBuilder
      formFields={leftBodyComponentProps[3].formFields}
      formData={teamData}
      formContainerStyle={{ marginBottom: "48px" }}
      stepwise={false}
    />,
  ];

  const bulletContainerStyle = { height: "108px", paddingTop: "88px" };

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
        listItems={[
          "Keep fair prices low",
          "Create fanatically loyal customers",
          "Make sure planes are on time",
        ]}
        containerStyle={bulletContainerStyle}
      />
    </>,
    <GoalSummary formData={goalData} />,
    <PynsSummary goalData={goalData} />,
    <></>,
  ];

  const headingsAndDescriptionsWithOnboardingDisplayFormat = R.mapObjIndexed(
    (val, key, obj) =>
      R.pipe(
        R.toPairs,
        R.map(([k, v]) => [k, R.replace("{displayFormat}", R.toLower(onboardingDisplayFormat), v)]),
        R.map(([k, v]) => [
          k,
          R.replace(
            "{teamFormatHeading}",
            onboardingDisplayFormat == "Company" ? "Team" : "Forum",
            v,
          ),
        ]),
        R.map(([k, v]) => [
          k,
          R.replace(
            "{teamFormatDescription}",
            onboardingDisplayFormat == "Company"
              ? "The final step in your onboarding is adding your team. The power of LynchPyn is in collaboration; add your team and teammates so they can help you populate your company plan."
              : "Add your forum mates to get started. The power of Forum is in collaboration; add your forum mates so they can add topics for your Forum meetings and access the agenda prior to each meeting.",
            v,
          ),
        ]),
        R.fromPairs,
      )(val),
    headingsAndDescriptions,
  );

  const stepLabels = R.pipe(
    R.props(["0", "1", "2", "3", "4"]),
    R.map(R.prop("stepLabel")),
  )(headingsAndDescriptionsWithOnboardingDisplayFormat);

  const wizardTitles = R.path(
    [currentStep, "heading"],
    headingsAndDescriptionsWithOnboardingDisplayFormat,
  );

  const wizardDescriptions = R.path(
    [currentStep, "description"],
    headingsAndDescriptionsWithOnboardingDisplayFormat,
  );

  //////FORUM RELATED CHARGES

  const forumMode = companyStore.onboardingCompany && companyStore.onboardingCompany.accessForum;

  const leftBodyComponentsForum = [
    leftBodyComponents[0],
    <></>,
    <></>,
    <></>,
    leftBodyComponents[4],
  ];
  const rightBodyComponentsForum = [
    rightBodyComponents[0],
    <></>,
    <></>,
    <></>,
    rightBodyComponents[4],
  ];
  const stepLabelsForum = [stepLabels[0], stepLabels[4]];
  const onNextButtonClickForum = async () => {
    if (currentStep === 0 && R.isNil(onboardingCompany)) {
      const creationFormData = R.assoc("displayFormat", onboardingDisplayFormat, formData);
      companyStore.createCompany(creationFormData).then(res => {
        if (res === true) {
          setCurrentStep(4);
        }
      });
    } else if (currentStep === 0) {
      // updateCompany
      submitFormState().then(res => {
        if (res === true) {
          setCurrentStep(4);
        }
      });
    } else if (currentStep === 4) {
      if (!teamData["emails"]) {
        //CHRIS' NOTE: THE INDENTATION IS ON PURPOSE. DO NOT FIX IT.
        if (
          confirm(`Are you sure you don't want to invite other team members? 
          \n
True value of LynchPyn is in working together with others in your team and company. Add a few others in your team to get the most out of the platform!`)
        ) {
          submitTeamDataAndComplete().then(res => {
            companyStore.closeOnboardingModal();
          });
        }
      } else {
        submitTeamDataAndComplete().then(res => {
          companyStore.closeOnboardingModal();
        });
      }
    }
  };

  //////

  return forumMode ? (
    <Container>
      <WizardLayout
        title={wizardTitles}
        description={wizardDescriptions}
        showCloseButton={false}
        showSkipButton={false}
        onCloseButtonClick={companyStore.closeOnboardingModal}
        onSkipButtonClick={() => setCurrentStep(c => 4)}
        onNextButtonClick={onNextButtonClickForum}
        leftBodyComponents={leftBodyComponentsForum}
        rightBodyComponents={rightBodyComponentsForum}
        currentStep={currentStep}
        steps={stepLabelsForum}
        showLynchpynLogo={true}
        nextButtonDisabled={!hasCreationParams()}
        onStepClick={onStepClick}
        stepClickDisabled={currentStep === 0}
        completeButtonText={"Send Invites and Complete"}
        finalButtonDisabled={!teamData}
      />
    </Container>
  ) : (
    <Container>
      <WizardLayout
        title={wizardTitles}
        description={wizardDescriptions}
        showCloseButton={false}
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
        completeButtonText={"Send Invites and Complete"}
        finalButtonDisabled={!teamData}
      />
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`;
