import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { useTranslation } from "react-i18next";

interface IOverallTeamPulseProps {
  value: number;
}

export const OverallTeamPulse = ({ value }: IOverallTeamPulseProps): JSX.Element => {
  const { t } = useTranslation();
  const renderIcon = () => {
    switch (true) {
      case value < 2:
        return <Icon icon={"Emotion-E"} size={"110px"} iconColor={"warningRed"} />;
      case value < 3:
        return <Icon icon={"Emotion-D"} size={"110px"} iconColor={"cautionYellow"} />;
      case value < 4:
        return <Icon icon={"Emotion-C"} size={"110px"} iconColor={"greyInactive"} />;
      case value < 5:
        return <Icon icon={"Emotion-B"} size={"110px"} iconColor={"successGreen"} />;
      case value == 5:
        return <Icon icon={"Emotion-A"} size={"110px"} iconColor={"finePine"} />;
    }
  };

  return (
    <Container>
      {renderIcon()}
      <RatingContainer>
        <RatingText>{value.toFixed(1)} / 5</RatingText>
      </RatingContainer>
      <LastSevenDays> {t<string>("company.lastSevenDays")}</LastSevenDays>
    </Container>
  );
};

export const OverallTeamPulseMini = ({ value }: IOverallTeamPulseProps): JSX.Element => {
  const renderIcon = () => {
    switch (true) {
      case value < 2:
        return <Icon icon={"Emotion-E"} size={"110px"} iconColor={"warningRed"} />;
      case value < 3:
        return <Icon icon={"Emotion-D"} size={"110px"} iconColor={"cautionYellow"} />;
      case value < 4:
        return <Icon icon={"Emotion-C"} size={"110px"} iconColor={"greyInactive"} />;
      case value < 5:
        return <Icon icon={"Emotion-B"} size={"110px"} iconColor={"successGreen"} />;
      case value == 5:
        return <Icon icon={"Emotion-A"} size={"110px"} iconColor={"finePine"} />;
    }
  };

  return (
    <ContainerMini>
      {renderIcon()}
      <RatingContainer>
        <RatingText>{value.toFixed(1)} / 5</RatingText>
      </RatingContainer>
    </ContainerMini>
  );
};

const Container = styled.div`
  padding-left: 36px;
  margin-top: 28px;
`;

const ContainerMini = styled.div`
  display: flex;
  flex-direction: column;
`;

const RatingContainer = styled.div``;

const RatingText = styled(Text)`
  font-size: 40px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
`;

const LastSevenDays = styled.div`
  display: block;
  font-weight: bold;
  font-size: 12px;
  margin-top: -30%;
  color: ${props => props.theme.colors.greyActive};
  padding: 5px;
`;
