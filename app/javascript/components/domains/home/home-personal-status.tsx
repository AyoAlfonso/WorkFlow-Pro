import React, { useState } from "react";
import CSS from "csstype";
import { path } from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import { Icon, IIconProps } from "~/components/shared/icon";

interface IWorkStatus {
  containerProps: CSS.Properties;
  iconProps: IIconProps;
  label: string;
}

interface IWorkStatusOptions {
  [key: string]: IWorkStatus;
}
interface IHomePersonalStatusState {
  menuOpen: boolean;
  selectedStatus: string | null;
}
const defaultHomePersonalStatusState: IHomePersonalStatusState = {
  menuOpen: false,
  selectedStatus: "in_office",
};
export const HomePersonalStatus = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const { t } = useTranslation();
    const name = path(["profile", "firstName"], sessionStore) || "User";
    const [homePersonalStatusState, setHomePersonalStatusState] = useState<
      IHomePersonalStatusState
    >(defaultHomePersonalStatusState);
    const { menuOpen, selectedStatus } = homePersonalStatusState;
    const options: IWorkStatusOptions = {
      work_from_home: {
        containerProps: {
          backgroundColor: "backgroundBlue",
          color: "primary100",
        },
        iconProps: {
          icon: "WFH",
          iconColor: "primary100",
        },
        label: "WFH",
      },
      in_office: {
        containerProps: {
          backgroundColor: "successGreenOpaque",
          color: "finePine",
        },
        iconProps: {
          icon: "In-Office",
          iconColor: "finePine",
        },
        label: "In-Office",
      },
      half_day: {
        containerProps: {
          backgroundColor: "backgroundYellow",
          color: "cautionYellow",
        },
        iconProps: {
          icon: "Half-Day",
          iconColor: "cautionYellow",
        },
        label: "Half-day",
      },
      day_off: {
        containerProps: {
          backgroundColor: "backgroundRed",
          color: "warningRed",
        },
        iconProps: {
          icon: "No-Check-in",
          iconColor: "warningRed",
        },
        label: "I'm Off",
      },
    };

    const renderChevron = (): JSX.Element => (
      <Icon
        icon={menuOpen ? "Chevron-Up" : "Chevron-Down"}
        size={15}
        style={{ paddingRight: "15px" }}
      />
    );

    const renderDropDownMenuItem = (item, rightIcon?: () => JSX.Element) => (
      <DropdownMenuItem
        key={item}
        {...options[item].containerProps}
        onClick={() =>
          setHomePersonalStatusState({ ...homePersonalStatusState, selectedStatus: item })
        }
      >
        <Icon {...options[item].iconProps} margin={"0px 10px"} />
        <div>{options[item].label}</div>
        {/* Empty div to even out spacing */}
        {rightIcon ? rightIcon() : <div></div>}
      </DropdownMenuItem>
    );
    const renderOptions = Object.keys(options).map(key => renderDropDownMenuItem(key));
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
              trigger={<div>{renderDropDownMenuItem(selectedStatus, renderChevron)}</div>}
              // offsetX={-50}
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

const DropdownMenuItem = styled.div`
  align-items: center;
  background-color: ${props => props.theme.colors[props.backgroundColor]};
  color: ${props => props.theme.colors[props.color]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  padding: 5px;
  :hover {
    border: solid 2px ${props => props.theme.colors[props.color]};
  }
`;

const selectContainerStyles = {
  width: "50%",
};
