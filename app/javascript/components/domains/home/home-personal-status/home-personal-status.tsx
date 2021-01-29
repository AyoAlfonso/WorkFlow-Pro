import React, { useState } from "react";
import { path } from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import Popup from "reactjs-popup";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { homePersonalStatusOptions as options } from "./home-personal-status-options";
import { HomePersonalStatusDropdownMenuItem } from "./home-personal-status-dropdown-menu-item";
import { Icon } from "~/components/shared/icon";
import * as moment from "moment";
import * as R from "ramda";

interface IHomePersonalStatusState {
  menuOpen: boolean;
}
const defaultHomePersonalStatusState: IHomePersonalStatusState = {
  menuOpen: false,
};
export const HomePersonalStatus = observer(
  (): JSX.Element => {
    const {
      sessionStore,
      sessionStore: {
        profile: {
          firstName,
          currentDailyLog,
          currentDailyLog: { workStatus },
        },
      },
    } = useMst();
    const { t } = useTranslation();
    const name = firstName || "User";
    const [homePersonalStatusState, setHomePersonalStatusState] = useState<
      IHomePersonalStatusState
    >(defaultHomePersonalStatusState);
    const { menuOpen } = homePersonalStatusState;

    const renderOptions = Object.keys(options).map(key => (
      <HomePersonalStatusDropdownMenuItem
        key={key}
        menuItem={options[key]}
        onSelect={async () => {
          await sessionStore.updateUser(
            {
              dailyLogsAttributes: [
                {
                  ...currentDailyLog,
                  workStatus: key,
                },
              ],
            },
            `You successfully changed your status to ${R.path([key, "label"], options)}`,
          );
        }}
      />
    ));

    const getGreetingTime = currentTime => {
      const splitAfternoon = 12; // 24hr time to split the afternoon
      const splitEvening = 18; // 24hr time to split the evening
      const currentHour = parseFloat(currentTime.format("HH"));
      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        return "Good Afternoon";
      } else if (currentHour >= splitEvening) {
        return "Good Evening";
      }
      return "Good Morning";
    };

    return (
      <Container>
        <GreetingsStatusContainer>
          <GreetingContainer>
            <GreetingText>
              {getGreetingTime(moment())} {name}
            </GreetingText>
          </GreetingContainer>
          <DropdownContainer>
            <DropdownMenu>
              <Popup
                arrow={false}
                closeOnDocumentClick
                contentStyle={{
                  border: "none",
                  borderRadius: "6px",
                  overflow: "hidden",
                  padding: 0,
                  width: "175px",
                }}
                on="click"
                onClose={() =>
                  setHomePersonalStatusState({ ...homePersonalStatusState, menuOpen: false })
                }
                onOpen={() =>
                  setHomePersonalStatusState({ ...homePersonalStatusState, menuOpen: true })
                }
                open={menuOpen}
                position="bottom center"
                trigger={
                  <div>
                    <HomePersonalStatusDropdownMenuItem
                      menuItem={options[workStatus]}
                      onSelect={() => null}
                      rightIcon={
                        <Icon
                          icon={menuOpen ? "Chevron-Up" : "Chevron-Down"}
                          size={15}
                          style={{ paddingRight: "15px" }}
                        />
                      }
                    />
                  </div>
                }
              >
                <div>{renderOptions}</div>
              </Popup>
            </DropdownMenu>
          </DropdownContainer>
        </GreetingsStatusContainer>
        <ToolsHeader>{t("tools.title")}</ToolsHeader>
      </Container>
    );
  },
);

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const GreetingsStatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const GreetingContainer = styled.div`
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
`;

const GreetingText = styled.p``;

const DropdownContainer = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 50px;
  overflow: hidden;
  width: 175px;
`;

const ToolsHeader = styled(Container)`
  width: 25%;
  margin-left: 50px;
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
`;

const DropdownMenu = styled.div``;
