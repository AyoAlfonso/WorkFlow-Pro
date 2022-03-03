import * as React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { EFieldType, FormBuilder } from "~/components/shared/form-builder";
import { rootStore, Provider } from "../app/javascript/setup/root";
import { useTranslation } from "react-i18next";
import { profile, timeZones } from "./shared/stories-data";
import { ScorecardsIndex } from "~/components/domains/scorecard/scorecards-index";
import { GoalSummary } from "~/components/domains/onboarding/goal-summary";
import { BulletedList } from "~/components/shared/bulleted-list";

export default { title: "Onbaording" };

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [formData, setFormData] = React.useState<any>({});
  const [goalData, setGoalData] = React.useState<any>({});
  const [pynsData, setPynsData] = React.useState<any>({});
  const [teamData, setTeamData] = React.useState<any>({});

  const setFormState = (keys: Array<string>, value: any) => {
    const newFormState = R.set(R.lensPath(keys), value, formData);
    setFormData(newFormState);
  };

  const setGoalDataState = (keys: Array<string>, value: any) => {
    const newGoalDataState = R.set(R.lensPath(keys), value, goalData);
    setGoalData(newGoalDataState);
  };

  const setTeamDataState = (keys: Array<string>, value: any) => {
    const newTeamDataState = R.set(R.lensPath(keys), value, teamData);
    setTeamData(newTeamDataState);
  };

  const timeZonesWithNull = () => {
    const timeZoneList = timeZones.map(tz => ({ label: tz, value: tz }));
    timeZoneList.unshift({ label: "Please select a time zone", value: null });
    return timeZoneList;
  };

  const onboardingCompany = {};

  const onboardingDisplayFormat = "Company";

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
          label: onboardingDisplayFormat == "Company" ? "Logo" : "Logo (optional)",
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
          label:
            "What's the most important thing your company has to achieve in the upcoming year?",
          fieldType: EFieldType.TextField,
          formKeys: ["rallyingCry"],
          callback: setGoalDataState,
          subText: !R.view(R.lensPath(["rallyingCry"]), goalData)
            ? ""
            : `Awesome ${profile.firstName}! This is what we call your LynchPyn Goal™. This is the ultimate filter when the company is making any strategic decisions until it's achieved`,
          style: { marginLeft: "2px" },
        },
        {
          label:
            "What's a specific Objective you can set for the next year to achieve your LynchPyn Goal™? This can be specific to your team.",
          fieldType: EFieldType.TextField,
          formKeys: ["annualInitiative", "description"],
          callback: setGoalDataState,
          subText: !R.view(R.lensPath(["annualInitiative", "description"]), goalData)
            ? ""
            : `Nice going.  This is your Annual Objective.  By adding an Annual Objective you can start a "lane" where Quarterly Initiatives can be added`,
          style: { marginLeft: "2px" },
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
          subText: !R.view(
            R.lensPath(["annualInitiative", "quarterlyGoals", "0", "description"]),
            goalData,
          )
            ? ""
            : "Almost there!  You have your Quarterly Initiative now, just one more thing left.",
          style: { marginLeft: "2px" },
        },
        {
          label: `What is a measurable outcome required to achieve "${R.pathOr(
            "",
            ["annualInitiative", "quarterlyGoals", "0", "description"],
            goalData,
          )}"? It should be a specific metric.`,
          fieldType: EFieldType.AddKeyResult,
          formKeys: ["annualInitiative", "quarterlyGoals", "0", "keyElements", "0"],
          callback: setGoalDataState,
          style: { marginLeft: "2px" },
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

  const bulletContainerStyle = { height: "105px", paddingTop: "60px" };

  return (
    <Provider value={rootStore}>
      <ContainerDiv>
        <h1>Step 1</h1>
        <Section>
          <SectionContainer>
            <FormBuilder
              formFields={leftBodyComponentProps[0].formFields}
              formData={formData}
              stepwise={false}
            />
          </SectionContainer>
          <SectionContainer>
            <FormBuilder
              formFields={rightBodyComponentProps[0].formFields}
              formData={formData}
              stepwise={false}
            />
          </SectionContainer>
        </Section>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Step 2</h1>
        <ScorecardsIndex ownerType={"company"} ownerId={2} />
      </ContainerDiv>
      <ContainerDiv>
        <h1>Step 3</h1>
        <Section>
          <SectionContainer>
            <FormBuilder
              formFields={leftBodyComponentProps[1].formFields}
              formData={goalData}
              formContainerStyle={[
                { height: "140px" },
                { height: "180px" },
                { height: "140px" },
                { height: "140px" },
              ]}
              stepwise={true}
            />
          </SectionContainer>
          <SectionContainer>
            <GoalSummary formData={goalData} />
          </SectionContainer>
        </Section>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Step 4</h1>
        <Section>
          <SectionContainer>
            <FormBuilder
              formFields={leftBodyComponentProps[2].formFields}
              formData={formData}
              formContainerStyle={{ height: "155px" }}
              stepwise={false}
              marginBottom="20px"
            />
          </SectionContainer>
          <SectionContainer>
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
            </>
            ,
          </SectionContainer>
        </Section>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Step 3</h1>
        <Section>
          <SectionContainer>
            <FormBuilder
              formFields={leftBodyComponentProps[3].formFields}
              formData={teamData}
              formContainerStyle={{ marginBottom: "48px" }}
              stepwise={false}
            />
          </SectionContainer>
          <SectionContainer>
            {/* <GoalSummary formData={goalData} /> */}
          </SectionContainer>
        </Section>
      </ContainerDiv>
    </Provider>
  );
};

const Container = styled.div`
  padding: 0 10px;
`;

const Section = styled.div`
  display: flex;
`

const SectionContainer = styled.div`
  width: 50%;
  margin-right: 20px;
`;
