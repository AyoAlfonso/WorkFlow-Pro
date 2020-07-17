import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";
import { Flex, Box } from "rebass";

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
            <Flex>
              <Box width={1 / 4}>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core1Content }}
                ></div>
              </Box>
              <Box width={1 / 4}>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core2Content }}
                ></div>
              </Box>
              <Box width={1 / 4}>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core3Content }}
                ></div>
              </Box>
              <Box width={1 / 4}>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core4Content }}
                ></div>
              </Box>
            </Flex>
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
