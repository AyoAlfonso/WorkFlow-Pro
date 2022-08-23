import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { DeliverySection } from "./components/delivery-section";
import { toJS } from "mobx";
import { RoleNormalUser } from "~/lib/constants";
import { Label } from "~/components/shared/input";
import { MultiEntitySelectionDropdownList } from "./components/multi-entity-select";
import { Responses } from "./components/checkin-responses";
import { ParticipantsProps } from "./checkin-builder-layout";

interface SetupPageProps {
  selectedItems: Array<ParticipantsProps>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Array<ParticipantsProps>>>;
  setResponseViewers: React.Dispatch<React.SetStateAction<string>>;
  responseViewers: string;
  cadence: string;
  setCadence: React.Dispatch<React.SetStateAction<string>>;
  checkinTime: string;
  setCheckinTime: React.Dispatch<React.SetStateAction<string>>;
  checkinDay: string;
  setCheckinDay: React.Dispatch<React.SetStateAction<string>>;
  timezone: string;
  setTimezone: React.Dispatch<React.SetStateAction<string>>;
  reminderUnit: string;
  setReminderUnit: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  anonymousResponse: boolean;
  setAnonymousResponse: React.Dispatch<React.SetStateAction<boolean>>;
  reminderValue: string;
  setReminderValue: React.Dispatch<React.SetStateAction<string>>;
  selectedResponseItems: Array<ParticipantsProps>;
  setSelectedResponseItems: React.Dispatch<React.SetStateAction<Array<ParticipantsProps>>>;
}

export const SetupPage = ({
  selectedItems,
  setSelectedItems,
  responseViewers,
  setResponseViewers,
  cadence,
  setCadence,
  checkinTime,
  setCheckinTime,
  checkinDay,
  setCheckinDay,
  timezone,
  setTimezone,
  reminderUnit,
  setReminderUnit,
  selectedDate,
  setSelectedDate,
  anonymousResponse,
  setAnonymousResponse,
  reminderValue,
  setReminderValue,
  selectedResponseItems,
  setSelectedResponseItems,
}: SetupPageProps): JSX.Element => {
  const [teams, setTeams] = useState<Array<ParticipantsProps>>([]);
  const [company, setCompany] = useState<ParticipantsProps>({
    id: 0,
    name: "",
    type: "",
    defaultAvatarColor: "",
    avatarUrl: "",
  });
  const [companyUsers, setCompanyUsers] = useState<Array<ParticipantsProps>>([]);

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
      id: companyStore.company?.id,
      type: "company",
      defaultAvatarColor: "cautionYellow",
      avatarUrl: companyStore.company?.logoUrl,
      name: companyStore.company?.name,
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

    const user = {
      id: currentUser?.id,
      type: "user",
      defaultAvatarColor: currentUser?.defaultAvatarColor,
      avatarUrl: currentUser?.avatarUrl,
      name: currentUser?.firstName,
      lastName: currentUser?.lastName,
    };

    if (currentUser?.role === RoleNormalUser) {
      return setCompanyUsers([user]);
    } else {
      setCompanyUsers(users);
      setTeams(teams);
      setCompany(company);
    }
  }, []);

  const participantsSelector = item => {
    setSelectedItems([...selectedItems, item]);
  };

  const responsesSelector = item => {
    setSelectedResponseItems([...selectedResponseItems, item]);
  };

  const userList =
    currentUser?.role === RoleNormalUser ? [...companyUsers] : [...companyUsers, ...teams, company];

  return (
    <Container>
      <SectionContainer>
        <SectionHeader>Participants</SectionHeader>
        <Label>Who will be asked to respond?</Label>
        <MultiEntitySelectionDropdownList
          userList={[...userList]}
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
          setTimezone={setTimezone}
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
          responseViewers={responseViewers}
          anonymousResponse={anonymousResponse}
          setAnonymousResponse={setAnonymousResponse}
        />
        {responseViewers == "Custom" && (
          <MultiEntitySelectionDropdownList
            userList={[...userList]}
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
