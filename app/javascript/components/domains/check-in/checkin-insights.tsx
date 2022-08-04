import { object } from "@storybook/addon-knobs";
import { observer } from "mobx-react";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Icon, Loading, Text } from "~/components/shared";
import { ParticipantsAvatars } from "~/components/shared/participants-avatars";
import { useMst } from "~/setup/root";
import { getCadence, getTimezone } from "~/utils/check-in-functions";
import AgreementInsights from "./components/agreement-insights";
import DateSelector from "./components/date-selector";
import InitiativeInsights from "./components/initiatives-insights";
import JournalInsights from "./components/journal-insights";
import { KpiInsights } from "./components/kpi-insights";
import { NumericalStepInsights } from "./components/numerical-step-insights";
import { OpenEndedInsights } from "./components/open-ended-insights";
import ParticipationInsights from "./components/participation-insights";
import SentimentInsights from "./components/sentiment-insights";
import { YesNoInsights } from "./components/yes-no-insights";

export const CheckinInsights = observer(
  (): JSX.Element => {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [insightsToShow, setInsightsToShow] = useState([]);
    const [insightDates, setInsightDates] = useState<any>([]);
    const [currentInsightDate, setCurrentInsightDate] = useState("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const { id } = useParams();
    const history = useHistory();

    const {
      checkInTemplateStore: { getCheckInTemplateInsights, checkInTemplateInsights },
      userStore,
      teamStore,
      companyStore,
    } = useMst();

    useEffect(() => {
      getCheckInTemplateInsights(id).then(temp => {
        setData(temp);
        const insightKeys = Object.keys(temp.period);
        const insightDateToShow = insightKeys[insightKeys.length - 1];
        setCurrentInsightDate(insightDateToShow);
        setInsightDates(insightKeys);
        setInsightsToShow(temp.period[insightDateToShow]);
        setLoading(false);
      });
    }, []);

    const getEntityArray = entityArray => {
      const entityArrayToReturn = [];
      entityArray?.forEach(entity => {
        if (entity.type === "user") {
          const user = userStore.users?.find(user => user.id === entity.id);
          if (user) {
            entityArrayToReturn.push({
              id: user.id,
              type: "user",
              defaultAvatarColor: user.defaultAvatarColor,
              avatarUrl: user.avatarUrl,
              name: user.firstName,
              lastName: user.lastName,
            });
          }
        } else if (entity.type === "team") {
          const team = teamStore.teams?.find(team => team.id === entity.id);
          if (team) {
            entityArrayToReturn.push({
              id: team.id,
              type: "team",
              defaultAvatarColor: team.defaultAvatarColor,
              name: team.name,
            });
          }
        } else {
          companyStore.company &&
            entityArrayToReturn.push({
              id: companyStore.company?.id,
              type: "company",
              avatarUrl: companyStore.company?.logoUrl,
              name: companyStore.company?.name,
            });
        }
      });
      return entityArrayToReturn;
    };

    const getDeliveryStatement = () => {
      const dateTimeConfig = data.dateTimeConfig;

      const timezone = `${getTimezone[data.timeZone]} time zone`;
      const cadence = getCadence(dateTimeConfig.cadence);
      const time = moment(dateTimeConfig.time, ["HH:mm"]).format("hh:mm A");

      const deliveryStatement = `${cadence} at ${time} ${
        dateTimeConfig.day || dateTimeConfig.date
          ? `on ${dateTimeConfig.day || dateTimeConfig.date}`
          : ""
      } in the ${timezone}`;

      return deliveryStatement;
    };

    const getUsersFromEntityArray = entityArray => {
      const users = [];
      const entityArrayToReturn = getEntityArray(entityArray);

      entityArrayToReturn.map(entity => {
        if (entity.type === "user") {
          users.push(entity);
        } else if (entity.type === "team") {
          teamStore.teams?.map(team => {
            if (team.id === entity.id) {
              team.users?.map(user => {
                users.push({
                  id: user.id,
                  type: "user",
                  defaultAvatarColor: user.defaultAvatarColor,
                  avatarUrl: user.avatarUrl,
                  name: user.firstName,
                  lastName: user.lastName,
                });
              });
            }
          });
        } else if (entity.type === "company") {
          userStore.users
            .filter(user => user.status == "active")
            .map(user => {
              users.push({
                id: user.id,
                type: "user",
                defaultAvatarColor: user.defaultAvatarColor,
                avatarUrl: user.avatarUrl,
                name: user.firstName,
                lastName: user.lastName,
              });
            });
        }
      });

      return users;
    };

    const getUsers = entityArray => {
      const usersArray = getUsersFromEntityArray(entityArray);

      const users = usersArray.reduce((filtered, item) => {
        if (!filtered.some(filteredItem => JSON.stringify(filteredItem) == JSON.stringify(item)))
          filtered.push(item);
        return filtered;
      }, []);
      return users.length;
    };

    const getSteps = data?.checkInTemplatesSteps?.map(step => step.name);

    const steps = data.checkInTemplatesSteps;

    const handleClick = action => {
      const index = insightDates.indexOf(currentInsightDate);
      if (action === "next") {
        if (index < insightDates.length - 1) {
          setCurrentInsightDate(insightDates[index + 1]);
          setInsightsToShow(data.period[insightDates[index + 1]]);
        }
      } else if (action === "previous") {
        if (index > 0) {
          setCurrentInsightDate(insightDates[index - 1]);
          setInsightsToShow(data.period[insightDates[index - 1]]);
        }
      }
    };

    const isPrevDisabled = () => {
      const index = insightDates.indexOf(currentInsightDate);
      if (index === 0) {
        return true;
      }
      return false;
    };

    const isNextDisabled = () => {
      const index = insightDates.indexOf(currentInsightDate);
      if (index === insightDates.length - 1) {
        return true;
      }
      return false;
    };

    const getNumberOfResponses = () => {
      const logs = insightsToShow
        .map(artifact => {
          if (artifact.checkInArtifactLogs[0]) {
            return {
              ...artifact.checkInArtifactLogs[0],
              ownedBy: artifact.ownedById,
              updatedAt: artifact.updatedAt,
            };
          }
        })
        .filter(Boolean);
      return logs.length;
    };

    if (loading) {
      return (
        <DesktopLoadingContainer>
          <Loading />
        </DesktopLoadingContainer>
      );
    }

    const responseNumber = getNumberOfResponses();
    const totalParticipants = getUsers(data.participants);
    const { createdAt, updatedAt } = data;
    const userArtifact = data.period[currentInsightDate].find(
      artifact => artifact.ownedBy === userStore.user?.id,
    );

    return (
      <Container>
        <SideBar>
          <SectionContainer>
            <IconContainer onClick={() => history.push(`/check-in/edit/${userArtifact?.id}`)}>
              <Icon icon={"Settings"} size="18px" iconColor={"greyActive"} ml="auto" />
            </IconContainer>
            <SideBarHeader>participants</SideBarHeader>
            <AvatarContainer>
              <ParticipantsAvatars entityList={getEntityArray(data.participants)} />
            </AvatarContainer>
          </SectionContainer>
          <SectionContainer>
            <SideBarHeader>delivery</SideBarHeader>
            <InfoText>{getDeliveryStatement()}</InfoText>
          </SectionContainer>
          <SectionContainer>
            <SideBarHeader>response</SideBarHeader>
            {/* <InfoText>Manager</InfoText> */}
            <AvatarContainer>
              <ParticipantsAvatars entityList={getEntityArray(data.viewers)} />
            </AvatarContainer>
          </SectionContainer>
          <StepsSection>
            <SideBarHeader>steps</SideBarHeader>
            <StepsContainer>
              {data.checkInTemplatesSteps.map(step => (
                <StepContainer key={step.orderIndex}>
                  <StepIconContainer>
                    <ChevronRightIcon icon="Chevron-Left" iconColor="white" size="16px" />
                  </StepIconContainer>
                  <StepText>{step.variant || step.question}</StepText>
                </StepContainer>
              ))}
            </StepsContainer>
          </StepsSection>
          <DateInfoSection>
            <DateInfo>
              Created{" "}
              <DateText>{`${new Date(createdAt).toDateString()}, ${moment(createdAt).format(
                "hh:mm a",
              )}`}</DateText>
            </DateInfo>
            <DateInfo>
              Last updated{" "}
              <DateText>{`${new Date(updatedAt).toDateString()}, ${moment(updatedAt).format(
                "hh:mm a",
              )}`}</DateText>
            </DateInfo>
          </DateInfoSection>
        </SideBar>
        <InsightsContainer>
          <CheckinName>{data.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</CheckinName>
          <FlexContainer>
            <IconContainer disabled={isPrevDisabled()} onClick={() => handleClick("previous")}>
              <Icon
                icon={"Chevron-Left"}
                size={"12px"}
                iconColor={isPrevDisabled() ? "greyInactive" : "greyActive"}
              />
            </IconContainer>
            <DateContainer onClick={() => setShowDropdown(!showDropdown)}>
              {moment(currentInsightDate).format("dddd, MMMM Do, YYYY")}
              <Icon icon={"Chevron-Down"} size={"12px"} iconColor={"grey100"} />
            </DateContainer>
            <IconContainer disabled={isNextDisabled()} onClick={() => handleClick("next")}>
              <RightIcon
                icon={"Chevron-Left"}
                size={"12px"}
                iconColor={isNextDisabled() ? "greyInactive" : "greyActive"}
              />
            </IconContainer>

            {showDropdown && (
              <DropdownContainer>
                {insightDates.map(insightDate => (
                  <Option
                    key={`${insightDate}`}
                    onClick={() => {
                      setCurrentInsightDate(insightDate);
                      setInsightsToShow(data.period[insightDate]);
                      setShowDropdown(false);
                    }}
                  >
                    {moment(insightDate).format("dddd, MMMM Do, YYYY")}
                  </Option>
                ))}
              </DropdownContainer>
            )}
          </FlexContainer>
          <ContentContainer>
            <LeftContainer>
              {getSteps.includes("Open-ended") && (
                <OpenEndedInsights insightsToShow={insightsToShow} steps={steps} />
              )}
              {getSteps.includes("Numeric") && (
                <NumericalStepInsights insightsToShow={insightsToShow} steps={steps} />
              )}
              {getSteps.includes("Sentiment") && (
                <SentimentInsights insightsToShow={insightsToShow} steps={steps} />
              )}
              {getSteps.includes("Agreement Scale") && (
                <AgreementInsights insightsToShow={insightsToShow} steps={steps} />
              )}
              {getSteps.includes("Yes/No") && (
                <YesNoInsights insightsToShow={insightsToShow} steps={steps} />
              )}
              <KpiInsights insightsToShow={insightsToShow} />
              <InitiativeInsights insightsToShow={insightsToShow} />
              <JournalInsights />
            </LeftContainer>
            <ParticipationInsights
              responseNumber={responseNumber || 0}
              totalNumberOfParticipants={totalParticipants || 0}
            />
          </ContentContainer>
        </InsightsContainer>
      </Container>
    );
  },
);

const LeftContainer = styled.div``;

const DesktopLoadingContainer = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const SideBarContentContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
  height: 100%;
  margin-left: -40px;
  margin-top: -31px;
  margin-right: -40px;
  height: calc(100vh - 130px);
  display: flex;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const SideBar = styled.div`
  width: 18%;
  max-width: 240px;
  background: ${props => props.theme.colors.backgroundGrey};
  height: 100%;
  padding: 32px;
  position: fixed;
  // overflow-y: auto;

  @media only screen and (min-width: 1600px) {
    left: 96px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 0 2em;
`;

const InsightsContainer = styled.div`
  padding: 32px;
  width: 82%;
  max-width: 1280px;
  // overflow-y: auto;
  height: 100%;
  overscroll-behavior: contain;
  padding-left: 330px;
  @media only screen and (min-width: 1600px) {
    margin: 0 auto;
    padding-left: 200px;
  }
  @media only screen and (min-width: 1800px) {
    padding-left: 32px;
  }
`;

const CheckinName = styled(Text)`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1em;
`;

export const StepsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const StepsSection = styled.div`
  margin-bottom: 1em;
  height: 40%;
  display: flex;
  flex-direction: column;

  @media only screen and (min-height: 2000px) {
    height: 80%;
  }

  @media only screen and (min-height: 1200px) {
    height: 60%;
  }
`;

export const DateInfoSection = styled.div``;

export const DateText = styled(Text)`
  font-size: 12px;
  font-weight: normal;
  margin: 0;
`;

export const SideBarHeader = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.grey100};
  text-align: left-align;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

export const SectionContainer = styled.div`
  margin-bottom: 1em;
`;

export const InfoText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.black};
  margin: 0;
  padding-left: 1em;
`;

export const DateInfo = styled(InfoText)`
  font-size: 12px;
  margin-bottom: 1em;
`;

export const StepIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary100};
  margin-right: 0.5em;
`;

export const ChevronRightIcon = styled(Icon)`
  transform: rotate(180deg);
`;

export const StepText = styled.div`
  color: ${props => props.theme.colors.black};
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
  margin-bottom: 0.5em;
`;

const AvatarContainer = styled.div`
  padding-left: 1em;
`;

type IconContainerProps = {
  disabled?: boolean;
};

export const IconContainer = styled.div<IconContainerProps>`
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
  display: flex;
`;

export const DateContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.borderGrey};
  color: ${props => props.theme.colors.grey100};
  padding: 0.5em 1em;
  font-size: 0.75em;
  font-weight: bold;
  margin: 0 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  gap: 0 1em;
  cursor: pointer;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  position: relative;
  width: fit-content;
`;

export const DropdownContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  padding: 8px 0px;
  position: absolute;
  box-shadow: 0px 3px 6px #00000029;
  width: 100%;
  // z-index: 5;
  bottom: -80px;
`;

export const Option = styled.div`
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

export const RightIcon = styled(Icon)`
  transform: rotate(180deg);
`;
