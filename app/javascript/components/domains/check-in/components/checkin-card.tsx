import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { ICheckInArtifact } from "~/models/check-in-artifacts";

interface CheckInCardProps {
  checkin: ICheckInArtifact;
}

export const CheckInCard = ({ checkin }: CheckInCardProps): JSX.Element => {
  const history = useHistory();

  const { checkInTemplate } = checkin;

  const {name, ownerType, id} = checkInTemplate
  return (
    <Container>
      <TitleContainer>
        <Title>{name}</Title>
        <IconContainer onClick={() => history.push(`/check-in/insights/2`)}>
          <Icon icon={"Settings"} size="18px" iconColor={"greyActive"} />
        </IconContainer>
      </TitleContainer>
      <InfoContainer>
        <Tag>{ownerType.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</Tag>
        <DueDate>Due: Friday, May 20th </DueDate>
        <EntryBadge>{` • Entry Needed`}</EntryBadge>
      </InfoContainer>
      <ActionsContainer>
        <ButtonsContainer>
          <Button
            variant={"primary"}
            mr="1em"
            width="80px"
            fontSize="12px"
            onClick={() => history.push(`/check-in/run/${id}`)}
            small
            style={{ whiteSpace: "nowrap" }}
          >
            Check-in
          </Button>
          <Button
            variant={"greyOutline"}
            mr="1em"
            width="80px"
            fontSize="12px"
            onClick={() => console.log("log")}
            small
          >
            Skip
          </Button>
        </ButtonsContainer>
        <StreakContainer>
          <Icon icon={"Streak"} size="24px" mr="0.5em" iconColor={"greyActive"} />
          <StreakCount>0</StreakCount>
        </StreakContainer>
      </ActionsContainer>
    </Container>
  );
};

const IconContainer = styled.div`
  display: none;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundBlue};
    ${IconContainer} {
      display: block;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font-size: 1em;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const Tag = styled.span`
  display: inline-block;
  padding: 0.5em;
  color: ${props => props.theme.colors.grey100};
  background-color: ${props => props.theme.colors.grey20};
  font-size: 0.75em;
  margin-right: 0.75em;
  border-radius: 4px;
`;

const DueDate = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 0.75em;
  margin-right: 2px;
`;

const EntryBadge = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 0.75em;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

const StreakContainer = styled.div`
  display: flex;
`;

const StreakCount = styled.span`
  display: inline-block;
  border-radius: 50%;
  padding: 0.5em 0.8em;
  border: 1px solid ${props => props.theme.colors.greyActive};
  font-size: 0.75em;
  color: ${props => props.theme.colors.greyActive};
`;
