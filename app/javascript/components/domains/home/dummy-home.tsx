import * as R from "ramda";
import * as React from "react";
import { useState } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { Plan } from "./shared/plan-button";
import { Habits } from "../habits/habits-widget";
import { Loading } from "../../shared/loading";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { HomeKeyActivities } from "./home-key-activities/home-key-activities";
import { useTranslation } from "react-i18next";
import { ToolsWrapper, ToolsHeader } from "~/components/shared/styles/overview-styles";
import { LynchPynBadge } from "../meetings-forum/components/lynchpyn-badge";
import { ColumnContainer, ColumnSubHeaderContainer } from "~/components/shared/styles/row-style";
import { Heading } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { KeyActivityListSubHeaderContainer } from "~/components/domains/key-activities/key-activities-list";
import { Icon } from "~/components/shared";
import { HomeContainerBorders } from "../home/shared-components";
import { KeyActivityRecord } from "~/components/shared/issues-and-key-activities/dummy-key-activity-record";
import { IconContainerWithPadding } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";
import { AccordionSummaryInverse } from "~/components/shared/accordion-components";
import { JournalHeader } from "../journal/journal-header";
import { JournalBody } from "../journal/journal-body";
import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";


export const DummyHome = (): JSX.Element => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string>("");
  const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };
  const {
    sessionStore: { profile },
    companyStore: { company },
    meetingStore,
  } = useMst();

  const instanceType = company && company.accessForum ? "forum" : "teams";

  const renderPlanAndReflect = (): JSX.Element => {
      return (
        <PlanAndReflectContainer>
          <SelectionText type={"small"}>
            Plan
          </SelectionText>
          <SeprationDot />
          <SelectionText type={"small"}>
            Reflect
          </SelectionText>
        </PlanAndReflectContainer>
      );
    };

  return (
    <Overlay>
      <Wrapper>
        <Upgradetextcontainer>
          <IconWrapper>
            <Icon icon={"Planner"} size={160} iconColor={"#005FFE"} />
          </IconWrapper>
          <Boldtext>
            Get the information you need to drive success in your business
          </Boldtext>
          <Subtext>
            Upgrade to a higher tier to get access to Pyns
          </Subtext>
          {/* <Link to="http://go.lynchpyn.com/upgrade"> */}
          <Talktous
          // type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href='http://go.lynchpyn.com/upgrade';
          }}>
            Talk to Us
          </Talktous>
          {/* </Link> */}
        </Upgradetextcontainer>
      </Wrapper>
      <Container>
      <KeyActivitiesWrapperContainer>
          <KeyActivityColumnStyleListContainer>
            <HeaderContainer>
              <>
                <HeaderRowContainer>
                  <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"} mt={0}>
                    Today
                  </Heading>
                  {renderPlanAndReflect()}
                </HeaderRowContainer>
                <HeaderRowContainer>
                  <KeyActivityListSubHeaderContainer>September 1st</KeyActivityListSubHeaderContainer>
                  {/* {!R.isNil(scheduledGroupId) && ( */}
                     <SortContainer>
                      <Icon icon={"Sort"} size={12} iconColor="grey100" />
                      {/* {sortFilterOpen && (
                        <FilterDropdown setFilterOpen={setFilterOpen} scheduledGroupId={scheduledGroupId} />
                      )} */}
                    </SortContainer>
                   {/* )} */}
                </HeaderRowContainer>
              </>
            </HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButtonContainer>
                <AddNewKeyActivityPlus>
                  <Icon icon={"Plus"} size={16} /*iconColor={plusIconColor}*//>
                </AddNewKeyActivityPlus>
                <AddNewKeyActivityText> {t("keyActivities.addTitle")}</AddNewKeyActivityText>
              </CreateKeyActivityButtonContainer>
              <KeyActivitiesListStyleContainer>
                    <KeyActivitiesContainer>
                      <KeyActivityContainer>
                        {/* <KeyActivityRecord
                          keyActivity={keyActivity}
                          dragHandleProps={...provided.dragHandleProps}
                        /> */}
                      </KeyActivityContainer>
                    </KeyActivitiesContainer>
              </KeyActivitiesListStyleContainer>
            </KeyActivitiesListContainer>
          </KeyActivityColumnStyleListContainer>
          <KeyActivityColumnStyleListContainer>
            <HeaderContainer>
              <>
                <HeaderRowContainer>
                  <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"} mt={0}>
                    Tomorrow
                  </Heading>
                  {renderPlanAndReflect()}
                </HeaderRowContainer>
                <HeaderRowContainer>
                  <KeyActivityListSubHeaderContainer>September 2nd</KeyActivityListSubHeaderContainer>
                  {/* {!R.isNil(scheduledGroupId) && ( */}
                     <SortContainer>
                      <Icon icon={"Sort"} size={12} iconColor="grey100" />
                      {/* {sortFilterOpen && (
                        <FilterDropdown setFilterOpen={setFilterOpen} scheduledGroupId={scheduledGroupId} />
                      )} */}
                    </SortContainer>
                   {/* )} */}
                </HeaderRowContainer>
              </>
            </HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButtonContainer>
                <AddNewKeyActivityPlus>
                  <Icon icon={"Plus"} size={16} /*iconColor={plusIconColor}*//>
                </AddNewKeyActivityPlus>
                <AddNewKeyActivityText> {t("keyActivities.addTitle")}</AddNewKeyActivityText>
              </CreateKeyActivityButtonContainer>
              <KeyActivitiesListStyleContainer>
                    <KeyActivitiesContainer>
                      <KeyActivityContainer>
                        {/* <KeyActivityRecord
                          keyActivity={keyActivity}
                          dragHandleProps={...provided.dragHandleProps}
                        /> */}
                      </KeyActivityContainer>
                    </KeyActivitiesContainer>
              </KeyActivitiesListStyleContainer>
            </KeyActivitiesListContainer>
          </KeyActivityColumnStyleListContainer>
          {/* <FilterContainer>
            {renderFilterGroupOptions()}
            {renderFilterCompletedOption()}
            {renderFilterTeamOptions()}
          </FilterContainer>
          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            todayModalClicked={todayModalClicked}
            defaultSelectedGroupId={selectedFilterGroupId}
            defaultSelectedTeamId={selectedFilterTeamId}
            todayFilterGroupId={selectedFilterGroupIdToday}
          /> */}
        </KeyActivitiesWrapperContainer>
      <ToolsWrapper>
        <ToolsHeader type={"h2"} mt={0}>
          Tools
        </ToolsHeader>
        <AccordionSummaryInverse>
          <HeaderContainerNoBorder>
            <div style={{ width: "30px" }} />
            <AccordionHeaderText expanded={"notMatching"} accordionPanel={"team"} inverse={true}>
              Plan
            </AccordionHeaderText>
          </HeaderContainerNoBorder>
          <IconContainerWithPadding>
            <Icon icon={"Plan"} size={16} iconColor={"white"} />
          </IconContainerWithPadding>
        </AccordionSummaryInverse>
        <StyledOverviewAccordion
          expanded={expanded === "panel0"}
          onChange={handleChange("panel0")}
          elevation={0}
        >
          <HeaderContainerNoBorder>
          <Icon
            icon={"Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={"grey60"}
          />
          <AccordionHeaderText expanded={expanded} accordionPanel={"panel0"}>
            {" "}
            {"journals"}{" "}
          </AccordionHeaderText>
        </HeaderContainerNoBorder>
          {/* <JournalBody setQuestionnaireVariant={setQuestionnaireVariant} /> */}
        </StyledOverviewAccordion>
        {/* <Habits expanded={expanded} handleChange={handleChange} />
        <Issues expanded={expanded} handleChange={handleChange} /> */}
      </ToolsWrapper>
      {instanceType === "forum" && <LynchPynBadge />}
    </Container>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: relative;

`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
`;

const IconWrapper = styled.div`
  margin-top: 120px;
`;

const Boldtext = styled.div`
  font-family: exo;
  font-weight: bold;
  font-size: 36px;
  line-spacing: 48;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 32px;
  max-width: 720px;
  display: inline-block;
`;

const Subtext = styled.div`
  font-family: exo;
  font-weight: regular;
  font-size: 20px;
  line-spacing: 27;
  margin-bottom: 24px;
`;

const Talktous = styled.div`
  width: 120px;
  height: 28px;
  background: #005FFE 0% 0% no-repeat padding-box;
  border: 1px solid #005FFE;
  border-radius: 4px;
  opacity: 1;
  font-family: lato;
  font-weight: bold;
  font-size: 12px;
  color: #FFFFFF;
  display: inline-block;
  padding-top: 11px;
  line-spacing: 24;
 `;
  
export const Container = styled.div`
  display: flex;
  height: inherit;
  filter: blur(10px);
  opacity: 0.5;
  position: absolute;
`;

const KeyActivitiesWrapperContainer = styled.div`
  display: flex;
  width: 75%;
`;
const KeyActivityColumnStyleListContainer = ColumnContainer;
const HeaderContainer = styled.div``;
const HeaderRowContainer = styled.div`
  display: flex;
`;

const PlanAndReflectContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const SeprationDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.greyActive};
  margin-top: 15px;
  margin-bottom: auto;
  margin-left: 8px;
  margin-right: 8px;
`;

const SelectionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};

  &: hover {
    cursor: pointer;
  }
`;

const SortContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;

const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;

//////

const CreateKeyActivityButtonContainer = styled(HomeContainerBorders)`
  display: flex;
  margin-left: 4px;
  margin-top: 16px;
  box-shadow: ${props => "none"};
  &: hover {
    cursor: pointer;
  }
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 12px;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
`;

const KeyActivitiesListStyleContainer = styled.div`
  margin-top: 10px;
  height: 100%;
`;

type KeyActivityContainerType = {
  borderBottom?: string;
};

const KeyActivityContainer = styled.div<KeyActivityContainerType>`
  border-bottom: ${props => props.borderBottom};
  margin-right: ${props => (props.borderBottom ? "8px" : "")};
  margin-bottom: 8px;
`;

// type KeyActivitiesContainerType = {
//   isDraggingOver: any;
// };

const KeyActivitiesContainer = styled.div`
  height: 100%;
`;