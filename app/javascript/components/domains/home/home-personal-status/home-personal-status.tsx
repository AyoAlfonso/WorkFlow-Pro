import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
interface IHomePersonalStatusState {
  menuOpen: boolean;
}

export const HomePersonalStatus = observer(
  (): JSX.Element => {
    const { t } = useTranslation();

    return (
      <Container>
        <ToolsHeader>{t<string>("tools.title")}</ToolsHeader>
      </Container>
    );
  },
);

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const ToolsHeader = styled(Container)`
  width: 25%;
  margin-left: auto;
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
  margin-top: 32px;
  margin-bottom: 40px;
`;
