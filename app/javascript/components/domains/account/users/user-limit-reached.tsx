import * as React from "react";
import styled from "styled-components";
import { Heading, Button } from "~/components/shared";
import { Text } from "~/components/shared/text";

interface IUserLimitReachedProps {
  setModalOpen: any;
}

export const UserLimitReached = ({ setModalOpen }: IUserLimitReachedProps): JSX.Element => {
  return (
    <Container>
      <UserLimitText fontSize={"16px"} fontFamily={"Exo"}>
        You've reached your user limit
      </UserLimitText>
      <TeamGrowingHeadingContainer>
        <TeamGrowingHeading type={"h1"}>Your team is growing!</TeamGrowingHeading>
        <TeamGrowingHeading type={"h1"}>Time for an upgrade.</TeamGrowingHeading>
      </TeamGrowingHeadingContainer>
      <GrowthPlanContainer>
        <GrowthPlanText type={"paragraph"}>
          Your current plan only supports up to 15 users. Upgrade to the Growth plan and continue
          growing your business
        </GrowthPlanText>
      </GrowthPlanContainer>

      {/* TODO: FIND LINK TO REDIRECT IN THE FUTURE */}
      <Button
        small
        variant={"primary"}
        onClick={() => console.log("plan button clicked")}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "48px",
        }}
      >
        Upgrade your plan
      </Button>
    </Container>
  );
};

const Container = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: auto;
  margin-bottom: auto;
  padding-bottom: 72px;
  padding-top: 42px;
`;

const UserLimitText = styled(Text)`
  text-align: center;
`;

const TeamGrowingHeadingContainer = styled.div`
  margin-top: 16px;
`;

const TeamGrowingHeading = styled(Heading)`
  text-align: center;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const GrowthPlanContainer = styled.div`
  width: 256px;
  text-align: center;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
`;

const GrowthPlanText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
`;
