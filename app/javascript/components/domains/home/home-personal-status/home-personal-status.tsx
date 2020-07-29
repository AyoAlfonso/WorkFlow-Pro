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
          await sessionStore.updateUser({
            dailyLogsAttributes: [
              {
                ...currentDailyLog,
                workStatus: key,
              },
            ],
          });
        }}
      />
    ));

    return (
      <Container>
        <GreetingContainer>
          <GreetingText>{t("profile.greeting", { name })}</GreetingText>
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
                width: "250px",
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
      </Container>
    );
  },
);

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

const GreetingContainer = styled.div`
  font-size: 40pt;
  font-family: Exo;
  font-weight: 300;
`;

const GreetingText = styled.p``;

const DropdownContainer = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 50px;
  overflow: hidden;
  width: 250px;
`;

const DropdownMenu = styled.div``;
