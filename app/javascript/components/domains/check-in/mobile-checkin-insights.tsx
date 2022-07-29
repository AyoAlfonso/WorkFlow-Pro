import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Icon, Loading, Text } from "~/components/shared";
import { useMst } from "~/setup/root";
import {
  ChevronRightIcon,
  DateContainer,
  DropdownContainer,
  FlexContainer,
  IconContainer,
  InfoText,
  RightIcon,
  SectionContainer,
  SideBarHeader,
  StepContainer,
  StepIconContainer,
  StepText,
} from "./checkin-insights";
import DateSelector from "./components/date-selector";
import InitiativeInsights from "./components/initiatives-insights";
import JournalInsights from "./components/journal-insights";
import { KpiInsights } from "./components/kpi-insights";
import { NumericalStepInsights } from "./components/numerical-step-insights";
import { OpenEndedInsights } from "./components/open-ended-insights";
import ParticipationInsights from "./components/participation-insights";
import { YesNoInsights } from "./components/yes-no-insights";
import { getCadence, getTimezone } from "~/utils/check-in-functions";
import { ParticipantsAvatars } from "~/components/shared/participants-avatars";
import SentimentInsights from "./components/sentiment-insights";
import AgreementInsights from "./components/agreement-insights";

const MobileCheckinInsights = (): JSX.Element => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [insightsToShow, setInsightsToShow] = useState([]);
  const [insightDates, setInsightDates] = useState<any>([]);
  const [currentInsightDate, setCurrentInsightDate] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { id } = useParams();

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

  const responseNumber = getNumberOfResponses();
  const totalParticipants = getUsers(data.participants);

  if (loading) {
    return (
      <MobileLoadingContainer>
        <Loading />
      </MobileLoadingContainer>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <CheckinName>{data.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</CheckinName>
        <CloseIconContainer onClick={() => setOpen(true)}>
          <Icon icon="Info-PO" size={"24px"} iconColor="grey100" />
        </CloseIconContainer>
        {open && (
          <SideBar showSideBar={open}>
            <CloseIconContainer onClick={() => setOpen(false)}>
              <Icon ml={"auto"} icon="Close" size={"16px"} iconColor="grey100" />
            </CloseIconContainer>
            <SectionContainer>
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
              <AvatarContainer>
                <ParticipantsAvatars entityList={getEntityArray(data.viewers)} />
              </AvatarContainer>
            </SectionContainer>
            <SectionContainer>
              <SideBarHeader>steps</SideBarHeader>
              {data.checkInTemplatesSteps.map(step => (
                <StepContainer key={step.orderIndex}>
                  <StepIconContainer>
                    <ChevronRightIcon icon="Chevron-Left" iconColor="white" size="16px" />
                  </StepIconContainer>
                  <StepText>{step.variant || step.question}</StepText>
                </StepContainer>
              ))}
            </SectionContainer>
          </SideBar>
        )}
      </HeaderContainer>
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
      <ParticipationInsights
        responseNumber={responseNumber}
        totalNumberOfParticipants={totalParticipants}
      />
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
      <KpiInsights />
      <InitiativeInsights />
      <JournalInsights />
    </Container>
  );
};

export default MobileCheckinInsights;

const Container = styled.div`
  padding: 1em;
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileLoadingContainer = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  position: relative;
`;

type SideBarProps = {
  showSideBar: boolean;
};

const SideBar = styled.div<SideBarProps>`
  position: absolute;
  display: none;
  right: 0;
  top: 0;
  width: ${props => (props.showSideBar ? "60vw" : "0px")};
  transition: 0.2s;
  background: ${props => props.theme.colors.backgroundGrey};
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 60px);
  padding: 1em;
  z-index: 1;
  box-sizing: border-box;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const CheckinName = styled(Text)`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const CloseIconContainer = styled.div`
  display: flex;
`;

const AvatarContainer = styled.div`
  padding-left: 1em;
`;

const Option = styled.div`
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;
