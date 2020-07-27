import React, { useState } from "react";
import { path } from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";

export const HomePersonalStatus = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const { t } = useTranslation();
    const name = path(["profile", "firstName"], sessionStore) || "User";
    const [selectedOption, setSelectedOption] = useState<string>(null);
    const options = {
      work_from_home: "WFH",
      working: "Working",
      half_day: "Half-day",
      day_off: "I'm Off",
    };

    const renderOptions = Object.keys(options).map(key => (
      <div key={key} onClick={() => setSelectedOption(key)}>
        {options[key]}
      </div>
    ));
    return (
      <Container>
        <GreetingContainer>
          <GreetingText>{t("profile.greeting", { name })}</GreetingText>
        </GreetingContainer>
        <DropdownContainer>
          <Popup
            arrow={false}
            closeOnDocumentClick
            on="click"
            position="bottom center"
            trigger={<div className="menu-item">{options[selectedOption] || "Work Status"}</div>}
            offsetX={-50}
          >
            <div>{renderOptions}</div>
          </Popup>
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
  flex: 0.2;
  font-size: 40pt;
  font-family: Exo;
  font-weight: 300;
`;

const GreetingText = styled.p``;

const DropdownContainer = styled.div`
  flex: 0.2;
`;

const selectContainerStyles = {
  width: "50%",
};
