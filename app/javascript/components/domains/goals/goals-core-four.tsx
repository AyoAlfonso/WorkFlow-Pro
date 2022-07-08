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
import { baseTheme } from "../../../themes";

interface ICoreFourValuesProps {
  showCoreFour?: boolean;
  setShowCoreFour?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GoalsCoreFour = ({
  showCoreFour,
  setShowCoreFour,
}: ICoreFourValuesProps): JSX.Element => {
  const { t } = useTranslation();

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
      <CoreFourHeader>
        <CoreFourTitle>{t<string>("core.goalsTitle")}</CoreFourTitle>
        {renderHideButton()}
      </CoreFourHeader>

      {showCoreFour && <CoreFourValues />}
    </Container>
  );
};

const CoreFourValues = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    const { t } = useTranslation();

    const instanceType = company?.accessForum ? "forum" : "teams";

    const core1Header = instanceType == "forum" ? t("forumCore.core1") : t("core.core1");
    const core2Header = instanceType == "forum" ? t("forumCore.core2") : t("core.core2");
    const core3Header = instanceType == "forum" ? t("forumCore.core3") : t("core.core3");
    const core4Header = instanceType == "forum" ? t("forumCore.core4") : t("core.core4");

    return company ? (
      <FlexContainer>
        <BoxContainer sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            {core1Header}
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.coreFour.core1Content }}
            ></div>
          </CoreFourBodyTextContainer>
        </BoxContainer>
        <BoxContainer sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            {core2Header}
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.coreFour.core2Content }}
            ></div>
          </CoreFourBodyTextContainer>
        </BoxContainer>
        <BoxContainer sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            {core3Header}
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.coreFour.core3Content }}
            ></div>
          </CoreFourBodyTextContainer>
        </BoxContainer>
        <BoxContainer sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            {core4Header}
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.coreFour.core4Content }}
            ></div>
          </CoreFourBodyTextContainer>
        </BoxContainer>
      </FlexContainer>
    ) : (
      <Loading key="core-four" />
    );
  },
);

export const CoreFourOnly = (): JSX.Element => (
  <div>
    <CoreFourValues />
  </div>
);

const boxStyle = {
  padding: 16,
  boxShadow: `1px 3px 6px ${baseTheme.colors.grayShadow}`,
  border: `0px solid ${baseTheme.colors.white}`,
  borderRadius: "10px",
};

const FlexContainer = styled(Flex)`
  gap: 0 10px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BoxContainer = styled(Box)`
  flex: 1;
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const Container = styled.div`
  flex-direction: column;
  margin-bottom: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const CoreFourHeaderText = styled(Text)`
  font-size: 24px;
  font-weight: 800;
  margin: 0px;
  margin-bottom: 15px;
`;

const CoreFourBodyTextContainer = styled.div`
  font-size: 16px;
`;

const CoreFourTitle = styled(EnlargedHomeTitle)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const CoreFourHeader = styled.div`
  display: flex;
  margin-top: -32px;
  align-items: center;
`;

const HideButtonContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: 32px;
  margin-bottom: 16px;
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
