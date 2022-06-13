import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { DeliverySection } from "./components/delivery-section";
import { toJS } from "mobx";
import { RoleNormalUser } from "~/lib/constants";
import { Label } from "~/components/shared/input";
import { MultiEntitySelectionDropdownList } from "./components/multi-entity-select";
import { Responses } from "./components/checkin-responses";

export const SetupPage = (): JSX.Element => {
  const [teams, setTeams] = useState<Array<any>>([]);
  const [company, setCompany] = useState(null);
  const [companyUsers, setCompanyUsers] = useState<Array<any>>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [responseViewers, setResponseViewers] = useState("All Participants");
  const [anonymousResponse, setAnonymousResponse] = useState(false);
  const [selectedResponseItems, setSelectedResponseItems] = useState([]);
  const [cadence, setCadence] = useState<string>("Every Weekday");
  const [checkinTime, setCheckinTime] = useState<string>("09:00 AM");
  const [checkinDay, setCheckinDay] = useState<string>("Monday");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timezone, setTimeZone] = useState("userTimeZone");
  const [reminderUnit, setReminderUnit] = useState("Hour(s)");
  const [reminderValue, setReminderValue] = useState("1");

  const { userStore, teamStore, companyStore, sessionStore } = useMst();
  const currentUser = sessionStore.profile;

  useEffect(() => {
    const teams =
      teamStore.teams &&
      toJS(teamStore)
        .teams.filter(team => team.active)
        .filter(team => {
          if (currentUser.role == RoleNormalUser) {
            const selectedTeam = teamStore.teams.filter(rawTeam => team.id == rawTeam.id);
            if (selectedTeam.length > 0) return selectedTeam[0]?.isAMember(currentUser);
          } else {
            return true;
          }
        })
        .map(team => {
          return {
            id: team.id,
            type: "team",
            executive: team.executive,
            defaultAvatarColor: team.defaultAvatarColor,
            name: team.name,
          };
        });

    const company = companyStore && {
      id: companyStore.company.id,
      type: "company",
      defaultAvatarColor: "cautionYellow",
      avatarUrl: companyStore.company.logoUrl,
      name: companyStore.company.name,
    };

    const users =
      userStore.users &&
      toJS(userStore)
        .users.filter(user => user.status == "active")
        .filter(user => {
          if (currentUser.role == RoleNormalUser) {
            return currentUser.id == user.id;
          } else {
            return true;
          }
        })
        .map(user => {
          return {
            id: user.id,
            type: "user",
            defaultAvatarColor: user.defaultAvatarColor,
            avatarUrl: user.avatarUrl,
            name: user.firstName,
            lastName: user.lastName,
          };
        });
    setCompanyUsers(users);
    setTeams(teams);
    setCompany(company);
  }, []);

  const participantsSelector = item => {
    setSelectedItems([...selectedItems, item]);
  };

  const responsesSelector = item => {
    setSelectedResponseItems([...selectedResponseItems, item]);
  };

  return (
    <Container>
      <SectionContainer>
        <SectionHeader>Participants</SectionHeader>
        <Label>Who will be asked to respond?</Label>
        <MultiEntitySelectionDropdownList
          userList={[...companyUsers, ...teams, company]}
          onUserSelect={participantsSelector}
          placeholder={"Select user, team, or the company"}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          currentUser={sessionStore.profile}
        />
      </SectionContainer>
      <SectionContainer>
        <SectionHeader>Delivery</SectionHeader>
        <DeliverySection
          cadence={cadence}
          setCadence={setCadence}
          checkinTime={checkinTime}
          setCheckinTime={setCheckinTime}
          checkinDay={checkinDay}
          setCheckinDay={setCheckinDay}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timezone={timezone}
          setTimezone={setTimeZone}
          reminderUnit={reminderUnit}
          setReminderUnit={setReminderUnit}
          reminderValue={reminderValue}
          setReminderValue={setReminderValue}
        />
      </SectionContainer>
      <SectionContainer>
        <SectionHeader>Responses</SectionHeader>
        <Responses
          setResponseViewers={setResponseViewers}
          anonymousResponse={anonymousResponse}
          setAnonymousResponse={setAnonymousResponse}
          responseViewers={responseViewers}
        />
        {responseViewers == "Custom" && (
          <MultiEntitySelectionDropdownList
            userList={[...companyUsers, ...teams, company]}
            onUserSelect={responsesSelector}
            placeholder={"Select user, team, or the company"}
            selectedItems={selectedResponseItems}
            setSelectedItems={setSelectedResponseItems}
            currentUser={sessionStore.profile}
          />
        )}
      </SectionContainer>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
`;

const SectionContainer = styled.div`
  margin-left: 1px;
  margin-right: 1px;
`;

const SectionHeader = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
  display: inline-block;
  margin-bottom: 1em;
`;
