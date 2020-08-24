import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";
import { Flex, Box } from "rebass";
import { Text } from "~/components/shared/text";
import { useTranslation } from "react-i18next";

export const HomeCoreFour = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    const { t } = useTranslation();
    return (
      <Container>
        <HomeTitle> Core Four </HomeTitle>
        {company ? (
          <ValuesContainer>
            <Flex>
              <Box width={1 / 4} sx={{ padding: 16 }}>
                <CoreFourHeaderText fontSize={2} color={"primary100"}>
                  {t("core.core1")}
                </CoreFourHeaderText>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core1Content }}
                ></div>
              </Box>
              <Box width={1 / 4} sx={{ padding: 16 }}>
                <CoreFourHeaderText fontSize={2} color={"primary100"}>
                  {t("core.core2")}
                </CoreFourHeaderText>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core2Content }}
                ></div>
              </Box>
              <Box width={1 / 4} sx={{ padding: 16 }}>
                <CoreFourHeaderText fontSize={2} color={"primary100"}>
                  {t("core.core3")}
                </CoreFourHeaderText>
                <div
                  className="trix-content"
                  dangerouslySetInnerHTML={{ __html: company.coreFour.core3Content }}
                ></div>
              </Box>
              <Box width={1 / 4} sx={{ padding: 16 }}>
                <CoreFourHeaderText fontSize={2} color={"primary100"}>
                  {t("core.core4")}
                </CoreFourHeaderText>
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
  height: 100%;
`;

const CoreFourHeaderText = styled(Text)`
  margin-top: 0;
`;
