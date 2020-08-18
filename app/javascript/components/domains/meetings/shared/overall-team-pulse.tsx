import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { Text } from "~/components/shared/text";

interface IOverallTeamPulseProps {
  value: string | number;
}

export const OverallTeamPulse = ({ value }: IOverallTeamPulseProps): JSX.Element => {
  const renderIcon = () => {
    switch (true) {
      case value <= 1:
        return <Icon icon={"Emotion-E"} size={"110px"} iconColor={"warningRed"} />;
      case value <= 2:
        return <Icon icon={"Emotion-D"} size={"110px"} iconColor={"cautionYellow"} />;
      case value <= 3:
        return <Icon icon={"Emotion-C"} size={"110px"} iconColor={"greyInactive"} />;
      case value <= 4:
        return <Icon icon={"Emotion-B"} size={"110px"} iconColor={"successGreen"} />;
      case value <= 5:
        return <Icon icon={"Emotion-A"} size={"110px"} iconColor={"finePine"} />;
    }
  };

  return (
    <Container>
      {renderIcon()}
      <RatingContainer>
        <RatingText>{value} / 5</RatingText>
      </RatingContainer>
    </Container>
  );
};

const Container = styled.div`
  padding-left: 36px;
  margin-top: 28px;
`;

const RatingContainer = styled.div``;

const RatingText = styled(Text)`
  font-size: 40px;
  margin-top: 10px;
  font-weight: bold;
`;
