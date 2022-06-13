import * as React from "react";
import styled from "styled-components";
import { Button } from "~/components/shared/button";

interface CheckInTemplateCardProps {
  name: string;
  description: string;
  tags: Array<string>;
}

export const CheckInTemplateCard = ({
  name,
  description,
  tags,
}: CheckInTemplateCardProps): JSX.Element => {
  return (
    <Container>
      <Title>{name}</Title>
      <Description>{description}</Description>
      <BottomRow>
        <ButtonsContainer>
          <Button
            variant={"primary"}
            mr="1em"
            width="70px"
            fontSize="12px"
            onClick={() => console.log("log")}
            small
            style={{ whiteSpace: "nowrap" }}
          >
            Set up
          </Button>
          <Button
            variant={"primaryOutline"}
            mr="1em"
            width="70px"
            fontSize="12px"
            onClick={() => console.log("log")}
            small
            style={{ whiteSpace: "nowrap" }}
          >
            Run now
          </Button>
        </ButtonsContainer>
        <TagsContainer>
          {tags.map((tag, index) => (
            <Tag key={`${tag}-${index}`}>{tag}</Tag>
          ))}
        </TagsContainer>
      </BottomRow>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 1em;
  // width: 40%;
  // max-width: 440px;
  height: 150px;
  padding: 1em 1.5em;
  position: relative;
  margin-right: 
`;

const Title = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5em;
  font-family: "Exo";
`;

const Description = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 12px;
  display: inline-block;
  line-spacing: 1.5em;
`;

const BottomRow = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  bottom: 1em;
  right: 1.5em;
  left: 1.5em;
`;
const ButtonsContainer = styled.div`
  display: flex;
`;
const TagsContainer = styled.div`
  display: flex;
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
