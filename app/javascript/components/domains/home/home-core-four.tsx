import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";

export const HomeCoreFour = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    return (
      <Container>
        <HomeTitle> Core Four </HomeTitle>
        {company ? (
          <ValuesContainer>
            <p>{company.coreFour.core1}</p>
            <p>{company.coreFour.core2}</p>
            <p>{company.coreFour.core3}</p>
            <p>{company.coreFour.core4}</p>
          </ValuesContainer>
        ) : (
          <Loading />
        )}
      </Container>
    );
  },
);

const Container = styled.div`
  margin-top: 30px;
`;

const ValuesContainer = styled(HomeContainerBorders)`
  height: 120px;
`;
