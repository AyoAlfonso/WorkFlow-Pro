import * as React from "react";
import styled from "styled-components";

import { TextDiv } from "~/components/shared";

interface IBulletedListProps {
  align?: "left" | "center" | "right";
  bullet?: JSX.Element | string;
  bulletStyle?: any;
  containerStyle?: any;
  heading?: string;
  headingStyle?: any;
  listItems: Array<string>;
  listItemStyle?: any;
}

export const BulletedList = ({
  align,
  bullet,
  bulletStyle,
  containerStyle,
  heading,
  headingStyle,
  listItems,
  listItemStyle,
}: IBulletedListProps): JSX.Element => {
  return (
    <Container align={align} style={containerStyle}>
      {heading ? (
        <HeadingContainer style={headingStyle}>
          <StyledTextDiv color={"grey100"} fontStyle={"italic"} fontSize={"16px"}>
            {heading}
          </StyledTextDiv>
          <ListContainer>
            {listItems.map((li, idx) => (
              <ListItem style={listItemStyle} key={idx}>
                <TextDiv
                  color={"grey100"}
                  fontStyle={"italic"}
                  fontSize={"16px"}
                >{`• ${li}`}</TextDiv>
              </ListItem>
            ))}
          </ListContainer>
        </HeadingContainer>
      ) : null}
    </Container>
  );
};

interface IContainerProps {
  align?: "left" | "center" | "right";
}

const Container = styled.div<IContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${({ align }) => {
    switch (align) {
      case "left":
        return "flex-start";
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  }};
`;

const HeadingContainer = styled.div``;

const ListContainer = styled.div``;

const ListItem = styled.div``;

const StyledTextDiv = styled(TextDiv)`
  margin-bottom: 4px;
`;
