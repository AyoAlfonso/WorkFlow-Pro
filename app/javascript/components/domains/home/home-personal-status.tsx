import * as React from "react";
import { path } from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";

export const HomePersonalStatus = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const { t } = useTranslation();
    const name = path(["profile", "firstName"], sessionStore) || "User";
    return (
      <Container>
        <GreetingText>{t("profile.greeting", { name })}</GreetingText>
        <DropdownContainer>Status Dropdown</DropdownContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
`;

const GreetingText = styled.p`
  font-size: 32px;
`;

const DropdownContainer = styled.div`
  margin-left: 50px;
  margin-top: 38px;
  border-radius: 5px;
  border: 1px solid #e3e3e3;
  height: 20px;
  padding: 5px;
`;
