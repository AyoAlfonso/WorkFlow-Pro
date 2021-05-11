import React, { useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";
import { Flex, Box } from "rebass";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { useTranslation } from "react-i18next";
import { HomeContainerBorders } from "../home/shared-components";
import { EnlargedHomeTitle } from "./shared/enlarged-home-title";

export const CoreFourValues = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    const { t } = useTranslation();

    return company ? (
      <HomeContainerBorders key="core-four">
        <Flex>
          <Box width={1 / 4} sx={{ padding: 16 }}>
            <CoreFourHeaderText fontSize={2} color={"primary100"}>
              {t("core.core1")}
            </CoreFourHeaderText>
            <CoreFourBodyTextContainer>
              <div
                className="trix-content"
                dangerouslySetInnerHTML={{ __html: company.coreFour.core1Content }}
              ></div>
            </CoreFourBodyTextContainer>
          </Box>
          <Box width={1 / 4} sx={{ padding: 16 }}>
            <CoreFourHeaderText fontSize={2} color={"primary100"}>
              {t("core.core2")}
            </CoreFourHeaderText>
            <CoreFourBodyTextContainer>
              <div
                className="trix-content"
                dangerouslySetInnerHTML={{ __html: company.coreFour.core2Content }}
              ></div>
            </CoreFourBodyTextContainer>
          </Box>
          <Box width={1 / 4} sx={{ padding: 16 }}>
            <CoreFourHeaderText fontSize={2} color={"primary100"}>
              {t("core.core3")}
            </CoreFourHeaderText>
            <CoreFourBodyTextContainer>
              <div
                className="trix-content"
                dangerouslySetInnerHTML={{ __html: company.coreFour.core3Content }}
              ></div>
            </CoreFourBodyTextContainer>
          </Box>
          <Box width={1 / 4} sx={{ padding: 16 }}>
            <CoreFourHeaderText fontSize={2} color={"primary100"}>
              {t("core.core4")}
            </CoreFourHeaderText>
            <CoreFourBodyTextContainer>
              <div
                className="trix-content"
                dangerouslySetInnerHTML={{ __html: company.coreFour.core4Content }}
              ></div>
            </CoreFourBodyTextContainer>
          </Box>
        </Flex>
      </HomeContainerBorders>
    ) : (
      <Loading key="core-four" />
    );
  },
);

const Container = styled.div`
  margin-top: 30px;
  margin-bottom: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
`

const CoreFourHeaderText = styled(Text)`
  margin-top: 16px;
  margin-bottom: 24px;
`;

const CoreFourBodyTextContainer = styled.div`
  font-size: 16px;
`;

const CoreFourTitle = styled(EnlargedHomeTitle)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

export const GoalsCoreFour = (): JSX.Element => {
  const { t } = useTranslation();
  const [ showCoreFour, setShowCoreFour ] = useState<boolean>(true);

  const renderHideButton = () => {
    return (
      <HideButtonContainer onClick={() => setShowCoreFour(!showCoreFour)}>
        <HideText>{showCoreFour ? "Hide" : "Show"} </HideText>
        <HideIconContainer>
          {showCoreFour ? (
            <HideIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
          ) : (
            <ShowIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
          )}
        </HideIconContainer>
      </HideButtonContainer>
    );
  };

  return (
    <Container>
      <TitleContainer>
        <CoreFourTitle>{t("core.goalsTitle")}</CoreFourTitle>
        {renderHideButton()}
      </TitleContainer>
      {showCoreFour && <CoreFourValues />}
    </Container>
  );
};

export const CoreFourOnly = (): JSX.Element => (
  <div>
    <CoreFourValues />
  </div>
);

const HideButtonContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: 32px;
  &: hover {
    cursor: pointer;
  }
`;

const HideText = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.greyInactive};
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 8px;
`;

const HideIconContainer = styled.div``;

const HideIcon = styled(Icon)`
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
`;

const ShowIcon = styled(Icon)`
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
`;
