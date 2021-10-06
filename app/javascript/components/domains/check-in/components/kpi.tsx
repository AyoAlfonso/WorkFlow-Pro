import * as React from "react";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Input } from "~/components/shared";
import {
  StyledInput,
  InputHeaderWithComment,
  FormElementContainer,
  InputFromUnitType,
} from "../../scorecard/shared/modal-elements";

export const KpiComponent = observer(
  (props): JSX.Element => {
    const handleChange = () => { };
    
    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>
            What's the status on your KPIs from week of <u>June 28th</u>?
          </StyledHeader>
        </Container>
      );
    };

    const renderKPIs = (): JSX.Element => {
      return (
        <Container>
          <SubHeaderText>Variance on Salaries {`<`} 2.5%</SubHeaderText>
          <ValueInputContainer>
            <FormElementContainer>
              <InputFromUnitType
                unitType={"percentage"}
                placeholder={"Add the new value..."}
                onChange={handleChange}
                defaultValue={0}
              />
            </FormElementContainer>
            <ValueSpan>2.5%</ValueSpan>
          </ValueInputContainer>
          <CommentContainer>
            <FormElementContainer>
              <InputHeaderWithComment
                comment={"optional"}
                fontSize={"14px"}
                childFontSize={"12px"}
              />
              <StyledInput
                placeholder={"Add a comment..."}
                // onChange={e => {
                //   setComment(e.target.value);
                // }}
              />
            </FormElementContainer>
          </CommentContainer>
        </Container>
      );
    };

    return (
      <>
        {renderHeading()}
        {renderKPIs()}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const SubHeaderText = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const ValueSpan = styled.span`
  font-weight: bold;
  display: inline-block;
  margin-left: 50px;
  @media only screen and (max-width: 768px) {
    margin-left: 30px;
  }
`;

const CommentContainer = styled.div`
  width: 608px;
  margin-bottom: 15px;
  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;

const ValueInputContainer = styled.div`
  width: 304px;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    width: 70%;
  }
`;
